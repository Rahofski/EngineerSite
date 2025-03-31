package repository

import (
	"backend/internal/models"
	"database/sql"
	"fmt"
	"github.com/lib/pq"
	"log"
	"time"
)

type RequestRepository struct {
	db *sql.DB
}

func NewRequestRepository(db *sql.DB) *RequestRepository {

	return &RequestRepository{db: db}
}

func (r *RequestRepository) AddRequest(request *models.Request) error {

	log.Printf(
		`

	ID : %v,
	bld_ID : %v,
	field_id : %v,
	timestamp : %v,
	status : %v,
	photos : %v,
	text : %v

`, request.RequestID, request.BuildingID, request.FieldID, request.Time, request.Status, request.Photos, request.TextInfo)

	query := `
		INSERT INTO requests(
			building_id,
			field_id,
			time,
			status,
			photos,
			additional_text
		) VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING request_id
		`

	err := r.db.QueryRow(
		query,
		request.BuildingID,
		request.FieldID,
		// request.UserID,
		request.Time.Format(time.RFC3339),
		request.Status,
		pq.Array(request.Photos),
		request.TextInfo,
	).Scan(&request.RequestID)

	if err != nil {
		log.Printf(err.Error())
		return fmt.Errorf("failded to add request: %w", err)
	}

	return nil
}
