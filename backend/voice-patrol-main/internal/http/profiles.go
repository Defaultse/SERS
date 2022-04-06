package http

import (
	"crypto/sha1"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"
	"voice-patrol-main/internal/models"

	"github.com/dgrijalva/jwt-go"
	"github.com/go-chi/render"
)

const (
	salt = "jojozxCCMnb98736Jxz"
	signingKey = "qrkjk#4#%35FSFJlja#4353KSFjH"
	tokenTTL = 12 * time.Hour
	authHeader = "Authorization"
)

type UserClaims struct {
	UserID int `json:"user_id"`
	jwt.StandardClaims
}

func (s *Server) login(w http.ResponseWriter, r *http.Request) {
	credentials := new(models.Profile)
	if err := json.NewDecoder(r.Body).Decode(credentials); err != nil {
		fmt.Fprintf(w, "Unknown err: %v", err)
		return
	}

	profile, err := s.store.Profile().GetProfile(r.Context(), credentials.Email, generateHash(credentials.PasswordHash))
	if err != nil {
		fmt.Fprintf(w, "Unknown err: %v", err)
		return
	}

	token, err := generateToken(profile)
	fmt.Fprintf(w, "Token: %s", token)
}

func VerifyToken(w http.ResponseWriter, r *http.Request) int {
	reqToken := r.Header.Get(authHeader)
	splitToken := strings.Split(reqToken, "Bearer ")
	reqToken = splitToken[1]

	token, err := jwt.ParseWithClaims(reqToken, &UserClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(signingKey), nil
	})

	var userId int
	if claims, ok := token.Claims.(*UserClaims); ok && token.Valid {
		userId = claims.UserID
		fmt.Printf("Token verifyed ID: %v, Expires: %v", claims.UserID, claims.StandardClaims.ExpiresAt)
	} else {
		fmt.Fprintf(w, "Unknown err: %v", err)
	}
	return userId
}

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

func generateToken(profile *models.Profile) (string, error){
	var err error
	atClaims := jwt.MapClaims{}
	atClaims["authorized"] = true
	atClaims["profile_email"] = profile.Email
	atClaims["exp"] = time.Now().Add(tokenTTL).Unix()
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	token, err := at.SignedString([]byte(signingKey))
	if err != nil {
		return "", err
	}
	return token, nil
}

func generateHash(password string) string {
	hash := sha1.New()
	hash.Write([]byte(password))

	return fmt.Sprintf("%x", hash.Sum([]byte(salt)))
}
