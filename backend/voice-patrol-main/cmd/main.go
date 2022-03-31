package main

import (
	"context"
	"voice-patrol-main/internal/http"
	"voice-patrol-main/internal/store/mongo"
)

const uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"

func main() {
	ctx := context.Background()

	store := mongo.NewDB()
	if err := store.Connect(ctx, uri); err != nil {
		panic(err)
	}
	defer store.Close(ctx)

	srv := http.NewServer(
		ctx,
		http.WithAddress(":8000"),
		http.WithStore(store),
	)
	if err := srv.Run(); err != nil {
		panic(err)
	}

	srv.WaitForGracefulTermination()

}
