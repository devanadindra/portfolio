package project

import (
	"net/http"

	apierror "github.com/devanadindra/portfolio/back-end/utils/api-error"
	"github.com/devanadindra/portfolio/back-end/utils/common"
	"github.com/devanadindra/portfolio/back-end/utils/respond"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type Handler interface {
	GetProjects(ctx *gin.Context)
	DeleteProject(ctx *gin.Context)
	GetAllProjects(ctx *gin.Context)
	GetProjectById(ctx *gin.Context)
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

func (h *handler) GetProjects(ctx *gin.Context) {

	res, err := h.service.GetProjects(ctx)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, res)
}

func (h *handler) DeleteProject(ctx *gin.Context) {
	id := ctx.Param("id")

	if err := h.service.DeleteProject(ctx, id); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusCreated, gin.H{"message": "kamus and video deleted successfully"})
}

func (h *handler) GetAllProjects(ctx *gin.Context) {
	filter, err := common.GetMetaData(ctx, h.validate, "created_at")
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	req := GetAllProjectsReq{
		Page:  filter.Page,
		Limit: filter.Limit,
	}

	kamusList, total, err := h.service.GetAllProjects(ctx, req, *filter)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, gin.H{
		"data":  kamusList,
		"total": total,
		"page":  filter.Page,
		"limit": filter.Limit,
	})
}

func (h *handler) GetProjectById(ctx *gin.Context) {
	arti := ctx.Param("arti")

	kamus, err := h.service.GetProjectById(ctx, arti)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusCreated, kamus)
}
