package mongo

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"log"
	"voice-patrol-main/internal/models"
	"voice-patrol-main/internal/store"

	"go.mongodb.org/mongo-driver/mongo"
)

func (db *DB) Profile() store.ProfileRepository {
	if db.profiles == nil {
		db.profiles = NewProfilesRepository(db.conn)
	}

	return db.profiles
}

type ProfilesRepository struct {
	collection *mongo.Collection
}

func NewProfilesRepository(conn *mongo.Database) store.ProfileRepository {
	return &ProfilesRepository{collection: conn.Collection("Profiles")}
}

func (p ProfilesRepository) All(ctx context.Context) ([]*models.Profile, error) {
	profiles := make([]*models.Profile, 0)
	cursor, err := p.collection.Find(ctx, bson.M{})
	if err != nil {
		log.Fatal(err)
	}
	if err = cursor.All(ctx, &profiles); err != nil {
		log.Fatal(err)
	}
	return profiles, err
}

func (p ProfilesRepository) Create(ctx context.Context, profile *models.Profile) error {
	result, err := p.collection.InsertOne(ctx, profile)
	if err != nil {
		return fmt.Errorf("failed to create profile due to: %v", err)
	}
	oid, ok := result.InsertedID.(primitive.ObjectID)
	if ok {
		oid.Hex()
	}
	return err
}

func (p ProfilesRepository) ByUsername(ctx context.Context, username string) (*models.Profile, error) {

	panic("implement me")
}

func (p ProfilesRepository) Update(ctx context.Context, profile *models.Profile) error {

	panic("implement me")
}

func (p ProfilesRepository) Delete(ctx context.Context, id int) error {

	panic("implement me")
}
