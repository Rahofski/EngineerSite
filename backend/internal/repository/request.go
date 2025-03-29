package repository

import (
	"database/sql"
)

type RequestRepository struct {
	db *sql.DB
}

func NewRequestRepository(db *sql.DB) *RequestRepository {

	return &RequestRepository{db: db}
}
