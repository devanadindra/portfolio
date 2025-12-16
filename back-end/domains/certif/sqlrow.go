package certif

import (
	"time"

	"github.com/google/uuid"
)

type Certificate struct {
	ID         uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name       string
	ImgUrl     string
	CertifLink string
	CreatedAt  time.Time `gorm:"autoCreateTime"`
	UpdatedAt  time.Time `gorm:"autoUpdateTime"`
}

func (Certificate) TableName() string {
	return "certificate"
}
