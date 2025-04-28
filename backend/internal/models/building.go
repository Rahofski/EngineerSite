package models

type Building struct {
	BuildingID   int    `json:"building_id"`
	BuildingName string `json:"building_name"`
	Address      string `json:"address"`
	BuildingType string `json:"building_type"`
}
