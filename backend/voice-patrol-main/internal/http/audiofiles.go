package http

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
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
    fmt.Printf("Uploaded File: %+v\n", handler.Filename)
    fmt.Printf("File Size: %+v\n", handler.Size)
    fmt.Printf("MIME Header: %+v\n", handler.Header)

    tempFile, err := ioutil.TempFile("C:/Users/User/Desktop/diploma/voice-patrol/backend/voice-patrol-main/internal/http/tmp", fmt.Sprint("*-",handler.Filename))
    if err != nil {
        fmt.Println(err)
    }
    defer tempFile.Close()

    fileBytes, err := ioutil.ReadAll(file)
    if err != nil {
        fmt.Println(err)
    }
    tempFile.Write(fileBytes)
    fmt.Fprintf(w, "Successfully Uploaded File\n")
}

func (s *Server) getAudioByID(w http.ResponseWriter, r *http.Request) {
    // idStr := chi.URLParam(r, "id")
	// id, err := strconv.Atoi(idStr)
	// if err != nil {
	// 	fmt.Fprintf(w, "Unknown err: %v", err)
	// 	return
	// }
    // fmt.Println(id)

    file, _ := os.ReadFile("C:/Users/User/Desktop/diploma/voice-patrol/backend/voice-patrol-main/internal/http/tmp/2118756701-Eternal_Raijin_La_Espada.mp3")
    n, err := w.Write(file)
    if err != nil {
        fmt.Println(err)
    }
    fmt.Println(n, "bytes written")
}