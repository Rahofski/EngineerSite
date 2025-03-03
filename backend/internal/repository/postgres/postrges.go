package postgres

import (
	"database/sql"
	"fmt"
	//_ "github.com/lib/pq"
)

type Config struct {
	Host     string
	Port     string
	Username string
	Password string
	DBName   string
	SSLMode  string
}

func NewPostgresDB(cfg Config) (*sql.DB, error) {

	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.Host, cfg.Port, cfg.Username, cfg.Password, cfg.DBName, cfg.SSLMode,
	)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("Unalble to open database connection: %w", err)
	}

	if err = db.Ping(); err != nil {
		return nil, fmt.Errorf("Unable to ping database^ %w", err)
	}

	return db, nil
}
