package user

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/devanadindra/portfolio/back-end/database"
	apierror "github.com/devanadindra/portfolio/back-end/utils/api-error"
	"github.com/devanadindra/portfolio/back-end/utils/config"
	"github.com/devanadindra/portfolio/back-end/utils/constants"
	contextUtil "github.com/devanadindra/portfolio/back-end/utils/context"
	"github.com/devanadindra/portfolio/back-end/utils/dbselector"
	fileutils "github.com/devanadindra/portfolio/back-end/utils/file"
)

type Service interface {
	Login(ctx context.Context, input LoginReq, w http.ResponseWriter) (*LoginRes, error)
	Logout(ctx context.Context, input LogoutReq) (res *LogoutRes, err error)
	ValidateToken(ctx context.Context, token string) error
	ChangePassword(ctx context.Context, input ChangePasswordReq) error
	ResetPasswordSubmit(ctx context.Context, req ResetPasswordSubmitReq) (err error)
	ResetPassword(ctx context.Context, req ResetPasswordReq) (res *ResetPasswordRes, err error)
	AddAvatar(ctx context.Context, req AvatarReq) (string, error)
}

type service struct {
	authConfig config.Auth
	dbSelector *dbselector.DBService
	VisitorsDB *database.VisitorsDB
	OwnerDB    *database.OwnerDB
}

func NewService(config *config.Config, dbSelector *dbselector.DBService, VisitorsDB *database.VisitorsDB, OwnerDB *database.OwnerDB) Service {
	return &service{
		authConfig: config.Auth,
		dbSelector: dbSelector,
		VisitorsDB: VisitorsDB,
		OwnerDB:    OwnerDB,
	}
}

func (s *service) Login(ctx context.Context, input LoginReq, w http.ResponseWriter) (*LoginRes, error) {
	var err error
	var userID uuid.UUID

	switch input.Role {
	case constants.OWNER:
		var owner Owner
		db := s.OwnerDB.DB
		err = db.WithContext(ctx).Where("email = ?", input.Email).First(&owner).Error
		if err == nil {
			if !comparePassword(owner.Password, input.Password) {
				return nil, apierror.NewWarn(http.StatusUnauthorized, ErrInvalidCredentials)
			}
			userID = owner.ID
		}
	default:
		return nil, apierror.NewWarn(http.StatusBadRequest, "role tidak valid")
	}

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, apierror.NewWarn(http.StatusUnauthorized, ErrEmailNotFound)
		}
		return nil, apierror.FromErr(err)
	}

	expirationTime := time.Now().Add(s.authConfig.JWT.ExpireIn)
	claims := &constants.JWTClaims{
		UserID: userID,
		Email:  input.Email,
		Role:   input.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(s.authConfig.JWT.SecretKey))
	if err != nil {
		return nil, apierror.FromErr(err)
	}

	return &LoginRes{
		Role:    input.Role,
		Token:   tokenString,
		Expires: expirationTime,
	}, nil
}

func (s *service) Logout(ctx context.Context, input LogoutReq) (res *LogoutRes, err error) {
	db, err := s.dbSelector.GetDBByRole(ctx)
	if err != nil {
		return nil, err
	}

	err = db.WithContext(ctx).Create(InvalidToken{
		Token:   input.Token,
		Expires: input.Expires,
	}).Error
	if err != nil {
		return nil, err
	}

	return &LogoutRes{
		LoggedOut: true,
	}, nil
}

func (s *service) ValidateToken(ctx context.Context, token string) error {
	db, err := s.dbSelector.GetDBByRole(ctx)
	if err != nil {
		db = s.VisitorsDB.DB
	}

	var invalidToken InvalidToken
	if err := db.WithContext(ctx).Where("token = ?", token).First(&invalidToken).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil
		}
		return err
	}

	return errors.New("token is blacklisted")
}

