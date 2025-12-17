package project

import (
	"time"

	"github.com/google/uuid"
)

type Projects struct {
	ID          uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name        string
	Description string
	ProjectUrl  string
	Images      []ProjectImages `gorm:"foreignKey:ProjectID;references:ID"`
	CreatedAt   time.Time       `gorm:"autoCreateTime"`
	UpdatedAt   time.Time       `gorm:"autoUpdateTime"`
}

func (Projects) TableName() string {
	return "projects"
}

type ProjectImages struct {
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	ProjectID uuid.UUID `gorm:"type:uuid;not null"`
	ImgUrl    string
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

func (ProjectImages) TableName() string {
	return "project_images"
}
