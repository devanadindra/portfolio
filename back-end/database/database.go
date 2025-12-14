package database

import (
	"fmt"
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/devanadindra/portfolio/back-end/utils/config"
)

type OwnerDB struct {
	*gorm.DB
}

type VisitorsDB struct {
	*gorm.DB
}

func NewDBCustomer(conf *config.Config) (*VisitorsDB, error) {
	connStr := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=disable",
		conf.Database.CustomerUsername,
		conf.Database.CustomerPassword,
		conf.Database.Host,
		conf.Database.Port,
		conf.Database.Name,
	)

	var gormDB *gorm.DB
	var err error

	for i := 0; i < 20; i++ {
		gormDB, err = getGormDB(connStr)
		if err == nil {
			break
		}
		log.Print("Database not ready yet, retrying in 10 seconds...")
		time.Sleep(10 * time.Second)
	}

	if err != nil {
		return nil, err
	}

	return &VisitorsDB{gormDB}, nil
}

func NewDBAdmin(conf *config.Config) (*OwnerDB, error) {
	connStr := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=disable",
		conf.Database.AdminUsername,
		conf.Database.AdminPassword,
		conf.Database.Host,
		conf.Database.Port,
		conf.Database.Name,
	)

	var gormDB *gorm.DB
	var err error

	for i := 0; i < 20; i++ {
		gormDB, err = getGormDB(connStr)
		if err == nil {
			break
		}
		log.Print("Database not ready yet, retrying in 10 seconds...")
		time.Sleep(10 * time.Second)
	}

	if err != nil {
		return nil, err
	}

	return &OwnerDB{gormDB}, nil
}

func getGormDB(connStr string) (gormDB *gorm.DB, err error) {
	gormDB, err = gorm.Open(postgres.Open(connStr), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	db, err := gormDB.DB()
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}

	return gormDB, nil
}

func FromVisitorsDB(db *VisitorsDB) *gorm.DB { return db.DB }
func FromOwnerDB(db *OwnerDB) *gorm.DB       { return db.DB }
