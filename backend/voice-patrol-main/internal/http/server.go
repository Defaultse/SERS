package http

import (
	"context"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
	"log"
	"net/http"
	"time"
	"voice-patrol-main/internal/store"

	"github.com/go-chi/chi"
	"github.com/rs/cors"
)

const sampleRate = 44100
const seconds = 2

type Server struct {
	ctx         context.Context
	idleConnsCh chan struct{}

	store       store.Store
	azureClient *azblob.ServiceClient

	Address string
}

func NewServer(ctx context.Context, opts ...ServerOption) *Server {
	srv := &Server{
		ctx:         ctx,
		idleConnsCh: make(chan struct{}),
	}

	for _, opt := range opts {
		opt(srv)
	}

	return srv
}

func (s *Server) basicHandler() chi.Router {
	r := chi.NewRouter()
	r.Get("/profiles", s.getAllUsers)
	r.Post("/profiles/create", s.createProfile)
	r.Post("/profiles/login", s.login)
	r.Put("/profiles", func(w http.ResponseWriter, r *http.Request) {})
	r.Delete("/profiles/{id}", func(w http.ResponseWriter, r *http.Request) {})

	r.Get("/audiofiles", func(w http.ResponseWriter, r *http.Request) {})
	r.Get("/audiofiles/2", s.getAudioByID)
	r.Post("/audiofiles/upload", s.uploadAudioFile)
	r.Delete("/audiofiles/{id}", func(w http.ResponseWriter, r *http.Request) {})

	return r
}

func (s *Server) Run() error {
	srv := &http.Server{
		Addr:         s.Address,
		Handler:      cors.AllowAll().Handler(s.basicHandler()),
		ReadTimeout:  time.Second * 5,
		WriteTimeout: time.Second * 30,
	}

	go s.ListenCtxForGT(srv)

	log.Println("[HTTP] Server running on ", s.Address)

	return srv.ListenAndServe()
}

func (s *Server) ListenCtxForGT(srv *http.Server) {
	<-s.ctx.Done()

	if err := srv.Shutdown(context.Background()); err != nil {
		log.Printf("[HTTP] Got err while shutting down: %v", err)
	}

	log.Println("[HTTP] Processed all idle connections")
	close(s.idleConnsCh)

}

func (s *Server) WaitForGracefulTermination() {
	<-s.idleConnsCh
}
