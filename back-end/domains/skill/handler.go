package skill

import (
	"github.com/go-playground/validator/v10"
)

type Handler interface {
}

type handler struct {
	service  Service
	validate *validator.Validate
}

func NewHandler(service Service, validate *validator.Validate) Handler {
	return &handler{
		service:  service,
		validate: validate,
	}
}
