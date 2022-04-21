package mongo

import (
	"context"
	"fmt"
	"master-api/internal/store"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DB struct {
	conn       *mongo.Database
	collection *mongo.Collection
	profiles   store.ProfileRepository
	audioFiles store.AudioFileRepository
}

func NewDB() store.Store {
	return &DB{}
}

func (db *DB) Connect(ctx context.Context, uri string) error {
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		return err
	}

	if err = client.Ping(ctx, nil); err != nil {
		return fmt.Errorf("failed to ping to mongo, err: %v", err)
	}

	db.conn = client.Database("voice-patrol")
	return nil
}

func (db *DB) Close(ctx context.Context) error {
	return db.conn.Drop(ctx)
}
