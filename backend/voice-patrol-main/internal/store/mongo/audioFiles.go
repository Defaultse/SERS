package mongo

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson/primitive"
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
	result, err := a.collection.InsertOne(ctx, audioFile)
	if err != nil {
		return fmt.Errorf("failed to create profile due to: %v", err)
	}
	oid, ok := result.InsertedID.(primitive.ObjectID)
	if ok {
		oid.Hex()
	}
	return err
}

func (a AudioFilesRepository) All(ctx context.Context) ([]*models.AudioFiles, error) {
	//TODO implement me
	panic("implement me")
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
