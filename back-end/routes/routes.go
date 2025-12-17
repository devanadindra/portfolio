package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/devanadindra/portfolio/back-end/database"
	"github.com/devanadindra/portfolio/back-end/domains/certif"
	"github.com/devanadindra/portfolio/back-end/domains/project"
	"github.com/devanadindra/portfolio/back-end/domains/skill"
	"github.com/devanadindra/portfolio/back-end/domains/user"
	"github.com/devanadindra/portfolio/back-end/middlewares"
	apierror "github.com/devanadindra/portfolio/back-end/utils/api-error"
	"github.com/devanadindra/portfolio/back-end/utils/config"
	"github.com/devanadindra/portfolio/back-end/utils/constants"
	"github.com/devanadindra/portfolio/back-end/utils/respond"
)

func NewDependency(
	conf *config.Config,
	mw middlewares.Middlewares,
	OwnerDB *database.OwnerDB,
	VisitorsDB *database.VisitorsDB,
	userHandler user.Handler,
	projectHandler project.Handler,
	skillHandler skill.Handler,
	certifHandler certif.Handler,
) *Dependency {

	if conf.Environment != config.DEVELOPMENT_ENVIRONMENT {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()
	router.HandleMethodNotAllowed = true
	router.ContextWithFallback = true

	// middleware
	{
		router.Use(mw.AddRequestId)
		router.Use(mw.Logging)
		router.Use(mw.RateLimiter)
		router.Use(mw.Recover)
	}

	api := router.Group("/api")
	api.Static("/uploads", "./uploads")
	api.Static("/kamus_videos", "./kamus_videos")
	api.GET("/health-check", HealthCheck)

	// domain user
	user := api.Group("/user")
	{
		user.POST("/login", mw.BasicAuth, userHandler.Login)
		user.GET("/verify-token", mw.JWT(constants.OWNER), userHandler.VerifyToken)
		user.POST("/logout", mw.JWT(constants.OWNER), userHandler.Logout)
		user.POST("/reset-req", mw.BasicAuth, userHandler.ResetPassword)
		user.PATCH("/reset-submit", mw.BasicAuth, userHandler.ResetPasswordSubmit)
		user.PATCH("/password", mw.JWT(constants.OWNER), userHandler.ChangePassword)
		user.GET("/about", mw.OptionalJWT(constants.OWNER), userHandler.GetAbout)
		user.GET("/check-jwt", mw.JWT(constants.OWNER), func(ctx *gin.Context) {
			respond.Success(ctx, http.StatusOK, "JWT is valid")
		})
	}

	project := api.Group("/project")
	{
		project.GET("/", mw.JWT(constants.OWNER), projectHandler.GetProjects)
		project.GET("/all", mw.JWT(constants.OWNER), projectHandler.GetAllProjects)
		project.DELETE("/:id", mw.JWT(constants.OWNER), projectHandler.DeleteProject)
	}

	// Skill := api.Group("/skill")
	// {
	// }

	certif := api.Group("/certif")
	{
		certif.GET("/", mw.OptionalJWT(constants.OWNER), certifHandler.GetAllCertif)
		certif.GET("/:id", mw.JWT(constants.OWNER), certifHandler.GetCertifById)
		certif.DELETE("/:id", mw.JWT(constants.OWNER), certifHandler.DeleteCertif)
	}

	router.NoRoute(func(ctx *gin.Context) {
		respond.Error(ctx, apierror.NewWarn(http.StatusNotFound, "Page not found"))
	})

	router.NoMethod(func(ctx *gin.Context) {
		respond.Error(ctx, apierror.NewWarn(http.StatusMethodNotAllowed, "Method not allowed"))
	})

	return &Dependency{
		handler:    router,
		OwnerDB:    OwnerDB,
		VisitorsDB: VisitorsDB,
	}
}

func HealthCheck(ctx *gin.Context) {
	respond.Success(ctx, http.StatusOK, "server running properly")
}
