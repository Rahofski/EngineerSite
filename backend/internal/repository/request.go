package repository

import (
	"backend/internal/models"
	"database/sql"
	"fmt"
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
		request.Time, //.Format(time.RFC3339),
		request.Status,
		request.Photos,
		request.TextInfo,
	).Scan(&request.RequestID)

	if err != nil {
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
		// var photosJSON []byte //string

		err = rows.Scan(
			&req.RequestID,
			&req.BuildingID,
			&req.FieldID,
			//&req.UserID,
			&req.TextInfo,
			&req.Status,
			&req.Photos,
			&req.Time,
		)

		if err != nil {
			return nil, fmt.Errorf("error scanning requests: %w", err)
		}

		//if err := json.Unmarshal([]byte(photosJSON), &req.Photos); err != nil {
		//	return nil, fmt.Errorf("error unmarshalling photos: %w", err)
		//}

		res = append(res, req)
	}

	return res, nil
}

func (r *RequestRepository) ChangeStatus(requestID int, status string) error {

	query := "UPDATE requests SET status = $1 WHERE request_id = $2"
	res, err := r.db.Exec(query, status, requestID)
	if err != nil {
		return fmt.Errorf("failed to update request status: %v", err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get affected rows: %v", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("request with ID %d not found", requestID)
	}

	return nil
}

func (r *RequestRepository) GetStatus(requestID int) (string, error) {

	query := "SELECT status FROM requests WHERE request_id = $1"
	row := r.db.QueryRow(query, requestID)

	var status string
	err := row.Scan(&status)
	if err != nil {
		return "", fmt.Errorf("failed to get status for request with ID %d: %w", requestID, err)
	}

	return status, nil
}
