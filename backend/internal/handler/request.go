package handler

import (
	"backend/internal/models"
	"backend/internal/repository"
	"backend/internal/service"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

type RequestHandler struct {
	service *service.RequestService
}

func NewRequestHandler(repo *repository.RequestRepository, secret string) *RequestHandler {
	return &RequestHandler{service: service.NewRequestService(repo, secret)}
}

func (h *RequestHandler) AddRequest(c *gin.Context) {

	var request models.Request
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id, err := h.service.AddRequest(&request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"id": id})
}

func (h *RequestHandler) GetRequests(c *gin.Context) {

	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
		return
	}

	tokenParts := strings.Split(authHeader, " ")
	if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Authorization header format"})
		return
	}

	tokenString := tokenParts[1]
	token, err := models.ParseToken(tokenString, h.service.Secret)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token: " + err.Error()})
		return
	}

	requests, err := h.service.GetRequests(token.FieldID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"requests": requests})
}
