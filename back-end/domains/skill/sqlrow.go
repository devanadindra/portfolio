package skill

import (
	"time"

	"github.com/google/uuid"
)

type Skill struct {
	ID         uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	AboutID    uuid.UUID `gorm:"type:uuid;not null"`
	Name       string
	Ratio      int
	Experience int
	Period     string
	ImgUrl     string
	CreatedAt  time.Time `gorm:"autoCreateTime"`
	UpdatedAt  time.Time `gorm:"autoUpdateTime"`
}

func (Skill) TableName() string {
	return "skills"
}
