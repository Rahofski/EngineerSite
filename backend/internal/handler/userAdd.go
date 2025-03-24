package handler

import (
	"backend/internal/repository"
	"backend/internal/service"
)

type AddHandler struct {
	service *service.AddService
}

func NewAddHandler(userRepo *repository.UserRepository) *AddHandler {
	return &AddHandler{service.NewAddService(userRepo)}
}
