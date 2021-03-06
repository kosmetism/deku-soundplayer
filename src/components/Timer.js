/** @jsx dom */
import dom from 'magic-virtual-element'; // eslint-disable-line no-unused-vars

function prettyTime (time) {
    let hours = Math.floor(time / 3600);
    let mins = '0' + Math.floor((time % 3600) / 60);
    let secs = '0' + Math.floor((time % 60));

    mins = mins.substr(mins.length - 2);
    secs = secs.substr(secs.length - 2);

    if (!isNaN(secs)) {
        if (hours) {
            return `${hours}:${mins}:${secs}`;
        } else {
            return `${mins}:${secs}`;
        }
    } else {
        return '00:00';
    }
}

export default {
    defaultProps: {
        duration: 0,
        currentTime: 0
    },

    propTypes: {
        duration: {
            type: 'number'
        },

        currentTime: {
            type: 'number'
        }
    },

    render(component) {
        const { props } = component;

        return (
            <div class="sb-soundplayer-timer">
                {prettyTime(props.currentTime)} / {prettyTime(props.duration)}
            </div>
        );
    }
};
