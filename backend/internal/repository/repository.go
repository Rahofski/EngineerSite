package repository

import (
	"database/sql"
)

type Repository struct {
	User     *UserRepository
	Request  *RequestRepository
	Building *BuildingRepository
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{
		User:     NewUserRepository(db),
		Request:  NewRequestRepository(db),
		Building: NewBuildingRepository(db),
	}
}
