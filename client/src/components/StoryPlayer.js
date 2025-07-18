import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  region: 'us-east-1'
});

const Polly = new AWS.Polly();

const StoryPlayer = ({ story }) => {
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    if (story) {
      setText(story.content);
    }
  }, [story]);

  const handlePlayPause = () => {
    if (isPlaying) {
      if (audio) {
        audio.pause();
      }
      setIsPlaying(false);
    } else {
      if (audio) {
        audio.play();
        setIsPlaying(true);
      } else if (text) {
        synthesizeSpeech(text);
      }
    }
  };

  const synthesizeSpeech = (text) => {
    const params = {
      Text: text,
      OutputFormat: 'mp3',
      VoiceId: 'Joanna'
    };

    Polly.synthesizeSpeech(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        const uInt8Array = new Uint8Array(data.AudioStream);
        const blob = new Blob([uInt8Array.buffer], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        const newAudio = new Audio(url);
        newAudio.onended = () => {
          setIsPlaying(false);
          setAudio(null);
        };
        setAudio(newAudio);
        newAudio.play();
        setIsPlaying(true);
      }
    });
  };

  return (
    <div>
      <h2>{story.title}</h2>
      <textarea
        value={text}
        rows="10"
        cols="80"
        readOnly
      />
      <button onClick={handlePlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};

export default StoryPlayer;
