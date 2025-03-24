package service

import "backend/internal/repository"

type AddService struct {
	userRepo *repository.UserRepository
}

func NewAddService(userRepo *repository.UserRepository) *AddService {
	return &AddService{userRepo}
}
