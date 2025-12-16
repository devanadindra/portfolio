package certif

type DeleteKuisReq struct {
	ID string `json:"id" binding:"required"`
}

type GetAllCertifReq struct {
	Page  int64
	Limit int64
}
