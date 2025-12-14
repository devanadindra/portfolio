package routes

import (
	"context"
	"database/sql"

	"github.com/gin-gonic/gin"

	"github.com/devanadindra/portfolio/back-end/database"
	"github.com/devanadindra/portfolio/back-end/utils/logger"
)

type Dependency struct {
	handler    *gin.Engine
	OwnerDB    *database.OwnerDB
	VisitorsDB *database.VisitorsDB
}

func (d *Dependency) Close() {
	ctx := context.Background()

	if d.VisitorsDB != nil {
		if db, err := d.VisitorsDB.DB.DB(); err == nil {
			_ = db.Close()
		} else {
			logger.Error(ctx, "Error closing customer DB: %v", err)
		}
	}

	if d.OwnerDB != nil {
		if db, err := d.OwnerDB.DB.DB(); err == nil {
			_ = db.Close()
		} else {
			logger.Error(ctx, "Error closing admin DB: %v", err)
		}
	}
}

func (d *Dependency) GetHandler() *gin.Engine {
	return d.handler
}

func (d *Dependency) GetCustomerSQLDB() *sql.DB {
	db, _ := d.VisitorsDB.DB.DB()
	return db
}

func (d *Dependency) GetAdminSQLDB() *sql.DB {
	db, _ := d.OwnerDB.DB.DB()
	return db
}
