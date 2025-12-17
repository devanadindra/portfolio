package project

import "mime/multipart"

type KamusReq struct {
	Arti     string                `form:"arti" binding:"required"`
	Kategori string                `form:"kategori" binding:"required"`
	Video    *multipart.FileHeader `form:"video" binding:"required"`
}

type DeleteKamusReq struct {
	ID string `json:"id" binding:"required"`
}

type GetAllProjectsReq struct {
	Page  int64
	Limit int64
}
