from flask import Flask
from audio_segmentation import *
import librosa
from sklearn.cluster import AgglomerativeClustering
from sklearn.mixture import *
import numpy as np
from sklearn.preprocessing import StandardScaler, normalize
from pydub import AudioSegment

app = Flask(__name__)

segLen, frameRate, numMix = 3, 50, 128
wavFile = "C:/Users/User/Desktop/diploma/voice-patrol/backend/api-speech-segmentation/testcall.wav"


@app.route('/api/segmentAudio')
def speech_segmentation():  # put application's code here
    wavData, _ = librosa.load(wavFile, sr=16000)
    vad = voiceActivityDetection(wavData, frameRate)

    mfcc = librosa.feature.mfcc(wavData, sr=16000, n_mfcc=20, hop_length=int(16000 / frameRate)).T
    vad = np.reshape(vad, (len(vad),))
    if mfcc.shape[0] > vad.shape[0]:
        vad = np.hstack((vad, np.zeros(mfcc.shape[0] - vad.shape[0]).astype('bool'))).astype('bool')
    elif mfcc.shape[0] < vad.shape[0]:
        vad = vad[:mfcc.shape[0]]
    mfcc = mfcc[vad, :]

    n_components = np.arange(1, 25)
    models = [GaussianMixture(n, covariance_type='full', random_state=0).fit(mfcc)
              for n in n_components]

    clusterset = trainGMM(wavFile, frameRate, segLen, vad, numMix)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(clusterset)
    # Normalizing the data so that the data approximately
    # follows a Gaussian distribution
    X_normalized = normalize(X_scaled)

    cluster = AgglomerativeClustering(n_clusters=2, affinity='euclidean', linkage='ward')
    clust = cluster.fit_predict(X_normalized)

    frameClust = segmentFrame(clust, segLen, frameRate, mfcc.shape[0])

    pass1hyp = -1 * np.ones(len(vad))
    pass1hyp[vad] = frameClust
    spkdf = speakerdiarisationdf(pass1hyp, frameRate, wavFile)

    spkdf["TimeSeconds"] = spkdf.EndTime - spkdf.StartTime
    audioFileName = spkdf['Audio'][0]

    for i in range(np.size(spkdf['Audio'])):
        newAudio = AudioSegment.from_wav(wavFile)
        newAudio = newAudio[spkdf['StartTime'][i] * 1000:spkdf['EndTime'][i] * 1000]
        newAudio.export(str(i) + '_' + audioFileName, format="wav")  # Exports to a wav file in the current path.
    return 'Success'


if __name__ == '__main__':
    app.run()
