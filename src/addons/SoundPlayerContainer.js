/** @jsx dom */
import { dom } from 'deku';
import assign from 'object-assign';
import SoundCloudAudio from 'soundcloud-audio';
import { stopAllOther, addToStore } from '../utils/audioStore';

export default {
    propTypes: {
        url: {
            type: 'string'
        },
        soundCloudAudio: function (prop) {
            return (prop instanceof SoundCloudAudio);
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

    afterMount(component, el, setState) {
        const { props } = component;
        const { soundCloudAudio } = props;

        soundCloudAudio.resolve(props.url, (data) => {
            // TBD: support for playlists
            const track = data.tracks ? data.tracks[0] : data;
            setState({ track });
        });

        function onAudioStarted () {
            setState({playing: true});

            stopAllOther(soundCloudAudio.playing);
            addToStore(soundCloudAudio);
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

    beforeUnmount(component) {
        const { props } = component;
        props.soundCloudAudio.unbindAll();
    },

    render(component) {
        const { props, state } = component;

        function wrapChild (child) {
            let cloneElement = assign({}, child);
            if (cloneElement.props) {
                cloneElement.props = assign({}, cloneElement.props, state, { soundCloudAudio: props.soundCloudAudio });
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
