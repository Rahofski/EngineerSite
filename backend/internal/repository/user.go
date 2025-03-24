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

func (r *UserRepository) GetByEmail(email string) (*models.User, error) {

	var user models.User
	query := "SELECT user_id, field_id, password_hash, email, name FROM users WHERE email = $1"
	err := r.db.QueryRow(query, email).Scan(
		&user.UserID,
		&user.FieldID,
		&user.PasswordHash,
		&user.Email,
		&user.Name,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found: %w", err)
		}

		return nil, fmt.Errorf("unable to find user: %w", err)
	}

	return &user, nil
}
