package repository

import (
	"backend/internal/models"
	"database/sql"
	"fmt"
	"github.com/lib/pq"
)

type RequestRepository struct {
	db *sql.DB
}

func NewRequestRepository(db *sql.DB) *RequestRepository {

	return &RequestRepository{db: db}
}

func (r *RequestRepository) AddRequest(request *models.Request) error {

	query := `
		INSERT INTO requests(
			building_id,
			field_id,
			user_id,
			time,
			status,
			photos,
			additional_text,
		) VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING request_id
		`

	err := r.db.QueryRow(
		query,
		request.BuildingID,
		request.FieldID,
		request.UserID,
		request.Time,
		request.Status,
		pq.Array(request.Photos),
		request.TextInfo,
	).Scan(&request.RequestID)

	if err != nil {
		return fmt.Errorf("failded to add request: %w", err)
	}

	return nil
}
