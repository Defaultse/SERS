package http

import (
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
	"voice-patrol-main/internal/store"
)

type ServerOption func(srv *Server)

func WithAddress(address string) ServerOption {
	return func(srv *Server) {
		srv.Address = address
	}
}

func WithStore(store store.Store) ServerOption {
	return func(srv *Server) {
		srv.store = store
	}
}

func WithAzureClient(azureClient *azblob.ServiceClient) ServerOption {
	return func(srv *Server) {
		srv.azureClient = azureClient
	}
}
