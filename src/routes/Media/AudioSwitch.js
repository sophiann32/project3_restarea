// AudioSwitch.js
import React, { useRef } from 'react';

const AudioSwitch = React.forwardRef((props, ref) => (
    <audio
        ref={ref}
        src="/a_car_whizzing_by슝.mp3"
        controls
        style={{ display: 'none' }}
        onError={(event) => console.error("Audio failed to load", event)}
    ></audio>
));

export default AudioSwitch;
