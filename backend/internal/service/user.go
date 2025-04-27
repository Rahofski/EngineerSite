package service

import (
	"backend/internal/models"
	"backend/internal/repository"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"time"
)

type UserService struct {
	userRepo *repository.UserRepository
	Secret   string
}

func NewUserService(userRepo *repository.UserRepository, secret string) *UserService {
	return &UserService{userRepo, secret}
}

func (s *UserService) Login(request *models.LoginRequest) (string, error) {

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

func (s *UserService) generateToken(user *models.User) (string, error) {

	expTime := time.Now().Add(24 * time.Hour).Unix()

	claims := jwt.MapClaims{
		"user_id":  user.UserID,
		"field_id": user.FieldID,
		"name":     user.Name,
		"exp":      expTime,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(s.Secret))
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}

	return tokenString, nil
}

func (s *UserService) AddUser(addReq *models.AddRequest) (int, error) {

	_, err := s.userRepo.GetByEmail(addReq.Email)
	if err == nil {
		return -1, fmt.Errorf("user already exists")
	}

	userID, err := s.userRepo.AddUser(addReq)
	if err != nil {
		return -1, fmt.Errorf("failed to add user: %w", err)
	}

	return userID, nil
}

func (s *UserService) RemoveUser(email string) error {

	err := s.userRepo.RemoveUser(email)
	if err != nil {
		return err
	}
	return nil
}
