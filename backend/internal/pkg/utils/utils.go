package utils

import (
	"database/sql"
	"fmt"
)

func PrintDB(db *sql.DB) error {
	tables, err := getTables(db)
	if err != nil {
		return fmt.Errorf("Failed to get tables: %v", err)
	}

	fmt.Println("Tables in the database:")
	for _, table := range tables {
		fmt.Println(" " + table)
	}

	fmt.Println()

	for _, table := range tables {
		columns, err := getColumns(db, table)
		if err != nil {
			return fmt.Errorf("Failed to get columns for table %s: %v", table, err)
		}

		fmt.Printf("Columns in table %s:\n", table)
		for _, column := range columns {
			fmt.Printf("  %s (%s, nullable: %v)\n", column.Name, column.Type, column.Nullable)
		}
	}

	return nil
}

func getTables(db *sql.DB) ([]string, error) {
	rows, err := db.Query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tables []string
	for rows.Next() {
		var table string
		if err := rows.Scan(&table); err != nil {
			return nil, err
		}
		tables = append(tables, table)
	}

	return tables, nil
}

type ColumnInfo struct {
	Name     string
	Type     string
	Nullable string
}

func getColumns(db *sql.DB, tableName string) ([]ColumnInfo, error) {
	rows, err := db.Query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = $1", tableName)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var columns []ColumnInfo
	for rows.Next() {
		var column ColumnInfo
		if err := rows.Scan(&column.Name, &column.Type, &column.Nullable); err != nil {
			return nil, err
		}
		columns = append(columns, column)
	}

	return columns, nil
}
