package http

import (
	"fmt"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
	"mime/multipart"
)

func (s *Server) createAzureProfileContainer(profileUsername string) error {
	container := s.azureClient.NewContainerClient(profileUsername)
	containerOpts := azblob.PublicAccessTypeContainer
	_, err := container.Create(s.ctx, &azblob.CreateContainerOptions{Access: &containerOpts})
	return err
}

func (s *Server) uploadAudioFileToAzure(file multipart.File, handler *multipart.FileHeader) error {
	container := s.azureClient.NewContainerClient("profile4")

	blockBlob := container.NewBlockBlobClient(handler.Filename)
	_, err := blockBlob.Upload(s.ctx, file, nil)
	if err != nil {
		fmt.Println(err)
	}
	return err
}
