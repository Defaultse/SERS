package main

import (
	"context"
	"log"
	"master-api/internal/http"
	"master-api/internal/store/mongo"

	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
)

// const uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"

const uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false&connect=direct"

func main() {
	ctx := context.Background()

	store := mongo.NewDB()
	if err := store.Connect(ctx, uri); err != nil {
		panic(err)
	}
	defer store.Close(ctx)

	cred, _ := azblob.NewSharedKeyCredential("diploma", "MtBo1mmS8zJ41AaU97qjHTOEyBbBwWd7HTTQ1ZrOBcxymCFEKE0vCHq54s1cKNRiQmPLoQb3jqUYUpp8hlcxow==")
	azureClient, err := azblob.NewServiceClientWithSharedKey("https://diploma.blob.core.windows.net/", cred, nil)
	if err != nil {
		log.Println(err)
		return
	}

	srv := http.NewServer(
		ctx,
		http.WithAddress(":8000"),
		http.WithStore(store),
		http.WithAzureClient(&azureClient),
	)
	if err := srv.Run(); err != nil {
		panic(err)
	}

	srv.WaitForGracefulTermination()

}
