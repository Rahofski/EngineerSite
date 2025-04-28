package service

import (
	"backend/internal/models"
	"backend/internal/repository"
)

type BuildingService struct {
	buildingRepo *repository.BuildingRepository
}

func NewBuildingService(buildingRepo *repository.BuildingRepository) *BuildingService {
	return &BuildingService{buildingRepo}
}

func (s *BuildingService) GetBuildings() ([]models.Building, error) {
	return s.buildingRepo.GetBuildings()
}
