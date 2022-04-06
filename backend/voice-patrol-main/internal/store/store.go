package store

import (
	"context"
	"voice-patrol-main/internal/models"
)

type Store interface {
	Connect(ctx context.Context, url string) error
	Close(ctx context.Context) error

	Profile() ProfileRepository
	AudioFile() AudioFileRepository
}

type ProfileRepository interface {
	Create(ctx context.Context, profile *models.Profile) error
	All(ctx context.Context) ([]*models.Profile, error)
	GetProfile(ctx context.Context, email string, password_hash string) (*models.Profile, error)
	ByUsername(ctx context.Context, username string) (*models.Profile, error)
	Update(ctx context.Context, profile *models.Profile) error
	Delete(ctx context.Context, id int) error
}

type AudioFileRepository interface {
	Create(ctx context.Context, audioFile *models.AudioFiles) error
	All(ctx context.Context) ([]*models.AudioFiles, error)
	ByID(ctx context.Context, id int) (*models.AudioFiles, error)
	Update(ctx context.Context, audioFile *models.AudioFiles) error
	Delete(ctx context.Context, id int) error
}
