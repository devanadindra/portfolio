package user

import (
	"time"

	"github.com/devanadindra/portfolio/back-end/utils/constants"
)

type LoginRes struct {
	Role    constants.ROLE `json:"role"`
	Token   string         `json:"token"`
	Expires time.Time      `json:"expires"`
}

type VerifyTokenRes struct {
	TokenVerified bool `json:"tokenVerified"`
}

type LogoutRes struct {
	LoggedOut bool `json:"loggedOut"`
}

type ResetPasswordRes struct {
	Email string
}
