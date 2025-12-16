package skill

import (
	"github.com/devanadindra/portfolio/back-end/database"
	"github.com/devanadindra/portfolio/back-end/utils/config"
	"github.com/devanadindra/portfolio/back-end/utils/dbselector"
)

type Service interface {
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
