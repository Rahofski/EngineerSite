package repository

import (
	"backend/internal/models"
	"database/sql"
	"fmt"
	"golang.org/x/crypto/bcrypt"
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

func (r *UserRepository) AddUser(addReq *models.AddRequest) (int, error) {

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(addReq.Password), bcrypt.DefaultCost)
	if err != nil {
		return 0, fmt.Errorf("unable to hash password: %w", err)
	}

	query := `
		INSERT INTO users(
			field_id,
			password_hash,
			email,
			name
		) VALUES ($1, $2, $3, $4)
		RETURNING user_id
		`

	var userID int
	err = r.db.QueryRow(
		query,
		addReq.FieldID,
		hashedPassword,
		addReq.Email,
		addReq.Name,
	).Scan(userID)

	if err != nil {
		return -1, fmt.Errorf("unable to add user: %w", err)
	}

	return userID, nil
}
