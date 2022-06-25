import schedule
import time
import librosa
import soundfile
import os, glob, pickle
import numpy as np
from bson import ObjectId
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler
import tensorflow as tf

MFCC_NUM = 40
MFCC_MAX_LEN = 1500
SAMPLING_RATE = 44100
feature_dim_1 = MFCC_NUM
feature_dim_2 = MFCC_MAX_LEN
channel = 1

emotions_to_string = {
    1: 'neutral',
    2: 'calm',
    3: 'happy',
    4: 'sad',
    5: 'angry',
    6: 'fearful',
    7: 'disgust',
    8: 'surprised'
}

try:
    model = tf.keras.models.load_model(
        "C:\\Users\\User\\Desktop\\diploma\\diploma\\backend\\emotion-recognition\\cnn_model_all_emotions")
except Exception as ex:
    print(ex)


def wav2mfcc(wave, max_len=MFCC_MAX_LEN):
    mfcc = librosa.feature.mfcc(wave, n_mfcc=MFCC_NUM, sr=SAMPLING_RATE)
    if max_len > mfcc.shape[1]:
        pad_width = max_len - mfcc.shape[1]
        mfcc = np.pad(mfcc, pad_width=((0, 0), (0, pad_width)), mode='constant')
    else:
        mfcc = mfcc[:, :max_len]

    return mfcc


def extract_feature(data, sr, mfcc, chroma, mel):
    if chroma:
        stft = np.abs(librosa.stft(data))
    result = np.array([])
    if mfcc:
        mfccs = np.mean(librosa.feature.mfcc(y=data, sr=sr, n_mfcc=40).T, axis=0)
        result = np.hstack((result, mfccs))
    if chroma:
        chroma = np.mean(librosa.feature.chroma_stft(S=stft, sr=sr).T, axis=0)
        result = np.hstack((result, chroma))
    if mel:
        mel = np.mean(librosa.feature.melspectrogram(data, sr=sr).T, axis=0)
        result = np.hstack((result, mel))

    return result


def noise(data, noise_factor):
    noise = np.random.randn(len(data))
    augmented_data = data + noise_factor * noise

    # Cast back to same data type
    augmented_data = augmented_data.astype(type(data[0]))
    return augmented_data


def Start_emotion_recognition(collection, createdObjectID, segments):
    for i in range(len(segments)):
        try:

            wave, sr = librosa.load(segments[i].SegmentFilePath, mono=True, sr=44100)
            wave = wave[::3]
            mfcc = wav2mfcc(wave)
            X_test = mfcc.reshape(1, feature_dim_1, feature_dim_2, channel)
            preds = model.predict(X_test)[0]
            classes_x = np.argmax(preds, axis=0)
            segment_emotion = emotions_to_string[classes_x]

            # XX, yy = librosa.load(segments[i].SegmentFilePath)
            # xtest = np.expand_dims([feature], axis=2)
            # preds = model.predict(xtest)[0]
            # classes_x = np.argmax(preds, axis=-1)
            # segment_emotion = emotions_to_string[classes_x]

            # n_data = noise(XX, 0.001)
            # n_feature = extract_feature(n_data, yy, mfcc=True, chroma=True, mel=True)
            # xtest = np.expand_dims([n_feature], axis=2)
            # preds = model.predict(xtest)[0]
            # classes_x = np.argmax(preds, axis=-1)
            # segment_emotion = emotions_to_string[classes_x]

            collection.update_one({'_id': ObjectId(createdObjectID), 'AudioSegments.SegmentOrder': i},
                                  {'$set': {'AudioSegments.$.SegmentEmotion': segment_emotion}})
        except Exception as error:
            print(error)
    return None



