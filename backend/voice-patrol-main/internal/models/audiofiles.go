package models

import (
	"time"
)

type AudioFiles struct {
	ProfileId     int       `json:"ProfileId"`
	AudioDate     time.Time `json:"AudioDate"`
	UploadDate    time.Time `json:"UploadDate"`
	AudioFile     string    `json:"AudioFile"`
	AudioDuration time.Duration
	AudioSegments []AudioSection
}

type AudioSection struct {
	SegmentIndex int           `json:"SegmentOrder"`
	SegmentFile  string        `json:"SegmentFile"`
	Cut          time.Duration `json:"Cut"`
}

// m, _ := time.ParseDuration("1m30s")
// fmt.Printf("Take off in t-%.0f seconds.", m.Seconds())
