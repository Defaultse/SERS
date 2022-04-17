package http

import (
	"fmt"
	"net/http"
	"os"
	"time"
	"voice-patrol-main/internal/models"
)

func (s *Server) uploadAudioFile(w http.ResponseWriter, r *http.Request) {
	// r.ParseMultipartForm(0<<30)
	file, handler, err := r.FormFile("audio")

	if err != nil {
		fmt.Println("Error Retrieving the File")
		w.Write([]byte(err.Error()))
		fmt.Println(err)
		return
	}
	defer file.Close()

	//Upload to azure
	err = s.uploadAudioFileToAzure(file, handler)
	if err != nil {
		return
	}

	audioFile := models.AudioFiles{
		ProfileId:     1,
		UploadDate:    time.Now(),
		AudioFilePath: handler.Filename,
	}
	//Creating in Mongo
	if err := s.store.AudioFile().Create(r.Context(), &audioFile); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "DB err: %v", err)
		return
	}

	fmt.Fprintf(w, "To blob")
	fmt.Fprintf(w, "Uploaded File: %+v\n", handler.Filename)
	//fmt.Printf("File Size: %+v\n", handler.Size)
	//fmt.Printf("MIME Header: %+v\n", handler.Header)
	//
	//tempFile, err := ioutil.TempFile("C:/Users/User/Desktop/diploma/voice-patrol/backend/voice-patrol-main/internal/http/tmp", fmt.Sprint("*-", handler.Filename))
	//if err != nil {
	//	fmt.Println(err)
	//}
	//defer tempFile.Close()
	//
	//fileBytes, err := ioutil.ReadAll(file)
	//if err != nil {
	//	fmt.Println(err)
	//}
	//tempFile.Write(fileBytes)
	//fmt.Fprintf(w, "Successfully Uploaded File\n")
}

func (s *Server) getAudioByID(w http.ResponseWriter, r *http.Request) {
	// idStr := chi.URLParam(r, "id")
	// id, err := strconv.Atoi(idStr)
	// if err != nil {
	// 	fmt.Fprintf(w, "Unknown err: %v", err)
	// 	return
	// }
	// fmt.Println(id)

	w.Header().Set("Connection", "Keep-Alive")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.Header().Set("Transfer-Encoding", "chunked")
	w.Header().Set("Content-Type", "audio/mpeg")
	file, _ := os.ReadFile("C:/Users/User/Desktop/diploma/voice-patrol/backend/voice-patrol-main/internal/http/tmp/2118756701-Eternal_Raijin_La_Espada.mp3")
	n, err := w.Write(file)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
	fmt.Println(n, "bytes written")
}
