# KidCoachAI

This project provides a React client and an accompanying Node/Express backend that proxies requests to Amazon Polly.

## Prerequisites

Set the following environment variables before starting the backend service:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION` (defaults to `us-east-1` if not provided)

These credentials must have permission to call the Polly `SynthesizeSpeech` API.

## Running the Backend

```bash
cd server
npm install
npm start
```

By default the server listens on port `5000` and exposes a `POST /api/polly` endpoint that returns a Base64-encoded audio stream.

## Running the Client

```bash
cd client
npm install
npm start
```

The client expects the backend to be running on the same origin (e.g., by proxying during development) so that it can call `/api/polly` to synthesize speech.
