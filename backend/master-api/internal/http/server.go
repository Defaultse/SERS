package http

import (
	"bytes"
	"context"
	"io"
	"log"
	"master-api/internal/store"
	"net/http"
	"time"

	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"

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
	r.Get("/test", func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		resp, err := http.Get("https://diploma.blob.core.windows.net/qwe/testcall.wav")
		if err != nil {
			log.Fatal(err)
		}
		defer resp.Body.Close()
		w.Header().Set("Connection", "Keep-Alive")
		w.Header().Set("Content-Type", "audio/mpeg")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("X-Content-Type-Options", "nosniff")

		body, err := io.ReadAll(resp.Body)
		log.Printf("Finished from /test: %v", time.Since(start))
		http.ServeContent(w, r, "audio", time.Now(), bytes.NewReader(body))
	})

	r.Get("/profiles", s.getAllUsers)
	r.Post("/profiles/create", s.createProfile)
	r.Post("/profiles/login", s.login)
	r.Put("/profiles", func(w http.ResponseWriter, r *http.Request) {})
	r.Delete("/profiles/{id}", func(w http.ResponseWriter, r *http.Request) {})

	r.Get("/audiofiles", s.getAll)
	r.Get("/audiofiles/{id}/{jwt}", s.getAudioByID)
	r.Post("/audiofiles/upload", s.uploadAudioFile)
	r.Delete("/audiofiles/{id}", func(w http.ResponseWriter, r *http.Request) {})

	return r
}

func (s *Server) Run() error {
	srv := &http.Server{
		Addr:         s.Address,
		Handler:      cors.AllowAll().Handler(s.basicHandler()),
		ReadTimeout:  time.Minute * 1,
		WriteTimeout: time.Minute * 1,
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
