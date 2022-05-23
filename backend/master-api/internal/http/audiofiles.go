package http

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi"
	"io/ioutil"
	"master-api/internal/models"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/go-chi/render"
)

func (s *Server) getAll(w http.ResponseWriter, r *http.Request) {
	tokenData := VerifyToken(w, r)
	audioFiles, err := s.store.AudioFile().All(r.Context(), tokenData)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "DB err: %v", err)
		return
	}

	render.JSON(w, r, audioFiles)
	// fmt.Fprintf(w, "%v", profileId)
}

func (s *Server) getByID(w http.ResponseWriter, r *http.Request) {
	//tokenData := VerifyToken(w, r)
	idStr := chi.URLParam(r, "id")
	audioFiles, err := s.store.AudioFile().ByID(r.Context(), idStr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "DB err: %v", err)
		return
	}
	render.JSON(w, r, audioFiles)
}

func (s *Server) uploadAudioFile(w http.ResponseWriter, r *http.Request) {
	// r.ParseMultipartForm(0<<30)
	tokenData := VerifyToken(w, r)
	if tokenData == nil {
		fmt.Fprintf(w, "Login please")
		return
	}
	file, handler, err := r.FormFile("audio")
	if err != nil {
		fmt.Println("Error Retrieving the File")
		w.Write([]byte(err.Error()))
		fmt.Println(err)
		return
	}
	defer file.Close()

	//Upload to azure
	//err = s.uploadAudioFileToAzure(file, handler, tokenData.Username)
	//if err != nil {
	//	return
	//}
	//fmt.Fprintf(w, "To blob")
	//fmt.Fprintf(w, "Uploaded File: %+v\n", handler.Filename)

	//fmt.Printf("File Size: %+v\n", handler.Size)
	//fmt.Printf("MIME Header: %+v\n", handler.Header)
	tempFile, err := ioutil.TempFile("C:/Users/User/Desktop/diploma/diploma/backend/file-storage/qwe/", fmt.Sprint("*_", handler.Filename))
	if err != nil {
		fmt.Println(err)
	}
	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		fmt.Println(err)
	}
	tempFile.Write(fileBytes)
	//generatedPath := tempFile.Name()
	defer tempFile.Close()

	//Creating in Mongo
	audioFile := models.AudioFiles{
		ProfileId:     tokenData.ID,
		UploadDate:    time.Now(),
		AudioFilePath: tempFile.Name(),
		AudioSegments: []models.AudioSection{},
	}

	createdObjectID, err := s.store.AudioFile().Create(r.Context(), &audioFile)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "DB err: %v", err)
		return
	}
	fmt.Fprintf(w, "Successfully Uploaded File\n")

	//Sending signal to audio segmentation model
	postBody := map[string]string{
		"filePath":        tempFile.Name(),
		"createdObjectID": createdObjectID,
	}
	jsonValue, _ := json.Marshal(postBody)
	go http.Post("http://127.0.0.1:5000/api/segmentAudio", "application/json", bytes.NewBuffer(jsonValue))
}

func (s *Server) getAudioByID(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	jwtStr := chi.URLParam(r, "jwt")
	//tokenData := VerifyToken(w, r)

	audioFilePath, err := s.store.AudioFile().AudioFilePathByID(r.Context(), idStr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "DB err: %v", err)
		return
	}
	fmt.Println("Got params:", idStr, jwtStr)

	w.Header().Set("Connection", "Keep-Alive")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.Header().Set("Content-Type", "audio/mpeg")

	file, err := os.ReadFile(audioFilePath)
	if err != nil {
		fmt.Println(err)
	}

	http.ServeContent(w, r, "audio", time.Now(), bytes.NewReader(file))

	//from azure
	//var buf []byte
	//buf, err := json.Marshal(getAudioFile)
	//if err != nil {
	//	log.Fatal(err)
	//}
	//_, err = w.Write(buf)
	//if err != nil {
	//	log.Fatal(err)
	//}
	w.Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
}

func (s *Server) getAudioSegmentByID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Connection", "Keep-Alive")
	idStr := chi.URLParam(r, "id")
	orderId := chi.URLParam(r, "orderId")
	orderId1, _ := strconv.Atoi(orderId)
	jwtStr := chi.URLParam(r, "jwt")
	fmt.Println("Got params:", idStr, jwtStr, orderId)
	// id, err := strconv.Atoi(idStr)
	// if err != nil {
	// 	fmt.Fprintf(w, "Unknown err: %v", err)
	// 	return
	// }
	// fmt.Println(id)
	//tokenData := VerifyToken(w, r)

	//getAudioFile := s.getAudioFromBlob("qwe", "testcall.wav")
	audioSegmentFilePath, err := s.store.AudioFile().AudioSegmentPathByID(r.Context(), idStr, orderId1)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "DB err: %v", err)
		return
	}
	fmt.Println("Got params:", idStr, jwtStr)
	w.Header().Set("Connection", "Keep-Alive")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	//w.Header().Set("Transfer-Encoding", "chunked")
	w.Header().Set("Content-Type", "audio/mpeg")

	//audioFile, err := s.store.Profile().GetProfile(r.Context(), idStr)
	//if err != nil {
	//	fmt.Fprintf(w, "Unknown err: %v", err)
	//	return
	//}

	file, err := os.ReadFile(audioSegmentFilePath)
	//n, err := w.Write(file)
	if err != nil {
		fmt.Println(err)
	}
	//fmt.Println(n, "bytes written")

	http.ServeContent(w, r, "audio", time.Now(), bytes.NewReader(file))
	//http.ServeContent(w, r, "audio", time.Now(), bytes.NewReader([]byte(getAudioFile)))
	//w.Header().Set("Connection", "Keep-Alive")

	//from azure
	//var buf []byte
	//buf, err := json.Marshal(getAudioFile)
	//if err != nil {
	//	log.Fatal(err)
	//}
	//_, err = w.Write(buf)
	//if err != nil {
	//	log.Fatal(err)
	//}
	w.Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
	//w.Write(getAudioFile.Bytes())
}
