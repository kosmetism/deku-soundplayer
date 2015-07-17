// handling multiple audio on the page helpers
let _playedAudios = [];
let _audioRegistry = {};

function each (arr, cb) {
    if (arr) {
        for (let i = 0, len = arr.length; i < len; i++) {
            if (arr[i] && cb(arr[i], i, arr)) {
                break;
            }
        }
    }
}

export function stopAllOther (playing) {
    each(_playedAudios, soundCloudAudio => {
        if (soundCloudAudio.playing && soundCloudAudio.playing !== playing) {
            soundCloudAudio.stop();
        }
    });
}

export function addToPlayedStore (soundCloudAudio) {
    let isPresent = false;

    each(_playedAudios, _soundCloudAudio => {
        if (_soundCloudAudio.playing === soundCloudAudio.playing) {
            isPresent = true;
            return true;
        }
    });

    if (!isPresent) {
        _playedAudios.push(soundCloudAudio);
    }
}

export function addToRegistry (componentId, soundCloudAudio) {
    _audioRegistry[componentId] = soundCloudAudio;
}

export function getFromRegistry (componentId) {
    return _audioRegistry[componentId];
}
