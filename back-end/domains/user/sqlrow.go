package user

import (
	"time"

	"github.com/google/uuid"
)

type InvalidToken struct {
	Token   string
	Expires time.Time
}

func (InvalidToken) TableName() string {
	return "invalid_token"
}

type Owner struct {
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name      string
	Username  string `gorm:"unique"`
	Password  string
	Email     string `gorm:"unique"`
	AvatarUrl string
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

func (Owner) TableName() string {
	return "owner"
}

type About struct {
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name      string
	Nim       string
	Major     string
	Faculty   string
	Biography string
	Slogan    string
	ImgUrl    string
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

func (About) TableName() string {
	return "about"
}
