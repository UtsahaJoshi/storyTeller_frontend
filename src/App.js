import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import StoryInput from './components/StoryInput';
import LoadingIndicator from './components/LoadingIndicator';
import AudioPlayer from './components/AudioPlayer';

function App() {
  const [storyInput, setStoryInput] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [timestamps, setWordTimestamps] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [playAudio, setPlayAudio] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [imageURL, setImageURL] = useState('');

  const audioRef = useRef(null);
  const backgroundImageRef = useRef(null);

  const handleInputChange = (e) => {
    setStoryInput(e.target.value);
  };

  const generateStory = async () => {
    setIsFadingOut(true);
    setTimeout(async () => {
      setIsLoading(true);
      try {
        const storyResponse = await axios.post('http://localhost:5000/generate-start', { text: storyInput });
        const parsedData = JSON.parse(storyResponse.data.story);
        setStoryText(parsedData.story_text);
  
        const speechResponse = await axios.post('http://localhost:5000/text-to-speech', { text: parsedData.story_text });
        setAudioUrl(speechResponse.data.audio_url);
        const speechResponse_data_word_timestamps = [{'word': ' The sun was disappearing behind the horizon,', 'start': 0.0, 'end': 2.24}, {'word': ' painting the sky with hues of red and gold', 'start': 2.24, 'end': 4.76}, {'word': ' as John stepped into the legendary Hotel California,', 'start': 4.76, 'end': 8.36}, {'word': ' located in a quaint, mysterious town.', 'start': 8.36, 'end': 11.040000000000001}, {'word': ' The grand lobby held an eerie allure', 'start': 11.040000000000001, 'end': 13.36}, {'word': ' with its high ceiling dripping with chandeliers', 'start': 13.36, 'end': 16.2}, {'word': ' and the scent of lost time hung heavily in the air.', 'start': 16.2, 'end': 19.64}, {'word': " There's a sense of grandeur,", 'start': 19.64, 'end': 21.16}, {'word': ' yet something undeniably weird about the place.', 'start': 21.16, 'end': 24.48}, {'word': ' As John checked in, an uncanny chill ran down his spine,', 'start': 24.48, 'end': 28.0}, {'word': ' though he shrugged it off as exhaustion.', 'start': 28.08, 'end': 30.52}, {'word': ' But when he reached the room,', 'start': 30.52, 'end': 31.84}, {'word': ' it was rocking from damp and cold chills to dry,', 'start': 31.84, 'end': 34.64}, {'word': ' sweltering heat in a matter of seconds.', 'start': 34.64, 'end': 37.519999999999996}, {'word': ' Suddenly, he heard the distant, soothing chords', 'start': 37.519999999999996, 'end': 39.88}, {'word': ' of a guitar ringing out.', 'start': 39.88, 'end': 41.68}, {'word': ' Desperate to find the source,', 'start': 41.68, 'end': 43.2}, {'word': ' he pushed open a hidden door with a grim resolve,', 'start': 43.2, 'end': 46.2}, {'word': ' unknowingly stepping into a world', 'start': 46.2, 'end': 48.32}, {'word': ' filled with beguiling enchantments and lurking dangers.', 'start': 48.32, 'end': 51.7}]
        setWordTimestamps(speechResponse_data_word_timestamps);
  
        const imageResponse = await axios.post('http://localhost:5000/generate-image', { text: parsedData.story_text });
        setImageURL(imageResponse.data.image_url); // Set the preloaded image URL
      } catch (error) {
        console.error('Error:', error);
      }
    }, 1000); // Adjust the duration as needed for the fade-out effect
  };

  useEffect(() => {
    if (imageURL) {
        backgroundImageRef.current.style.backgroundImage = `url(${imageURL})`;
        backgroundImageRef.current.style.transform = 'scale(1.5)';
        onImageLoad();
    }
}, [imageURL]);

  const onImageLoad = () => {
    // Image has loaded
    setIsLoading(false);
    setShowOverlay(true);
  };

  const playStory = () => {
    setShowOverlay(false);
    setPlayAudio(true);
    audioRef.current.play();

    let audioDuration = audioRef.current.duration || 30; // Fallback duration

    // Apply zoom-out animation to the background image
    backgroundImageRef.current.style.animation = `zoomIn ${audioDuration}s linear forwards`;
    
    let currentIndex = 0;

    const displayChunk = () => {
      if (currentIndex < timestamps.length) {
        const currentTimestamp = timestamps[currentIndex];
        let duration = (currentTimestamp.end - currentTimestamp.start) * 1000;
        const textElement = document.querySelector('.animated-text');
        textElement.style.animation = 'none';
        (() => textElement.offsetWidth)();
        textElement.style.animation = null;
        textElement.style.animationDuration = `${duration}ms`;
        setCurrentText(currentTimestamp.word);
        currentIndex++;
        setTimeout(displayChunk, duration);
      } else {
        // Check if the audio has ended
        if (audioRef.current.ended) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          setCurrentText('');
          setPlayAudio(false);
          resetBackgroundZoom()
          setShowOverlay(true);
        } else {
          // If audio is still playing, check again after a short delay
          setTimeout(displayChunk, 500); // Check again after 500ms
        }
      }
    };    

    displayChunk();
  };

  const resetBackgroundZoom = () => {
    // Reset the zoom of the background image
    backgroundImageRef.current.style.transform = 'scale(1.5)';
    backgroundImageRef.current.style.animation = 'none';
  };

  return (
    <div className="App">
      {imageURL && (<div ref={backgroundImageRef} className={`background-image ${showOverlay ? 'show-overlay' : ''}`}></div>)}
      {!isLoading && audioUrl && (
        <AudioPlayer
          audioRef={audioRef}
          audioUrl={audioUrl}
          onPlayClick={playStory}
          hideButton={playAudio}
        />
      )}
      {storyText === '' && !isLoading && (
        <>
          <Header isFadingOut={isFadingOut} />
          <StoryInput
            isFadingOut={isFadingOut}
            onInputChange={handleInputChange}
            onButtonClick={generateStory}
            storyInput={storyInput}
          />
        </>
      )}
      {isLoading && <LoadingIndicator />}
      <p className="animated-text">{currentText}</p>
    </div>
  );
}

export default App;