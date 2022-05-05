import os
from flask import Flask, request
from bson.objectid import ObjectId
from audio_segmentation import *
import librosa
from sklearn.cluster import AgglomerativeClustering
from sklearn.mixture import *
import numpy as np
import pymongo
from sklearn.preprocessing import StandardScaler, normalize
from pydub import AudioSegment
from urllib.parse import quote_plus
import os
import pandas as pd
import librosa
import librosa.display
from librosa import display
import numpy as np
import matplotlib.pyplot as plt
import glob
from IPython.display import Audio
import warnings
warnings.filterwarnings('ignore')
from emotion_recognition import start_emotion_recognition

uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"

app = Flask(__name__)

segLen, frameRate, numMix = 3, 50, 128

try:
    client = pymongo.MongoClient("localhost", 27017)
    db = client['voice-patrol']
    collection = db.get_collection("AudioFiles")
    print("Successfully connected to mongo")
except Exception as ex:
    print(ex)


@app.route('/api/segmentAudio', methods=["POST"])
def speech_segmentation():
    # data = request.get_json()
    # file_path = data['filePath']
    # createdObjectID = data['createdObjectID']
    # audio_file, sampling_rate = librosa.load(file_path)

    # n_fft = 2048
    # S = librosa.stft(audio_file, n_fft=n_fft, hop_length=n_fft // 2)
    # D = librosa.amplitude_to_db(np.abs(S), ref=np.max)
    # nonMuteSections = librosa.effects.split(y=audio_file, top_db=np.max(abs(D)) - 20)
    # file_name = os.path.basename(file_path)
    # dir_path = os.path.dirname(file_path)
    # cnt_segments = 0
    # for i in nonMuteSections:
    #     if ((i[1] / sampling_rate) - (i[0] / sampling_rate)) <= 1:
    #         continue
    #     newAudio = AudioSegment.from_wav(file_path)
    #     newAudio = newAudio[(i[0] / sampling_rate) * 1000: (i[1] / sampling_rate) * 1000]
    #     newAudio.export(dir_path + "/" + str(cnt_segments) + '_' + file_name + '.wav', format="wav")
    #     collection.update_one({'_id': ObjectId(createdObjectID)}, {'$push': {'AudioSegments':
    #                                                                              {
    #                                                                                  'SegmentOrder': cnt_segments,
    #                                                                                  'SegmentFilePath': str(dir_path + "/" + str(cnt_segments) + '_' + file_name)
    #                                                                              }}})
    #     cnt_segments += 1

    #     loop here for each cnt_segment
    # start_emotion_recognition(collection=collection, createdObjectID="6266723e23d0ebd80412ea20", cnt_segments=21)

    document = collection.find_one({'_id': ObjectId("6266723e23d0ebd80412ea20")})
    print(document.get("AudioSegments"))
#     make parser for
#  [
#     {'SegmentOrder': 0, 'SegmentFilePath': 'C:/Users/User/Desktop/diploma/diploma/backend/file-storage/qwe/0_4245019667_testcall.wav'},
#     {'SegmentOrder': 1, 'SegmentFilePath': 'C:/Users/User/Desktop/diploma/diploma/backend/file-storage/qwe/1_4245019667_testcall.wav'},
#  ]


if __name__ == '__main__':
    app.run()
