import React from 'react';

function AudioPlayer({ audioRef, audioUrl, onPlayClick, hideButton }) {
  return (
    <div className="audio-player">
      <audio ref={audioRef} id="storyAudio" src={audioUrl} />
      {!hideButton && (
        <button className="play-button" onClick={onPlayClick}>
          <div className="play-icon"></div>
        </button>
      )}
    </div>
  );
}

export default AudioPlayer;
