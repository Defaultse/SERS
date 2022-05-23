import json
import os
from flask import Flask, request
from bson.objectid import ObjectId
from collections import namedtuple
from Class import AudioObj, as_payload
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
from emotion_recognition import Start_emotion_recognition

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
    data = request.get_json()
    file_path = data['filePath']
    created_object_id = data['createdObjectID']

    audio_file, sampling_rate = librosa.load(file_path)

    n_fft = 2048
    S = librosa.stft(audio_file, n_fft=n_fft, hop_length=n_fft // 2)
    D = librosa.amplitude_to_db(np.abs(S), ref=np.max)
    non_mute_sections = librosa.effects.split(y=audio_file, top_db=np.max(abs(D) / 2))
    file_name = os.path.basename(file_path)
    dir_path = os.path.dirname(file_path)

    cnt_segments = 0

    for i in non_mute_sections:
        if ((i[1] / sampling_rate) - (i[0] / sampling_rate)) <= 1:
            continue
        new_audio = AudioSegment.from_wav(file_path)
        new_audio = new_audio[(i[0] / sampling_rate) * 1000: (i[1] / sampling_rate) * 1000]
        new_audio.export(dir_path + "/" + str(cnt_segments) + '_' + file_name, format="wav")
        collection.update_one({'_id': ObjectId(created_object_id)}, {'$push': {'AudioSegments':
            {
                'SegmentOrder': cnt_segments,
                'SegmentFilePath': str(dir_path + "/" + str(cnt_segments) + '_' + file_name),
                'SegmentEmotion': None
            }}})
        cnt_segments += 1

    document = collection.find_one({'_id': ObjectId(created_object_id)})
    segments = []
    for a in document.get('AudioSegments'):
        segments.append(json.loads(json.dumps(a), object_hook=as_payload))

    Start_emotion_recognition(collection=collection, createdObjectID=created_object_id, segments=segments)
    return '', 200


if __name__ == '__main__':
    app.run(threaded=True)
