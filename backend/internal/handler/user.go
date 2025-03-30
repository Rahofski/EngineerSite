package handler

import (
	"backend/internal/models"
	"backend/internal/repository"
	"backend/internal/service"
	"github.com/gin-gonic/gin"
	"net/http"
)

type UserHandler struct {
	service *service.UserService
}

func NewUserHandler(userRepo *repository.UserRepository, secret string) *UserHandler {
	return &UserHandler{service.NewLoginService(userRepo, secret)}
}

func (h *UserHandler) Login(c *gin.Context) {

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
