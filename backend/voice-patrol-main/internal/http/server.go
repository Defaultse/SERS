package http

import (
	"context"
	"log"
	"net/http"
	"time"
	"voice-patrol-main/internal/store"

	"github.com/go-chi/chi"
)

type Server struct {
	ctx         context.Context
	idleConnsCh chan struct{}

	store store.Store

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
	r.Post("/profile/create", s.createProfile)

	return r
}

func (s *Server) Run() error {
	srv := &http.Server{
		Addr:         s.Address,
		Handler:      s.basicHandler(),
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
