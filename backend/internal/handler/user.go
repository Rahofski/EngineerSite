package handler

import (
	"backend/internal/models"
	"backend/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	Service *service.AuthService
}

func NewAuthHandler(service *service.AuthService) *AuthHandler {

	return &AuthHandler{
		Service: service,
	}
}

func (h *AuthHandler) LogIn(c *gin.Context) {

	// validate request data

	var request models.LoginRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// start auth_service

	responce, err := h.Service.Login(request.Username, request.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// return responce

	c.JSON(http.StatusOK, responce)
}
