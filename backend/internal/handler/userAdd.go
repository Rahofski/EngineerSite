package handler

import (
	"backend/internal/repository"
	"backend/internal/service"
)

type AddHandler struct {
	service *service.UserAddService
}

func NewAddHandler(userRepo *repository.UserRepository) *AddHandler {
	return &AddHandler{service.NewAddService(userRepo)}
}
