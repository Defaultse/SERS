import json


class AudioObj:
    def __init__(self, _id, AudioDate, UploadDate, AudioFilePath, AudioSegments):
        self._id = _id
        self.AudioDate = AudioDate
        self.UploadDate = UploadDate
        self.AudioFilePath = AudioFilePath
        self.AudioSegments = AudioSegments


class AudioSegment(object):
    def __init__(self, SegmentOrder, SegmentFilePath):
        self.SegmentOrder = SegmentOrder
        self.SegmentFilePath = SegmentFilePath

    def __str__(self):
        return str(self.SegmentOrder) + " " + str(self.SegmentFilePath)


def as_payload(dct):
    return AudioSegment(dct['SegmentOrder'], dct['SegmentFilePath'])
