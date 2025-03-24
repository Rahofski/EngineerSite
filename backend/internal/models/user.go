package models

import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	UserID       int    `json:"user_id"`
	FieldID      int    `json:"field_id"`
	PasswordHash string `json:"password_hash"`
	Email        string `json:"email"`
	Name         string `json:"name"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func ComparePasswords(hash, plain string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(plain))
	if err != nil {
		return fmt.Errorf("passwords do not match: %w", err)
	}
	return nil
}
