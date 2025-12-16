package certif

import (
	"context"
	"errors"
	"fmt"

	"github.com/devanadindra/portfolio/back-end/database"
	apierror "github.com/devanadindra/portfolio/back-end/utils/api-error"
	"github.com/devanadindra/portfolio/back-end/utils/config"
	"github.com/devanadindra/portfolio/back-end/utils/constants"
	contextUtil "github.com/devanadindra/portfolio/back-end/utils/context"
	"github.com/devanadindra/portfolio/back-end/utils/dbselector"
	"gorm.io/gorm"
)

type Service interface {
	GetAllCertif(ctx context.Context, input GetAllCertifReq, filter constants.FilterReq) (*[]CertifRes, int64, error)
	GetCertifById(ctx context.Context, kuisId string) (*CertifRes, error)
	DeleteCertif(ctx context.Context, kuisId string) error
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

func (s *service) GetAllCertif(ctx context.Context, input GetAllCertifReq, filter constants.FilterReq) (*[]CertifRes, int64, error) {
	var total int64
	var certifList []Certificate

	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		return nil, 0, err
	}

	db, err := s.dbSelector.GetDBByRole(ctx)
	if err != nil {
		return nil, 0, err
	}

	query := db.WithContext(ctx).Model(&Certificate{})

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (filter.Page - 1) * filter.Limit

	if err := query.
		Order(fmt.Sprintf("%s %s", filter.OrderBy, filter.SortOrder)).
		Preload("StatsKuis", "user_id = ?", token.Claims.UserID).
		Limit(int(filter.Limit)).
		Offset(int(offset)).
		Find(&certifList).Error; err != nil {
		return nil, 0, err
	}

	res := make([]CertifRes, len(certifList))
	for i, k := range certifList {
		res[i] = CertifRes{
			ID:         k.ID.String(),
			Name:       k.Name,
			ImgUrl:     k.ImgUrl,
			CertifLink: k.CertifLink,
		}
	}

	return &res, total, nil
}

func (s *service) GetCertifById(ctx context.Context, kuisId string) (*CertifRes, error) {
	db, err := s.dbSelector.GetDBByRole(ctx)
	if err != nil {
		return nil, err
	}

	var certif Certificate
	err = db.WithContext(ctx).
		Where("id =?", kuisId).
		Find(&certif).Error
	if err != nil {
		return nil, err
	}

	res := CertifRes{
		ID:         certif.ID.String(),
		Name:       certif.Name,
		ImgUrl:     certif.ImgUrl,
		CertifLink: certif.CertifLink,
	}

	return &res, nil
}

func (s *service) DeleteCertif(ctx context.Context, certifId string) error {
	db, err := s.dbSelector.GetDBByRole(ctx)
	if err != nil {
		return apierror.FromErr(err)
	}

	var certif Certificate
	if err := db.WithContext(ctx).First(&certif, "id = ?", certifId).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return apierror.LatihanNotFound(certifId)
		}
		return apierror.FromErr(err)
	}

	if err := db.WithContext(ctx).Delete(&certif).Error; err != nil {
		return apierror.FromErr(err)
	}

	return nil
}
