package repository

import (
	"backend/internal/models"
	"database/sql"
	"fmt"
)

type BuildingRepository struct {
	db *sql.DB
}

func NewBuildingRepository(db *sql.DB) *BuildingRepository { return &BuildingRepository{db: db} }

func (r *BuildingRepository) GetBuildings() ([]models.Building, error) {

	var res []models.Building
	query := "SELECT * FROM buildings"

	rows, err := r.db.Query(query)
	if err != nil {
		return res, fmt.Errorf("error querying buildings: %w", err)
	}
	defer rows.Close()

	for rows.Next() {

		var b models.Building
		err := rows.Scan(
			&b.BuildingID,
			&b.BuildingName,
			&b.Address,
			&b.BuildingType,
		)

		if err != nil {
			return res, fmt.Errorf("error scanning building rows: %w", err)
		}
	}

	return res, nil
}
