/** @jsx dom */
import dom from 'virtual-element'; // eslint-disable-line no-unused-vars
import assign from 'object-assign';
import SoundCloudAudio from 'soundcloud-audio';
import {
    stopAllOther,
    addToPlayedStore,
    addToRegistry,
    getFromRegistry
} from '../utils/audioStore';

export default {
    propTypes: {
        resolveUrl: {
            type: 'string'
        },

        clientId: {
            type: 'string'
        }
    },

    initialState() {
        return {
            duration: 0,
            currentTime: 0,
            seeking: false,
            playing: false
        };
    },

    beforeMount(component) {
        const { props, state, id } = component;
        const { clientId } = props;

        if (!clientId) {
            throw new Error(
                `You need to get clientId from SoundCloud
                https://github.com/soundblogs/react-soundplayer#usage`
            );
        }

        if ('undefined' !== typeof window) {
            const soundCloudAudio = new SoundCloudAudio(clientId);
            addToRegistry(id, soundCloudAudio);
        }
    },

    afterMount(component, el, setState) {
        const { props, state, id } = component;
        const { resolveUrl, streamUrl } = props;
        const soundCloudAudio = getFromRegistry(id);

        if (streamUrl) {
            soundCloudAudio.preload(streamUrl);
        } else if (resolveUrl) {
            soundCloudAudio.resolve(resolveUrl, (data) => {
                // TBD: support for playlists
                const track = data.tracks ? data.tracks[0] : data;
                setState({ track });
            });
        }

        function onAudioStarted () {
            setState({playing: true});

            stopAllOther(soundCloudAudio.playing);
            addToPlayedStore(soundCloudAudio);
        }

        function getCurrentTime () {
            setState({currentTime: soundCloudAudio.audio.currentTime});
        }

        function getDuration () {
            setState({duration: soundCloudAudio.audio.duration});
        }

        function onSeekingTrack () {
            setState({seeking: true});
        }

        function onSeekedTrack () {
            setState({seeking: false});
        }

        function onAudioEnded () {
            setState({playing: false});
        }

        // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
        soundCloudAudio.on('playing', onAudioStarted);
        soundCloudAudio.on('timeupdate', getCurrentTime);
        soundCloudAudio.on('loadedmetadata', getDuration);
        soundCloudAudio.on('seeking', onSeekingTrack);
        soundCloudAudio.on('seeked', onSeekedTrack);
        soundCloudAudio.on('pause', onAudioEnded);
        soundCloudAudio.on('ended', onAudioEnded);
    },

    afterUpdate(component, prevProps, prevState, setState) {
        const { props, state, id } = component;
        const { resolveUrl, streamUrl } = props;
        const soundCloudAudio = getFromRegistry(id);
        const playedBefore = state.playing;

        function restartIfPlayed () {
            if (playedBefore) {
                soundCloudAudio.play();
            }
        }

        if (streamUrl !== prevProps.streamUrl) {
            soundCloudAudio.stop();
            soundCloudAudio.preload(streamUrl);
            restartIfPlayed();
        } else if (resolveUrl !== prevProps.resolveUrl) {
            soundCloudAudio.stop();
            soundCloudAudio.resolve(resolveUrl, (data) => {
                // TBD: support for playlists
                const track = data.tracks ? data.tracks[0] : data;
                setState({ track });
                restartIfPlayed();
            });
        }
    },

    beforeUnmount(component) {
        const soundCloudAudio = getFromRegistry(component.id);
        soundCloudAudio.unbindAll();
    },

    render(component) {
        const { props, state, id } = component;
        const soundCloudAudio = getFromRegistry(id);

        function wrapChild (child) {
            let cloneElement = assign({}, child);
            if (cloneElement.attributes) {
                cloneElement.attributes = assign({}, cloneElement.attributes, state, { soundCloudAudio });
            }
            return cloneElement;
        }

        return (
            <span>
                {props.children.map(wrapChild)}
            </span>
        );
    }
};
