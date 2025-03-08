package api_service

import (
	"backend/internal/models"
	"backend/internal/repository"
	"fmt"
)

type AuthService struct {
	UserRepo *repository.UserRepository
	secret   string
}

func NewAuthService(userRepo *repository.UserRepository, secret string) *AuthService {

	return &AuthService{
		UserRepo: userRepo,
		secret:   secret,
	}
}

func (auth *AuthService) Login(username, password string) (*models.LoginResponce, error) {

	// TODO: get user by usesrname

	user, err := auth.UserRepo.GetByUsername(username)
	if err != nil {
		return nil, fmt.Errorf("failed to find user: %w", err)
	}
	if user == nil {
		return nil, fmt.Errorf("invalid username or password")
	}

	// TODO: chek password

	err = user.CheckPassword(password)
	if err != nil {
		return nil, fmt.Errorf("invalid password")
	}

	// TODO: generate token

	// TODO: do responce

	return nil, nil
}

func generateToken(user *models.User) (string, error) {
	return "", nil
}
