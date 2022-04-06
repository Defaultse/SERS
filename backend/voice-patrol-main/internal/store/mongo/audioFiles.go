package mongo

import (
	"context"
	"voice-patrol-main/internal/models"
	"voice-patrol-main/internal/store"

	"go.mongodb.org/mongo-driver/mongo"
)

func (db *DB) AudioFile() store.AudioFileRepository {
	if db.audioFiles == nil {
		db.audioFiles = NewAudioFileRepository(db.conn)
	}

	return db.audioFiles
}

type AudioFilesRepository struct {
	collection *mongo.Collection
}

func NewAudioFileRepository(conn *mongo.Database) store.AudioFileRepository {
	return &AudioFilesRepository{collection: conn.Collection("AudioFiles")}
}

func (a AudioFilesRepository) Create(ctx context.Context, audioFile *models.AudioFiles) error {
	//TODO implement me
	panic("implement me")
}

func (a AudioFilesRepository) All(ctx context.Context) ([]*models.AudioFiles, error) {
	//TODO implement me
	panic("implement me")
}

func (a AudioFilesRepository) GetUser(ctx context.Context, email string, password_hash string) (*models.Profile, error) {
	profile := new(models.Profile)
	// if err := a.conn.Get(profile, "SELECT * FROM users WHERE email=$1 AND password_hash=$2", email, password_hash); err != nil {
	// 	return nil, err
	// }
	return profile, nil
}

func (a AudioFilesRepository) ByID(ctx context.Context, id int) (*models.AudioFiles, error) {
	//TODO implement me
	panic("implement me")
}

func (a AudioFilesRepository) Update(ctx context.Context, audioFile *models.AudioFiles) error {
	//TODO implement me
	panic("implement me")
}

func (a AudioFilesRepository) Delete(ctx context.Context, id int) error {
	//TODO implement me
	panic("implement me")
}
