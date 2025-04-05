package models

import (
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"time"
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

type AddRequest struct {
	FieldID  int    `json:"field_id"`
	Password string `json:"password"`
	Email    string `json:"email"`
	Name     string `json:"name"`
}

func ComparePasswords(hash, plain string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(plain))
	if err != nil {
		return fmt.Errorf("passwords do not match: %w", err)
	}
	return nil
}

type Token struct {
	UserID  int       `json:"user_id"`
	FieldID int       `json:"field_id"`
	Name    string    `json:"name"`
	Exp     time.Time `json:"exp"`
}

func ParseToken(tokenString, secret string) (*Token, error) {

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {

		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(secret), nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, fmt.Errorf("invalid token claims structure")
	}

	var tokenStruct Token

	if userID, ok := claims["user_id"].(float64); ok {
		tokenStruct.UserID = int(userID)
	} else {
		return nil, fmt.Errorf("invalid or missing user_id in token")
	}

	if fieldID, ok := claims["field_id"].(float64); ok {
		tokenStruct.FieldID = int(fieldID)
	} else {
		return nil, fmt.Errorf("invalid or missing field_id in token")
	}

	if name, ok := claims["name"].(string); ok {
		tokenStruct.Name = name
	} else {
		return nil, fmt.Errorf("invalid or missing name in token")
	}

	if exp, ok := claims["exp"].(float64); ok {
		tokenStruct.Exp = time.Unix(int64(exp), 0)
	} else {
		return nil, fmt.Errorf("invalid or missing exp in token")
	}

	return &tokenStruct, nil
}
