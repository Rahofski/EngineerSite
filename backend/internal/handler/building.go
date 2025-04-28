package handler

import (
	"backend/internal/repository"
	"backend/internal/service"
	"github.com/gin-gonic/gin"
	"net/http"
)

type BuildingHandler struct {
	service *service.BuildingService
}

func NewBuildingHandler(repo *repository.BuildingRepository) *BuildingHandler {
	return &BuildingHandler{service.NewBuildingService(repo)}
}

func (h *BuildingHandler) GetBuildings(c *gin.Context) {

	buildings, err := h.service.GetBuildings()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(buildings) == 0 {
		c.JSON(http.StatusNoContent, gin.H{"error": "no buildings found"})
		return
	}

	c.JSON(http.StatusOK, buildings)
}
