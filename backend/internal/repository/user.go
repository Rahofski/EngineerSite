package repository

import (
	"backend/internal/models"
	"database/sql"
	"fmt"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) CreateUser(user *models.User) error {

	query := "INSERT INTO users (username, password_hash, email, role) VALUES ($1, $2, $3, $4) RETURNING user_id"

	err := r.db.QueryRow(query, user.Username, user.PasswordHash, user.Email, user.Role).Scan(&user.UserID)

	if err != nil {
		return fmt.Errorf("unable to insert user: %w", err)
	}
	return nil
}
