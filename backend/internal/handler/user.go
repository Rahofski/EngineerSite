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

	c.JSON(http.StatusOK, gin.H{"token": token})
}

func (h *UserHandler) AddUser(c *gin.Context) {

	tokenString, err := models.ExtractBearerToken(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	isAdmin, err := models.IsAdmin(tokenString, h.service.Secret)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	if !isAdmin {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "not an admin"})
		return
	}

	var addReq models.AddRequest
	if err := c.ShouldBindJSON(&addReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if addReq.Email == "" || addReq.Password == "" || addReq.Name == "" || addReq.FieldID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "all fields are required"})
		return
	}

	userID, err := h.service.AddUser(&addReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user_id": userID})
}

func (h *UserHandler) RemoveUser(c *gin.Context) {

	tokenString, err := models.ExtractBearerToken(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	isAdmin, err := models.IsAdmin(tokenString, h.service.Secret)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	if !isAdmin {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "not an admin"})
		return
	}

	var email string
	if err := c.ShouldBindJSON(&email); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no email provided"})
		return
	}

	if email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no email provided"})
		return
	}

	err = h.service.RemoveUser(email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "user successfully removed"})
}
