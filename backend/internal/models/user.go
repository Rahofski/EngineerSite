package models

import (
	"golang.org/x/crypto/bcrypt"
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

type LoginResponce struct {
	AccessToken string       `json:"access_token"`
	User        UserResponce `json:"user"`
}

type UserResponce struct {
	UserID   int    `json:"user_id"`
	Username string `json:"username"`
	Role     string `json:"role"`
}

func (u *User) ToResponce() *UserResponce {
	return &UserResponce{
		UserID:   u.UserID,
		Username: u.Username,
		Role:     u.Role,
	}
}

func (u *User) CheckPassword(password string) error {
	return bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password))
}
