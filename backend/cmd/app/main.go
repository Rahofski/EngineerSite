package main

import (
	"backend/internal/config"
	"backend/internal/handler"
	"backend/internal/pkg/utils"
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

	err = utils.PrintDB(db)
	if err != nil {
		log.Printf("Failed to print database structure: %w", err)
	}

	repo := repository.NewUserRepository(db)
	loginHandler := handler.NewLoginHandler(service.NewLoginService(repo, cfg.Secret))

	g := gin.Default()

	g.POST("api/user/login", loginHandler.Login)
}
