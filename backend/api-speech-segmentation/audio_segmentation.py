import librosa
from sklearn.mixture import *
import numpy as np
import pandas as pd


def voiceActivityDetection(wavData, frameRate):
    # uses the librosa library to compute short-term energy
    ste = librosa.feature.rms(wavData, hop_length=int(16000 / frameRate)).T
    thresh = 0.1 * (np.percentile(ste, 97.5) + 9 * np.percentile(ste,
                                                                 2.5))  # Trim 5% off and set threshold as 0.1x of the ste range
    return (ste > thresh).astype('bool')


def trainGMM(wavFile, frameRate, segLen, vad, numMix):
    wavData, _ = librosa.load(wavFile, sr=16000)
    mfcc = librosa.feature.mfcc(wavData, sr=16000, n_mfcc=40, hop_length=int(16000 / frameRate)).T
    vad = np.reshape(vad, (len(vad),))
    if mfcc.shape[0] > vad.shape[0]:
        vad = np.hstack((vad, np.zeros(mfcc.shape[0] - vad.shape[0]).astype('bool'))).astype('bool')
    elif mfcc.shape[0] < vad.shape[0]:
        vad = vad[:mfcc.shape[0]]
    mfcc = mfcc[vad, :];
    print("Training GMM..")
    GMM = GaussianMixture(n_components=numMix, covariance_type='diag').fit(mfcc)
    var_floor = 1e-5
    segLikes = []
    segSize = frameRate * segLen
    for segI in range(int(np.ceil(float(mfcc.shape[0]) / (frameRate * segLen)))):
        startI = segI * segSize
        endI = (segI + 1) * segSize
        if endI > mfcc.shape[0]:
            endI = mfcc.shape[0] - 1
        if endI == startI:  # Reached the end of file
            break
        seg = mfcc[startI:endI, :]
        compLikes = np.sum(GMM.predict_proba(seg), 0)
        segLikes.append(compLikes / seg.shape[0])
    print("Training Done")

    return np.asarray(segLikes)


def segmentFrame(clust, segLen, frameRate, numFrames):
    frameClust = np.zeros(numFrames)
    for clustI in range(len(clust) - 1):
        frameClust[clustI * segLen * frameRate:(clustI + 1) * segLen * frameRate] = clust[clustI] * np.ones(
            segLen * frameRate)
    frameClust[(clustI + 1) * segLen * frameRate:] = clust[clustI + 1] * np.ones(
        numFrames - (clustI + 1) * segLen * frameRate)
    return frameClust


def speakerdiarisationdf(hyp, frameRate, wavFile):
    audioname = []
    starttime = []
    endtime = []
    speakerlabel = []
    countSegments = 0

    spkrChangePoints = np.where(hyp[:-1] != hyp[1:])[0]
    if spkrChangePoints[0] != 0 and hyp[0] != -1:
        spkrChangePoints = np.concatenate(([0], spkrChangePoints))
    spkrLabels = []
    for spkrHomoSegI in range(len(spkrChangePoints)):
        spkrLabels.append(hyp[spkrChangePoints[spkrHomoSegI] + 1])
    for spkrI, spkr in enumerate(spkrLabels[:-1]):
        if spkr != -1:
            audioname.append(wavFile.split('/')[-1].split('.')[0] + ".wav")
            starttime.append((spkrChangePoints[spkrI] + 1) / float(frameRate))
            endtime.append((spkrChangePoints[spkrI + 1] - spkrChangePoints[spkrI]) / float(frameRate))
            speakerlabel.append("Speaker " + str(int(spkr)))
    if spkrLabels[-1] != -1:
        audioname.append(wavFile.split('/')[-1].split('.')[0] + ".wav")
        starttime.append(spkrChangePoints[-1] / float(frameRate))
        endtime.append((len(hyp) - spkrChangePoints[-1]) / float(frameRate))
        speakerlabel.append("Speaker " + str(int(spkrLabels[-1])))
    #
    speakerdf = pd.DataFrame(
        {"Audio": audioname, "starttime": starttime, "endtime": endtime, "speakerlabel": speakerlabel})

    spdatafinal = pd.DataFrame(columns=['Audio', 'SpeakerLabel', 'StartTime', 'EndTime'])
    i = 0
    k = 0
    j = 0
    spfind = ""
    stime = ""
    etime = ""
    for row in speakerdf.itertuples():
        if i == 0:
            spfind = row.speakerlabel
            stime = row.starttime
        else:
            if (spfind == row.speakerlabel):
                etime = row.starttime
            else:
                spdatafinal.loc[k] = [wavFile.split('/')[-1].split('.')[0] + ".wav", spfind, stime, row.starttime]
                k = k + 1
                spfind = row.speakerlabel
                stime = row.starttime
        i = i + 1

    spdatafinal.loc[k] = [wavFile.split('/')[-1].split('.')[0] + ".wav", spfind, stime, etime]
    return spdatafinal
