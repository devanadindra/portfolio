package dbselector

import (
	"context"

	"github.com/devanadindra/portfolio/back-end/database"
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
		return s.VisitorsDB.DB, nil
	}

	switch token.Claims.Role {
	case constants.OWNER:
		return s.OwnerDB.DB, nil
	case constants.VISITORS:
		return s.VisitorsDB.DB, nil
	default:
		return s.VisitorsDB.DB, nil
	}
}
