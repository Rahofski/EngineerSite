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

func (r *UserRepository) GetByEmail(email string) (*models.User, error) {

	var user models.User
	query := "SELECT user_id, username, password_hash, email, role FROM users WHERE email = $1"
	err := r.db.QueryRow(query, email).Scan(
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

func (r *UserRepository) Create(user *models.User) error {

	query := "INSERT INTO users (username, password_hash, email, role) VALUES ($1, $2, $3, $4) RETURNING user_id"

	err := r.db.QueryRow(query, user.Username, user.PasswordHash, user.Email, user.Role).Scan(&user.UserID)
	if err != nil {
		return fmt.Errorf("unable to insert user: %w", err)
	}

	return nil
}
