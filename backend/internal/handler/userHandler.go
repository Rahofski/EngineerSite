package handler

import "backend/internal/repository"

type UserHandler struct {
	Login *LoginHandler
	Add   *AddHandler
}

func NewUserHandler(userRepo *repository.UserRepository, secret string) *UserHandler {
	return &UserHandler{
		Login: NewLoginHandler(userRepo, secret),
		Add:   NewAddHandler(userRepo),
	}
}
