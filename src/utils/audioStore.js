// handling multiple audio on the page helpers
let _playedAudios = [];
let _audioRegistry = {};

export function stopAllOther (playing) {
    _playedAudios.forEach((soundCloudAudio) => {
        if (soundCloudAudio.playing && soundCloudAudio.playing !== playing) {
            soundCloudAudio.stop();
        }
    });
}

export function addToPlayedStore (soundCloudAudio) {
    let isPresent = false;

    for (let i = 0, len = _playedAudios.length; i < len; i++) {
        let _soundCloudAudio = _playedAudios[i];
        if (_soundCloudAudio.playing === soundCloudAudio.playing) {
            isPresent = true;
            break;
        }
    }

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
