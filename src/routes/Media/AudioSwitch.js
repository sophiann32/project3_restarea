import React, { useRef } from 'react';

const AudioSwitch = React.forwardRef((props, ref) => (
    <audio
        ref={ref}
        src={props.src} // props로 src를 받아 사용
        controls
        style={{ display: 'none' }}
        onError={(event) => console.error("Audio failed to load", event)}
    ></audio>
));

export default AudioSwitch;
