package config

import (
	"fmt"

	"github.com/spf13/viper"

	"github.com/go-playground/validator/v10"
)

type Config struct {
	Server struct {
		Host string `mapstructure:"host" validate:"required"`
		Port string `mapstructure:"port" validate:"required"`
	} `mapstructure:"server"`

	Database struct {
		Host     string `mapstructure:"host" validate:"required"`
		Port     string `mapstructure:"port" validate:"required"`
		User     string `mapstructure:"user" validate:"required"`
		Password string `mapstructure:"password" validate:"required"`
		DBName   string `mapstructure:"dbname" validate:"required"`
		SSLMode  string `mapstructure:"sslmode" validate:"required"`
	} `mapstructure:"database"`

	Secret string `mapstructure:"secret" validate:"required"`
}

func LoadConfig(path string) (*Config, error) {

	viper.SetConfigFile(path)

	if err := viper.ReadInConfig(); err != nil {
		return nil, fmt.Errorf("unable to read config file: %w", err)
	}

	var cfg Config
	if err := viper.Unmarshal(&cfg); err != nil {
		return nil, fmt.Errorf("unable to marshall config: %w", err)
	}

	val := validator.New()
	if err := val.Struct(cfg); err != nil {
		return nil, fmt.Errorf("config validation failed: %w", err)
	}

	return &cfg, nil
}
