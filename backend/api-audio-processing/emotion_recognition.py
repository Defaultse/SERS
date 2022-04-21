import schedule
import time
import librosa
import soundfile
import os, glob, pickle
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score

emotions = {
    '01': 'neutral',
    '02': 'calm',
    '03': 'happy',
    '04': 'sad',
    '05': 'angry',
    '06': 'fearful',
    '07': 'disgust',
    '08': 'surprised'
}

observed_emotions = ['sad', 'angry', 'disgust']


def extract_feature(file_name, mfcc, chroma, mel):
    with soundfile.SoundFile(file_name) as sound_file:
        X = sound_file.read(dtype="float32").reshape(-1)
        sample_rate = sound_file.samplerate
        if chroma:
            stft = np.abs(librosa.stft(X))
        result = np.array([])
        if mfcc:
            mfccs = np.mean(librosa.feature.mfcc(y=X, sr=sample_rate, n_mfcc=40).T, axis=0)
            result = np.hstack((result, mfccs))
        if chroma:
            chroma = np.mean(librosa.feature.chroma_stft(S=stft, sr=sample_rate).T, axis=0)
            result = np.hstack((result, chroma))
        if mel:
            mel = np.mean(librosa.feature.melspectrogram(X, sr=sample_rate).T, axis=0)
            result = np.hstack((result, mel))
    return result


def load_data(test_size=0.2):
    x, y = [], []
    for file in glob.glob("C:\\Users\\User\\Desktop\\diploma\\voice-patrol\\backend\\emotion-recognition\\datasets\\Actor_*\*.wav"):
        file_name = os.path.basename(file)
        emotion = emotions[file_name.split("-")[2]]
        if emotion not in observed_emotions:
            continue
        feature = extract_feature(file, mfcc=True, chroma=True, mel=True)
        x.append(feature)
        y.append(emotion)
    return train_test_split(np.array(x), y, test_size=test_size, random_state=7)


def recognize_audio_emotion(newFile2):
    features = extract_feature(newFile2, mfcc=True, chroma=True, mel=True)
    prediction = model.predict([features])
    return prediction


x_train, x_test, y_train, y_test = load_data(test_size=0.25)
model = MLPClassifier(alpha=0.01, batch_size=256, epsilon=1e-08, hidden_layer_sizes=(300,),
                      learning_rate='adaptive', max_iter=800)
model.fit(x_train, y_train)


def job():
    # connect to mongodb
    newFile2 = "C:/Users/User/Desktop/diploma/voice-patrol/backend/api-audio-processing/13_testcall.wav"
    print(recognize_audio_emotion(newFile2))


schedule.every(5).seconds.do(job)

while True:
    schedule.run_pending()
    time.sleep(1)
