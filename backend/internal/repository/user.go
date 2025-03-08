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

func (r *UserRepository) GetByUsername(username string) (*models.User, error) {

	var user models.User
	query := "SELECT user_id, username, password_hash, email, role FROM users WHERE username = $1"
	err := r.db.QueryRow(query, username).Scan(
		&user.UserID,
		&user.Username,
		&user.PasswordHash,
		&user.Email,
		&user.Role,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found: %w", err)
		}

		return nil, fmt.Errorf("unable to find user: %w", err)
	}

	return &user, nil
}
