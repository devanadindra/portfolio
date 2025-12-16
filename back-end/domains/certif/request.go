package certif

type DeleteKuisReq struct {
	ID string `json:"id" binding:"required"`
}

type GetAllCertifReq struct {
	Page  int64
	Limit int64
}

type StatsKuisReq struct {
	KuisID string `json:"kuis_id" binding:"required"`
	Score  int    `json:"score" binding:"required"`
}
