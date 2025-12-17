package project

import (
	"context"
	"errors"
	"fmt"
	"os"
	"strings"

	"github.com/devanadindra/portfolio/back-end/database"
	apierror "github.com/devanadindra/portfolio/back-end/utils/api-error"
	"github.com/devanadindra/portfolio/back-end/utils/config"
	"github.com/devanadindra/portfolio/back-end/utils/constants"
	"github.com/devanadindra/portfolio/back-end/utils/dbselector"
	"gorm.io/gorm"
)

type Service interface {
	GetProjects(ctx context.Context) (*[]ProjectRes, error)
	DeleteProject(ctx context.Context, projectId string) error
	GetAllProjects(ctx context.Context, input GetAllProjectsReq, filter constants.FilterReq) (*[]ProjectRes, int64, error)
	GetProjectById(ctx context.Context, projectId string) (*ProjectRes, error)
}

type service struct {
	authConfig config.Auth
	dbSelector *dbselector.DBService
	VisitorsDB *database.VisitorsDB
	OwnerDB    *database.OwnerDB
}

func NewService(config *config.Config, dbSelector *dbselector.DBService, VisitorsDB *database.VisitorsDB, OwnerDB *database.OwnerDB) Service {
	return &service{
		authConfig: config.Auth,
		dbSelector: dbSelector,
		VisitorsDB: VisitorsDB,
		OwnerDB:    OwnerDB,
	}
}

func (s *service) GetProjects(ctx context.Context) (*[]ProjectRes, error) {
	db, err := s.dbSelector.GetDBByRole(ctx)
	if err != nil {
		return nil, err
	}

	var projectList []Projects
	err = db.WithContext(ctx).
		Preload("Images").
		Find(&projectList).Error
	if err != nil {
		return nil, err
	}

	res := make([]ProjectRes, len(projectList))
	for i, p := range projectList {
		images := make([]ProjectImagesRes, len(p.Images))
		for j, img := range p.Images {
			images[j] = ProjectImagesRes{
				ProjectID: img.ProjectID,
				ImgUrl:    img.ImgUrl,
			}
		}

		res[i] = ProjectRes{
			Name:        p.Name,
			Description: p.Description,
			ProjectUrl:  p.ProjectUrl,
			Images:      images,
		}
	}

	return &res, nil
}

func (s *service) DeleteProject(ctx context.Context, projectId string) error {
	db, err := s.dbSelector.GetDBByRole(ctx)
	if err != nil {
		return err
	}

	return db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var project Projects

		if err := tx.Preload("Images").
			First(&project, "id = ?", projectId).Error; err != nil {
			return fmt.Errorf("project not found: %w", err)
		}

		for _, img := range project.Images {
			cleanPath := strings.TrimPrefix(img.ImgUrl, "/")

			if err := os.Remove(cleanPath); err != nil && !os.IsNotExist(err) {
				return fmt.Errorf("failed delete file %s: %w", cleanPath, err)
			}
		}

		if err := tx.Where("project_id = ?", project.ID).
			Delete(&ProjectImages{}).Error; err != nil {
			return err
		}

		if err := tx.Delete(&project).Error; err != nil {
			return err
		}

		return nil
	})
}

func (s *service) GetAllProjects(ctx context.Context, input GetAllProjectsReq, filter constants.FilterReq) (*[]ProjectRes, int64, error) {
	var total int64
	var projectList []Projects

	db, err := s.dbSelector.GetDBByRole(ctx)
	if err != nil {
		return nil, 0, err
	}

	query := db.WithContext(ctx).Model(&Projects{})

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (filter.Page - 1) * filter.Limit

	if err := query.
		Order(fmt.Sprintf("%s %s", filter.OrderBy, filter.SortOrder)).
		Limit(int(filter.Limit)).
		Offset(int(offset)).
		Find(&projectList).Error; err != nil {
		return nil, 0, err
	}

	res := make([]ProjectRes, len(projectList))
	for i, p := range projectList {
		images := make([]ProjectImagesRes, len(p.Images))
		for j, img := range p.Images {
			images[j] = ProjectImagesRes{
				ProjectID: img.ProjectID,
				ImgUrl:    img.ImgUrl,
			}
		}

		res[i] = ProjectRes{
			Name:        p.Name,
			Description: p.Description,
			ProjectUrl:  p.ProjectUrl,
			Images:      images,
		}
	}

	return &res, total, nil
}

func (s *service) GetProjectById(ctx context.Context, projectId string) (*ProjectRes, error) {
	db, err := s.dbSelector.GetDBByRole(ctx)
	if err != nil {
		return nil, err
	}

	var project Projects
	if err := db.WithContext(ctx).First(&project, "arti = ?", projectId).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apierror.ProjectNotFound(projectId)
		}
		return nil, err
	}

	return &ProjectRes{
		Name:        project.Name,
		Description: project.Description,
		ProjectUrl:  project.ProjectUrl,
	}, nil
}
