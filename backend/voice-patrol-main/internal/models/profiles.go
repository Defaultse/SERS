package models

type Profile struct {
	//ID           string `json:"id" bson:"_id,omitempty"`
	Username     string `json:"username" bson:"username,omitempty"`
	PasswordHash string `json:"password,omitempty"`
	Email        string `json:"email" bson:"email"`
}
