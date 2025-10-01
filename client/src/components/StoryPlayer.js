import React, { useState, useEffect } from 'react';

const StoryPlayer = ({ story }) => {
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [error, setError] = useState(null);

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
        audio.play()
          .then(() => {
            setIsPlaying(true);
            setError(null);
          })
          .catch((playError) => {
            console.error(playError);
            setError(playError.message);
            setIsPlaying(false);
          });
      } else if (text) {
        synthesizeSpeech(text);
      }
    }
  };

  const synthesizeSpeech = (text) => {
    setError(null);

    fetch('/api/polly', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    })
      .then(async (response) => {
        const raw = await response.text();

        if (!response.ok) {
          try {
            const data = JSON.parse(raw);
            if (data && data.error) {
              throw new Error(data.error);
            }
          } catch (parseError) {
            if (raw) {
              throw new Error(raw);
            }
          }

          throw new Error('Failed to synthesize speech');
        }

        try {
          return JSON.parse(raw);
        } catch (parseError) {
          throw new Error('Invalid JSON response from server');
        }
      })
      .then(({ audio: audioBase64, contentType }) => {
        if (!audioBase64) {
          throw new Error('Invalid audio response from server');
        }

        const binary = window.atob(audioBase64);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i += 1) {
          bytes[i] = binary.charCodeAt(i);
        }

        const blob = new Blob([bytes.buffer], { type: contentType || 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        const newAudio = new Audio(url);
        newAudio.onended = () => {
          setIsPlaying(false);
          setAudio(null);
          URL.revokeObjectURL(url);
        };
        setAudio(newAudio);
        newAudio.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((playError) => {
            setError(playError.message);
            setIsPlaying(false);
            setAudio(null);
            URL.revokeObjectURL(url);
          });
      })
      .catch((fetchError) => {
        console.error(fetchError);
        setError(fetchError.message);
        setIsPlaying(false);
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
      {error && (
        <p style={{ color: 'red' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default StoryPlayer;
