package service

import (
	"backend/internal/models"
	"backend/internal/repository"
)

type AddService struct {
	UserRepo *repository.UserRepository
}

func NewUserAddService(userRepo *repository.UserRepository) *AddService {
	return &AddService{UserRepo: userRepo}
}

func AddUser(user *models.AddRequest) (*models.UserResponse, error) {
	return nil, nil
}
