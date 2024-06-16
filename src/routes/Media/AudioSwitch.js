import React, { useRef } from 'react';
import './AudioSwitch.module.css';

const AudioSwitch = () => {
    const audioRef = useRef(null);

    const handleButtonClick = () => {
        if (audioRef.current) {
            if (audioRef.current.paused) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        } else {
            console.error("audioRef is not assigned correctly.");
        }
    };

    const handleAudioError = (event) => {
        console.error("Audio failed to load", event);
    };

    return (
        <div className="switch-audio">
            <button className="switch-audio__btn" onClick={handleButtonClick} >
                <span style={{color: "ghostwhite", fontSize: "larger"}}>💽</span>
                <audio
                    ref={audioRef}
                    src="/bgsound2.mp3"
                    controls
                    style={{display: 'none'}}
                    onError={handleAudioError}
                ></audio>
            </button>
        </div>
);
};

export default AudioSwitch;