func (s *service) ChangePassword(ctx context.Context, input ChangePasswordReq) error {
	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		return err
	}

	db, err := s.dbSelector.GetDBByRole(ctx)
	if err != nil {
		return err
	}

	var userID = token.Claims.UserID
	hashedPassword, err := hashPassword(input.NewPassword)
	if err != nil {
		return apierror.FromErr(err)
	}

	var role = token.Claims.Role

	switch role {
	case constants.OWNER:
		var owner Owner
		if err = db.WithContext(ctx).Where("id = ?", userID).First(&owner).Error; err == nil {
			if !comparePassword(owner.Password, input.CurrentPassword) {
				return apierror.NewWarn(http.StatusUnauthorized, ErrInvalidCurPassword)
			}
			owner.Password = hashedPassword
			if err = db.WithContext(ctx).Save(&owner).Error; err != nil {
				return err
			}
		}
	}

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return apierror.NewWarn(http.StatusUnauthorized, ErrInvalidCurPassword)
		}
		return err
	}

	return nil
}

func (s *service) AddAvatar(ctx context.Context, req AvatarReq) (string, error) {
	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		return "", err
	}
	db, err := s.dbSelector.GetDBByRole(ctx)
	if err != nil {
		return "", err
	}

	userID := token.Claims.UserID
	role := token.Claims.Role

	var oldAvatar string
	switch role {
	case constants.OWNER:
		var owner Owner
		err = db.WithContext(ctx).Where("id = ?", userID).First(&owner).Error
		if err != nil {
			return "", apierror.FromErr(err)
		}
		oldAvatar = owner.AvatarUrl
	}

	file := req.AvatarUrl
	ext := filepath.Ext(file.Filename)

	filename, err := fileutils.GenerateMediaName(userID.String())
	if err != nil {
		return "", apierror.FromErr(err)
	}

	filename = fmt.Sprintf("%s%s", filename, ext)
	newPath := filepath.Join("uploads", "avatars", filename)

	if err := os.MkdirAll(filepath.Dir(newPath), os.ModePerm); err != nil {
		return "", apierror.FromErr(err)
	}

	if err := fileutils.SaveMedia(ctx, file, newPath); err != nil {
		return "", err
	}

	newUrl := "/uploads/avatars/" + filename
	switch role {
	case constants.OWNER:
		if err := db.WithContext(ctx).Model(&Owner{}).
			Where("id = ?", userID).
			Update("avatar_url", newUrl).Error; err != nil {
			return "", err
		}
	}

	if oldAvatar != "" {
		oldPath := strings.TrimPrefix(oldAvatar, "/")
		if err := os.Remove(oldPath); err != nil && !os.IsNotExist(err) {
			return "", apierror.FromErr(err)
		}
	}

	return newUrl, nil
}

func (s *service) ResetPassword(ctx context.Context, req ResetPasswordReq) (res *ResetPasswordRes, err error) {
	db := s.OwnerDB.DB

	switch req.Role {
	case constants.OWNER:
		var owner Owner
		err = db.WithContext(ctx).
			Where("email = ?", req.Email).
			First(&owner).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("admin not found")
		} else if err != nil {
			return nil, err
		}
		res = &ResetPasswordRes{
			Email: owner.Email,
		}
		return res, nil
	default:
		return nil, errors.New("invalid role")
	}
}

func (s *service) ResetPasswordSubmit(ctx context.Context, req ResetPasswordSubmitReq) (err error) {
	db := s.OwnerDB.DB

	hashedPassword, err := hashPassword(req.NewPassword)
	if err != nil {
		return apierror.FromErr(err)
	}

	switch req.Role {
	case constants.OWNER:
		var owner Owner
		err = db.WithContext(ctx).
			Where("email = ?", req.Email).
			First(&owner).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return err
		} else if err != nil {
			return err
		}
		owner.Password = hashedPassword
		if err = db.WithContext(ctx).Save(&owner).Error; err != nil {
			return err
		}

		return nil
	default:
		return nil
	}
}
