package certif

import (
	"net/http"

	apierror "github.com/devanadindra/portfolio/back-end/utils/api-error"
	"github.com/devanadindra/portfolio/back-end/utils/common"
	"github.com/devanadindra/portfolio/back-end/utils/respond"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type Handler interface {
	GetCertifById(ctx *gin.Context)
	DeleteCertif(ctx *gin.Context)
	GetAllCertif(ctx *gin.Context)
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

func (h *handler) GetCertifById(ctx *gin.Context) {
	id := ctx.Param("id")

	res, err := h.service.GetCertifById(ctx, id)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, res)
}

func (h *handler) DeleteCertif(ctx *gin.Context) {
	id := ctx.Param("id")

	if err := h.service.DeleteCertif(ctx, id); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusCreated, gin.H{"message": "kuis deleted successfully"})
}

func (h *handler) GetAllCertif(ctx *gin.Context) {
	filter, err := common.GetMetaData(ctx, h.validate, "created_at", "name")
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	req := GetAllCertifReq{
		Page:  filter.Page,
		Limit: filter.Limit,
	}

	kuisList, total, err := h.service.GetAllCertif(ctx, req, *filter)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, gin.H{
		"data":  kuisList,
		"total": total,
		"page":  filter.Page,
		"limit": filter.Limit,
	})
}
