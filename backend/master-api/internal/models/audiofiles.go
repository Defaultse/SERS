package models

import (
	"time"
)

type AudioFiles struct {
	ProfileId     string       `json:"ProfileId" bson:"ProfileId,omitempty"`
	AudioDate     time.Time `json:"AudioDate" bson:"AudioDate"`
	UploadDate    time.Time `json:"UploadDate" bson:"UploadDate"`
	AudioFilePath string    `json:"AudioFile" bson:"AudioFilePath"`
	AudioSegments []AudioSection
}

type AudioSection struct {
	SegmentOrder    int    `json:"SegmentOrder" bson:"SegmentOrder"`
	SegmentFilePath string `json:"SegmentFilePath" bson:"SegmentFilePath"`
	SegmentEmotion  string `json:"SegmentEmotion" bson:"SegmentEmotion"`
}

// m, _ := time.ParseDuration("1m30s")
// fmt.Printf("Take off in t-%.0f seconds.", m.Seconds())
