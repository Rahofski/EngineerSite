package models

import (
	"fmt"
)

type Request struct {
	RequestID  int `json:"request_id"`
	BuildingID int `json:"building_id"`
	FieldID    int `json:"field_id"`
	//UserID     int       `json:"user_id"` // лишнее поле, его не учитываем
	Time     string `json:"time"`
	Status   string `json:"status"`
	Photos   string `json:"photos"`
	TextInfo string `json:"additional_text"`
}

func CheckStatus(status string) error {

	vals := []string{"in progress", "not taken", "done"}
	for _, v := range vals {
		if status == v {
			return nil
		}
	}

	return fmt.Errorf("invalid status")
}
