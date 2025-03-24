package models

type User struct {
	UserID       int    `json:"user_id"`
	FieldID      int    `json:"field_id"`
	PasswordHash string `json:"password_hash"`
	Email        string `json:"email"`
	Name         string `json:"name"`
}
