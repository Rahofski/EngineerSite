package service

import "backend/internal/repository"

type UserAddService struct {
	userRepo *repository.UserRepository
}

func NewAddService(userRepo *repository.UserRepository) *UserAddService {
	return &UserAddService{userRepo}
}
