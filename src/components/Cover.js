/** @jsx dom */
import dom from 'magic-virtual-element'; // eslint-disable-line no-unused-vars
import ClassNames from 'classnames';

export default {
    propTypes: {
        artworkUrl: {
            type: 'string'
        }
    },

    render(component) {
        const { props } = component;
        const classNames = ClassNames('sb-soundplayer-cover', props.class);

        return (
            <div class={classNames} style={props.artworkUrl ? `background-image: url(${props.artworkUrl})` : ''}>
                {props.children}
            </div>
        );
    }
};
