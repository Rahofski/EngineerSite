package models

import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
	"regexp"
)

type User struct {
	UserID       int    `json:"user_id"`
	Username     string `json:"username"`
	PasswordHash string `json:"password_hash"`
	Email        string `json:"email"`
	Role         string `json:"role"`
}

type LoginRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required,min=8"`
}

type LoginResponse struct {
	AccessToken string       `json:"access_token"`
	User        UserResponse `json:"user"`
}

type UserResponse struct {
	UserID   int    `json:"user_id"`
	Username string `json:"username"`
	Role     string `json:"role"`
}

func (u *User) ToResponse() *UserResponse {
	return &UserResponse{
		UserID:   u.UserID,
		Username: u.Username,
		Role:     u.Role,
	}
}

func (u *User) CheckPassword(password string) error {
	return bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password))
}

type AddRequest struct {
	UserID   int    `json:"user_id"`
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
	Role     string `json:"role"`
}

func (u *AddRequest) ToUser() (*User, error) {

	passwordHashBytes, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	passwordHashStr := string(passwordHashBytes)

	return &User{
		UserID:       u.UserID,
		Username:     u.Username,
		PasswordHash: passwordHashStr,
		Email:        u.Email,
		Role:         u.Role,
	}, nil
}

func (u *AddRequest) ValidatePassword() error {

	if len(u.Password) < 8 {
		return fmt.Errorf("password must be at least 8 characters")
	}

	pattern := "^[A-Za-z0-9_]+$"
	_, err := regexp.MatchString(pattern, u.Password)
	if err != nil {
		return fmt.Errorf("password must only contain alphanumeric characters and underscores: %w", err)
	}

	return nil
}

func (u *AddRequest) ValidateRole() error {

	roles := []string{"admin", "electrician", "plumber", "carpenter", "technician"}
	flag := false

	for _, role := range roles {
		if u.Role == role {
			flag = true
			break
		}
	}

	if !flag {
		return fmt.Errorf("role '%s' is not valid", u.Role)
	}

	return nil
}
