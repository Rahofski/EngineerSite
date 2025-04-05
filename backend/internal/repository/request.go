package repository

import (
	"backend/internal/models"
	"database/sql"
	"encoding/json"
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

func (r *RequestRepository) GetRequests(fieldID int) ([]models.Request, error) {

	var res []models.Request
	var rows *sql.Rows
	var err error

	var query string
	if fieldID == 4 {
		query = `SELECT * FROM requests`
		rows, err = r.db.Query(query)
	} else {
		query = `SELECT * FROM requests WHERE field_id = $1`
		rows, err = r.db.Query(query, fieldID)
	}

	if err != nil {
		return nil, fmt.Errorf("error querying requests: %w", err)
	}
	defer rows.Close()

	for rows.Next() {

		var req models.Request
		var photosJSON string

		err = rows.Scan(
			&req.RequestID,
			&req.BuildingID,
			&req.FieldID,
			&req.Time,
			&req.Status,
			&photosJSON,
			&req.TextInfo,
		)

		if err != nil {
			return nil, fmt.Errorf("error scanning buildings: %w", err)
		}

		if err := json.Unmarshal([]byte(photosJSON), &req.Photos); err != nil {
			return nil, fmt.Errorf("error unmarshalling photos: %w", err)
		}

		res = append(res, req)
	}

	return res, nil
}
