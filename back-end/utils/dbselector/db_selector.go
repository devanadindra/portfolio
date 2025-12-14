package dbselector

import (
	"context"
	"net/http"

	"github.com/devanadindra/portfolio/back-end/database"
	apierror "github.com/devanadindra/portfolio/back-end/utils/api-error"
	"github.com/devanadindra/portfolio/back-end/utils/constants"
	contextUtil "github.com/devanadindra/portfolio/back-end/utils/context"
	"gorm.io/gorm"
)

type DBService struct {
	OwnerDB    *database.OwnerDB
	VisitorsDB *database.VisitorsDB
}

func NewDBService(OwnerDB *database.OwnerDB, VisitorsDB *database.VisitorsDB) *DBService {
	return &DBService{
		OwnerDB:    OwnerDB,
		VisitorsDB: VisitorsDB,
	}
}

// helper pilih DB sesuai role
func (s *DBService) GetDBByRole(ctx context.Context) (*gorm.DB, error) {
	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		return nil, apierror.NewWarn(http.StatusUnauthorized)
	}

	switch token.Claims.Role {
	case constants.ADMIN:
		return s.OwnerDB.DB, nil
	case constants.CUSTOMER:
		return s.VisitorsDB.DB, nil
	default:
		return nil, apierror.NewWarn(http.StatusUnauthorized)
	}
}
