package handler

import (
	"backend/internal/models"
	"backend/internal/repository"
	"backend/internal/service"
	"github.com/gin-gonic/gin"
	"net/http"
)

type LoginHandler struct {
	service *service.LoginService
}

func NewLoginHandler(userRepo *repository.UserRepository, secret string) *LoginHandler {
	loginService := service.NewLoginService(userRepo, secret)
	return &LoginHandler{loginService}
}

func (h *LoginHandler) Login(c *gin.Context) {

	var loginReq models.LoginRequest
	if err := c.ShouldBindJSON(&loginReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if loginReq.Email == "" || loginReq.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "both email and password are required"})
		return
	}

	token, err := h.service.Login(&loginReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Header("token", token)
	c.JSON(http.StatusOK, nil)

}
