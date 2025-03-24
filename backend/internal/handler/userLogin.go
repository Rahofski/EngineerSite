package handler

import (
	"backend/internal/models"
	"backend/internal/service"
	"github.com/gin-gonic/gin"
	"net/http"
)

type LoginHandler struct {
	service *service.LoginService
}

func NewLoginHandler(service *service.LoginService) *LoginHandler {
	return &LoginHandler{service}
}

func (h *LoginHandler) Login(c *gin.Context) {

	var loginReq models.LoginRequest
	if err := c.ShouldBindJSON(loginReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	if loginReq.Email == "" || loginReq.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "both email and password are required"})
	}

	token, err := h.service.Login(&loginReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}
