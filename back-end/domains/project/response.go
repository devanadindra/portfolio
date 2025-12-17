package project

import "github.com/google/uuid"

type ProjectRes struct {
	Name        string
	Description string
	ProjectUrl  string
	Images      []ProjectImagesRes
}

type ProjectImagesRes struct {
	ProjectID uuid.UUID
	ImgUrl    string
}
