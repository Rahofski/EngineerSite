package service

import (
	"backend/internal/models"
	"backend/internal/repository"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
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

func (s *AuthService) Login(username, password string) (*models.LoginResponce, error) {

	// get user by usesrname

	user, err := s.UserRepo.GetByUsername(username)
	if err != nil {
		return nil, fmt.Errorf("failed to find user: %w", err)
	}
	if user == nil {
		return nil, fmt.Errorf("invalid username or password")
	}

	// chek password

	err = user.CheckPassword(password)
	if err != nil {
		return nil, fmt.Errorf("invalid password")
	}

	// generate token

	token, err := s.generateToken(user)
	if err != nil {
		return nil, fmt.Errorf("failed to generate token: %w", err)
	}

	// do responce

	return &models.LoginResponce{
		AccessToken: token,
		User:        *user.ToResponce(),
	}, nil
}

func (s *AuthService) generateToken(user *models.User) (string, error) {

	claims := jwt.MapClaims{
		"user_id":  user.UserID,
		"username": user.Username,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.secret))
}
