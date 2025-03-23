package handler

import (
	"backend/internal/models"
	"backend/internal/service"
	"github.com/gin-gonic/gin"
	"net/http"
)

type AddHandler struct {
	Service *service.AddService
}

func NewAddHandler(service *service.AddService) *AddHandler {
	return &AddHandler{
		Service: service,
	}
}

func (h *AddHandler) Add(c *gin.Context) {

	var request models.AddRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := h.Service.AddUser(&request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}

	c.JSON(http.StatusOK, response)
}
