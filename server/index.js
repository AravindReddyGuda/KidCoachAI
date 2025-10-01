require('dotenv').config();
const express = require('express');
const AWS = require('aws-sdk');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

const polly = new AWS.Polly({
  region: process.env.AWS_REGION || 'us-east-1'
});

app.post('/api/polly', async (req, res) => {
  const { text, voiceId = 'Joanna', outputFormat = 'mp3' } = req.body || {};

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const params = {
      Text: text,
      VoiceId: voiceId,
      OutputFormat: outputFormat
    };

    const { AudioStream, ContentType } = await polly.synthesizeSpeech(params).promise();

    if (!AudioStream) {
      return res.status(500).json({ error: 'No audio stream returned by Polly' });
    }

    const audioBase64 = AudioStream.toString('base64');

    return res.json({
      audio: audioBase64,
      contentType: ContentType || 'audio/mpeg'
    });
  } catch (error) {
    console.error('Polly synthesis failed', error);
    return res.status(500).json({ error: 'Failed to synthesize speech' });
  }
});

app.use((err, req, res, next) => {
  console.error('Unhandled server error', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
