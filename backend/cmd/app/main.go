package main

import (
	"backend/internal/config"
	"backend/internal/handler"
	"backend/internal/pkg/utils"
	"backend/internal/repository"
	"backend/internal/repository/postgres"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"log"
)

func main() {

	cfg, err := config.LoadConfig("./config.yaml")
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}
	log.Println("loaded config")

	db, err := postgres.NewPostgresDB(*cfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()
	log.Println("connected to database")

	err = utils.PrintDB(db)
	if err != nil {
		log.Printf("Failed to print database structure: %v", err)
	}

	repo := repository.NewRepository(db)
	userHandler := handler.NewUserHandler(repo.User, cfg.Secret)
	buildingHandler := handler.NewBuildingHandler(repo.Building)
	requestHandler := handler.NewRequestHandler(repo.Request, cfg.Secret)

	g := gin.Default()

	g.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST", "OPTIONS"},
		AllowHeaders: []string{"Content-Type"},
	}))

	g.POST("api/user/login", userHandler.Login)
	g.GET("api/buildings", buildingHandler.GetBuildings)
	g.POST("api/request/add", requestHandler.AddRequest)
	g.GET("api/requests", requestHandler.GetRequests)

	g.Run("0.0.0.0:8080")
}
