package models

type User struct {
	UserID       int    `json:"user_id"`
	Username     string `json:"username"`
	PasswordHash string `json:"password_hash"`
	Email        string `json:"email"`
	Role         string `json:"role"`
}

type UserLogInResponce struct {
	UserID   int    `json:"user_id"`
	Username string `json:"username"`
	Role     string `json:"role"`
}
