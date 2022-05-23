package mongo

import (
	"context"
	"fmt"
	"log"
	"master-api/internal/models"
	"master-api/internal/store"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

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

func (a AudioFilesRepository) Create(ctx context.Context, audioFile *models.AudioFiles) (string, error) {
	result, err := a.collection.InsertOne(ctx, audioFile)
	if err != nil {
		return "", fmt.Errorf("failed to create profile due to: %v", err)
	}
	oid, ok := result.InsertedID.(primitive.ObjectID)
	if ok {
		oid.Hex()
	}
	return oid.Hex(), nil
}

func (a AudioFilesRepository) All(ctx context.Context, tokenData *models.Profile) ([]*models.AudioFiles, error) {
	audioFiles := make([]*models.AudioFiles, 0)
	cursor, err := a.collection.Find(
		context.TODO(),
		bson.D{{"ProfileId", tokenData.ID}},
		//bson.D{},
	)
	fmt.Println(cursor)

	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(tokenData.ID, cursor.All(context.TODO(), &audioFiles))
	for cursor.Next(context.TODO()) {
		//Create a value into which the single document can be decoded
		var elem *models.AudioFiles
		err := cursor.Decode(&elem)
		if err != nil {
			log.Fatal(err)
		}

		audioFiles = append(audioFiles, elem)

	}
	fmt.Println(audioFiles)

	if err := cursor.Err(); err != nil {
		log.Fatal(err)
	}

	//Close the cursor once finished
	cursor.Close(context.TODO())

	//if err = cursor.All(context.TODO(), &audioFiles); err != nil {
	//	panic(err)
	//}
	return audioFiles, err
}

func (a AudioFilesRepository) AudioFilePathByID(ctx context.Context, audioId string) (string, error) {
	var audioFile models.AudioFiles
	objID, _ := primitive.ObjectIDFromHex(audioId)
	//fmt.Println(objID)
	err := a.collection.FindOne(
		context.TODO(),
		bson.M{"_id": bson.M{"$eq": objID}},
	).Decode(&audioFile)
	if err != nil {
		log.Fatal(err)
	}
	return audioFile.AudioFilePath, nil
}

func (a AudioFilesRepository) AudioSegmentPathByID(ctx context.Context, audioId string, orderId int) (string, error) {
	var audioFile models.AudioFiles
	objID, _ := primitive.ObjectIDFromHex(audioId)
	//fmt.Println(objID)
	err := a.collection.FindOne(
		context.TODO(),
		bson.M{"_id": bson.M{"$eq": objID}},
	).Decode(&audioFile)
	if err != nil {
		log.Fatal(err)
	}
	return audioFile.AudioSegments[orderId].SegmentFilePath, nil
}

func (a AudioFilesRepository) ByID(ctx context.Context, id string) (*models.AudioFiles, error) {
	var audioFile models.AudioFiles
	objID, _ := primitive.ObjectIDFromHex(id)
	//fmt.Println(objID)
	err := a.collection.FindOne(
		context.TODO(),
		bson.M{"_id": bson.M{"$eq": objID}},
	).Decode(&audioFile)
	if err != nil {
		log.Fatal(err)
	}
	return &audioFile, nil
}

func (a AudioFilesRepository) Update(ctx context.Context, audioFile *models.AudioFiles) error {
	//TODO implement me
	panic("implement me")
}

func (a AudioFilesRepository) Delete(ctx context.Context, id int) error {
	//TODO implement me
	panic("implement me")
}
