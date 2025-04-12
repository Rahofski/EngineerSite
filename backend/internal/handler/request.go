package handler

import (
	"backend/internal/models"
	"backend/internal/repository"
	"backend/internal/service"
	"github.com/gin-gonic/gin"
	"net/http"
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

	tokenString, err := models.ExtractBearerToken(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
	}

	token, err := models.UnmarshalToken(tokenString, h.service.Secret)
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

func (h *RequestHandler) UpdateStatus(c *gin.Context) {

	tokenString, err := models.ExtractBearerToken(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	token, err := models.ParseToken(tokenString, h.service.Secret)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	_, err = models.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	var statusReq models.StatusRequest
	if err := c.ShouldBindJSON(&statusReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if statusReq.RequestID == 0 || statusReq.Status == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Both ID and Status are required"})
		return
	}

	err = h.service.UpdateStatus(statusReq.RequestID, statusReq.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status changed": statusReq.Status})
}
