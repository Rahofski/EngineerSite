package main

import (
	"backend/internal/config"
	"backend/internal/handler"
	"backend/internal/pkg/utils"
	"backend/internal/repository"
	"backend/internal/repository/postgres"
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
	requestHandler := handler.NewRequestHandler(repo.Request)

	g := gin.Default()

	g.POST("api/user/login", userHandler.Login.Login)
	g.GET("api/building/getAll", buildingHandler.GetBuildings)
	g.POST("api/request/add", requestHandler.AddRequest)
}
