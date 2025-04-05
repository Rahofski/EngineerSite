package service

import (
	"backend/internal/models"
	"backend/internal/repository"
)

type RequestService struct {
	requestRepo *repository.RequestRepository
	Secret      string
}

func NewRequestService(repo *repository.RequestRepository, secret string) *RequestService {
	return &RequestService{repo, secret}
}

func (s *RequestService) AddRequest(request *models.Request) (int, error) {

	err := s.requestRepo.AddRequest(request)
	if err != nil {
		return -1, err
	}

	return request.RequestID, nil
}

func (s *RequestService) GetRequests(fieldID int) ([]models.Request, error) {

	requests, err := s.requestRepo.GetRequests(fieldID)
	if err != nil {
		return nil, err
	}

	return requests, nil
}
