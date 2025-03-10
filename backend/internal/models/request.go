package models

type Request struct {
	RequestID  int    `json:"request_id"`
	BuildingID int    `json:"building_id"`
	FieldID    int    `json:"field_id"`
	UserID     int    `json:"user_id"`
	TextInfo   string `json:"additional_text"`
	Status     string `json:"status"`
}
