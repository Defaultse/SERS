package http

import (
	"bytes"
	"fmt"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
	"log"
	"mime/multipart"
	"time"
)

func (s *Server) createAzureProfileContainer(profileUsername string) error {
	container := s.azureClient.NewContainerClient(profileUsername)
	containerOpts := azblob.PublicAccessTypeContainer
	_, err := container.Create(s.ctx, &azblob.CreateContainerOptions{Access: &containerOpts})
	return err
}

func (s *Server) uploadAudioFileToAzure(file multipart.File, handler *multipart.FileHeader, profile string) error {
	container := s.azureClient.NewContainerClient(profile)

	blockBlob := container.NewBlockBlobClient(handler.Filename)
	_, err := blockBlob.Upload(s.ctx, file, nil)
	if err != nil {
		fmt.Println(err)
	}
	return err
}

func (s *Server) getAudioFromBlob(profile string, audioFile string) string {
	start := time.Now()
	log.Printf("Started downloading from blob storage: %v", audioFile)

	container := s.azureClient.NewContainerClient(profile)
	get, err := container.NewBlockBlobClient(audioFile).Download(s.ctx, nil)
	if err != nil {
		log.Fatal(err)
	}

	downloadedData := &bytes.Buffer{}
	reader := get.Body(&azblob.RetryReaderOptions{})
	_, err = downloadedData.ReadFrom(reader)
	if err != nil {
		log.Fatal(err)
	}
	err = reader.Close()
	if err != nil {
		log.Fatal(err)
	}

	elapsed := time.Since(start)
	log.Printf("Completed downloading from blob storage: %v", elapsed)

	return downloadedData.String()
}
