package service

import (
	"backend/internal/models"
	"backend/internal/repository"
)

type RequestService struct {
	requestRepo *repository.RequestRepository
}

func NewRequestService(repo *repository.RequestRepository) *RequestService {
	return &RequestService{repo}
}

func (s *RequestService) AddRequest(request *models.Request) (int, error) {

	err := s.requestRepo.AddRequest(request)
	if err != nil {
		return -1, err
	}

	return request.RequestID, nil
}
