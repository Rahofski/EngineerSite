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

func NewRequestHandler(repo *repository.RequestRepository) *RequestHandler {
	return &RequestHandler{service: service.NewRequestService(repo)}
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
