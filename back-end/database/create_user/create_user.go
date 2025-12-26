package main

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load("../../.env"); err != nil {
		log.Println("Warning: .env file not loaded:", err)
	}

	dbHost := os.Getenv("BACKEND_DATABASE_CONTAINER")
	dbPort := os.Getenv("BACKEND_DATABASE_CONTAINER_PORT")
	dbName := os.Getenv("BACKEND_DATABASE_NAME")
	dbRoot := os.Getenv("BACKEND_DATABASE_ROOT_USERNAME")
	dbRootPass := os.Getenv("BACKEND_DATABASE_ROOT_PASSWORD")
	visitorUser := os.Getenv("BACKEND_DATABASE_CUSTOMER_USERNAME")
	customerPass := os.Getenv("BACKEND_DATABASE_CUSTOMER_PASSWORD")
	adminUser := os.Getenv("BACKEND_DATABASE_ADMIN_USERNAME")
	adminPass := os.Getenv("BACKEND_DATABASE_ADMIN_PASSWORD")

	dsnRoot := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbRoot, dbRootPass, dbName,
	)
	db, err := gorm.Open(postgres.Open(dsnRoot), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect as root:", err)
	}

	// CREATE USER jika belum ada
	createUserSQL := fmt.Sprintf(`
DO $$
BEGIN
	IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '%s') THEN
		CREATE USER %s WITH PASSWORD '%s';
	END IF;
	IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '%s') THEN
		CREATE USER %s WITH PASSWORD '%s';
	END IF;
END
$$;
`, visitorUser, visitorUser, customerPass, adminUser, adminUser, adminPass)

	if err := db.Exec(createUserSQL).Error; err != nil {
		log.Fatal("Failed to create users:", err)
	}
	log.Println("Customer and Admin users created successfully!")

	grantCustomerSQL := fmt.Sprintf(`
		GRANT SELECT ON about TO %s;
		GRANT SELECT ON skills TO %s;
		GRANT SELECT ON projects TO %s;
		GRANT SELECT ON certificate TO %s;
		GRANT SELECT ON project_images TO %s;
	`, visitorUser, visitorUser, visitorUser, visitorUser, visitorUser)

	if err := db.Exec(grantCustomerSQL).Error; err != nil {
		log.Fatal("Failed to grant privileges to visitors_app:", err)
	}
	log.Println("Privileges granted to visitors_app successfully!")

	grantAdminSQL := fmt.Sprintf(`
DO $$
DECLARE
    tbl RECORD;
BEGIN
    FOR tbl IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
          AND tablename <> 'schema_migrations'
    LOOP
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE ' || quote_ident(tbl.tablename) || ' TO ' || quote_ident('%s');
    END LOOP;
END
$$;
`, adminUser)

	if err := db.Exec(grantAdminSQL).Error; err != nil {
		log.Fatal("Failed to grant privileges to admin_app:", err)
	}
	log.Println("All privileges granted to admin_app successfully!")
}
