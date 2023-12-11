import React from 'react';

function StoryInput({ onInputChange, onButtonClick, storyInput, isFadingOut }) {
  return (
    <div className={`input-container ${isFadingOut ? 'fading-out' : ''}`}>
      <textarea
        className="story-input"
        placeholder="Type your story concept here (up to 200 characters)..."
        maxLength="200"
        value={storyInput}
        onChange={onInputChange}
      />
      <button className="generate-button" onClick={onButtonClick}>
        Generate Story
      </button>
    </div>
  );
}

export default StoryInput;
