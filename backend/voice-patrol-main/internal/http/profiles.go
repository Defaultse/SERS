package http

import (
	"crypto/sha1"
	"encoding/json"
	"fmt"
	"github.com/go-chi/render"
	"net/http"
	"time"
	"voice-patrol-main/internal/models"
)

const (
	salt       = "jojozxCCMnb98736Jxz"
	signingKey = "qrkjk#4#%35FSFJlja#4353KSFjH"
	tokenTTL   = 12 * time.Hour
	authHeader = "Authorization"
)

func (s *Server) getAllUsers(w http.ResponseWriter, r *http.Request) {
	users, err := s.store.Profile().All(r.Context())
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "DB err: %v", err)
		return
	}

	render.JSON(w, r, users)
}

func (s *Server) createProfile(w http.ResponseWriter, r *http.Request) {
	profile := new(models.Profile)
	if err := json.NewDecoder(r.Body).Decode(profile); err != nil {
		w.WriteHeader(http.StatusUnprocessableEntity)
		fmt.Fprintf(w, "Unknown err: %v", err)
		return
	}
	profile.PasswordHash = generateHash(profile.PasswordHash)
	if err := s.store.Profile().Create(r.Context(), profile); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "DB err: %v", err)
		return
	}
}

func generateHash(password string) string {
	hash := sha1.New()
	hash.Write([]byte(password))

	return fmt.Sprintf("%x", hash.Sum([]byte(salt)))
}
