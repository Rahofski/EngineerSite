package service

import (
	"backend/internal/models"
	"backend/internal/repository"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"time"
)

type LoginService struct {
	userRepo *repository.UserRepository
	secret   string
}

func NewLoginService(userRepo *repository.UserRepository, secret string) *LoginService {
	return &LoginService{userRepo, secret}
}

func (s *LoginService) Login(request *models.LoginRequest) (string, error) {

	user, err := s.userRepo.GetByEmail(request.Email)
	if err != nil {
		return "", err
	}

	err = models.ComparePasswords(user.PasswordHash, request.Password)
	if err != nil {
		return "", err
	}

	token, err := s.generateToken(user)
	if err != nil {
		return "", err
	}

	return token, nil
}

func (s *LoginService) generateToken(user *models.User) (string, error) {

	expTime := time.Now().Add(24 * time.Hour).Unix()

	claims := jwt.MapClaims{
		"user_id":  user.UserID,
		"field_id": user.FieldID,
		"name":     user.Name,
		"exp":      expTime,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(s.secret))
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}

	return tokenString, nil
}
