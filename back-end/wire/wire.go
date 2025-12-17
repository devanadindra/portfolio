//go:build wireinject
// +build wireinject

package wireinject

import (
	"github.com/go-playground/validator/v10"
	_ "github.com/google/subcommands"
	"github.com/google/wire"

	"github.com/devanadindra/portfolio/back-end/database"
	"github.com/devanadindra/portfolio/back-end/domains/certif"
	"github.com/devanadindra/portfolio/back-end/domains/project"
	"github.com/devanadindra/portfolio/back-end/domains/skill"
	"github.com/devanadindra/portfolio/back-end/domains/user"
	"github.com/devanadindra/portfolio/back-end/middlewares"
	"github.com/devanadindra/portfolio/back-end/routes"
	"github.com/devanadindra/portfolio/back-end/utils/config"
	"github.com/devanadindra/portfolio/back-end/utils/dbselector"
)

var dbSet = wire.NewSet(
	database.NewDBCustomer,
	database.NewDBAdmin,
)

var dbSelectorSet = wire.NewSet(
	dbselector.NewDBService,
)

var userSet = wire.NewSet(
	user.NewService,
	user.NewHandler,
)

var projectSet = wire.NewSet(
	project.NewService,
	project.NewHandler,
)

var skillSet = wire.NewSet(
	skill.NewService,
	skill.NewHandler,
)

var certifSet = wire.NewSet(
	certif.NewService,
	certif.NewHandler,
)

func initializeDependency(config *config.Config) (*routes.Dependency, error) {

	wire.Build(
		dbSet,
		dbSelectorSet,
		validator.New,
		middlewares.NewMiddlewares,
		routes.NewDependency,
		userSet,
		projectSet,
		skillSet,
		certifSet,
	)

	return nil, nil
}
