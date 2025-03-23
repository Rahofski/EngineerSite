package service

import (
	"backend/internal/models"
	"backend/internal/repository"
	"fmt"
)

type AddService struct {
	UserRepo *repository.UserRepository
}

func NewAddService(userRepo *repository.UserRepository) *AddService {
	return &AddService{UserRepo: userRepo}
}

func (s *AddService) AddUser(u *models.AddRequest) (*models.UserResponse, error) {

	if err := u.ValidatePassword(); err != nil {
		return nil, fmt.Errorf("invalid password: %w", err)
	}

	if err := u.ValidateRole(); err != nil {
		return nil, fmt.Errorf("invalid role: %w", err)
	}

	user, err := u.ToUser()
	if err != nil {
		return nil, err
	}

	userByName, err := s.UserRepo.GetByUsername(user.Username)
	if userByName != nil {
		return userByName.ToResponse(), fmt.Errorf("user already exists")
	}

	userByEmail, err := s.UserRepo.GetByEmail(user.Email)
	if userByEmail != nil {
		return userByEmail.ToResponse(), fmt.Errorf("user already exists")
	}

	err = s.UserRepo.Create(user)
	if err != nil {
		return nil, err
	}

	return user.ToResponse(), nil
}
