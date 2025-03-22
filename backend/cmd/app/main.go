package main

import (
	"backend/internal/config"
	"backend/internal/handler"
	"backend/internal/repository"
	"backend/internal/repository/postgres"
	"backend/internal/service"
	"github.com/gin-gonic/gin"
	"log"
)

func main() {

	cfg, err := config.LoadConfig("./config.yaml")
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	db, err := postgres.NewPostgresDB(*cfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	/*err = utils.PrintDB(db)
	if err != nil {
		log.Printf("Failed to print database structure: %w", err)
	}*/

	repo := repository.NewRepository(db)
	authHandler := handler.NewAuthHandler(service.NewAuthService(&repo.User, cfg.Secret))

	r := gin.Default()

	r.POST("/user/login", authHandler.LogIn)

	//if err := r.Run(cfg.Server.Adress); err != nil {log.Fatalf("Failed to start server: %v", err)}
}
