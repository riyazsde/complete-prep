import { useState } from "react";
import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: process.env.REACT_APP_ASSEMBLY_KEY || "YOUR_API_KEY",
});

export const useAssemblyTranscription = () => {
  const [status, setStatus] = useState("idle");
  const [summary, setSummary] = useState(null);
  const [transcriptText, setTranscriptText] = useState(null);
  const [wordSegments, setWordSegments] = useState([]);
  const [utterances, setUtterances] = useState([]);
  const [error, setError] = useState(null);

  const transcribe = async (audioUrl) => {
    setStatus("loading");
    setError(null);

    try {
   const transcript = await client.transcripts.create({
     audio_url: audioUrl,
     language_code: "en_us",  
     summarization: true, // Enable summarization
     summary_model: "informative", // Required when summary_type is set
     summary_type: "bullets_verbose", // Required when summary_model is set
     punctuate: true, // Required for summarization
     format_text: true, // Required for summarization
     auto_highlights: true, // Optional: enables key highlights extraction
     // speaker_labels: true,            // Optional: enable if you want speaker diarization
     // language_detection: true,        // Optional: enable if you want automatic language detection
     // words: true,                     // Optional: include word-level timestamps
     // utterances: true,                // Optional: include utterance-level segmentation
   });

      let completedTranscript;
      const maxRetries = 60;
      const delay = 5000;

      for (let i = 0; i < maxRetries; i++) {
        const current = await client.transcripts.get(transcript.id);
        if (current.status === "completed") {
          completedTranscript = current;
          break;
        } else if (current.status === "error") {
          throw new Error("Transcription failed: " + current.error);
        }
        await new Promise((res) => setTimeout(res, delay));
      }

      if (!completedTranscript) {
        throw new Error("Timed out waiting for transcription.");
      }
      console.log(completedTranscript);
      setTranscriptText(completedTranscript.text);
      setSummary(completedTranscript.summary || null);
      setWordSegments(completedTranscript.words || []);
      setUtterances(completedTranscript.utterances || []);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setError(err.message || "Unknown error");
      setStatus("error");
    }
  };

  const transcribeLive = () => {
    setStatus("live");

    const socket = new WebSocket("ws://localhost:5001");

    socket.onopen = () => {
      console.log("WebSocket connected for live transcription");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.transcript) {
          setTranscriptText((prev) =>
            prev ? `${prev}\n${data.transcript}` : data.transcript
          );
        }
      } catch (e) {
        console.warn("Failed to parse WebSocket message:", event.data);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error", err);
      setError("WebSocket error");
      setStatus("error");
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      setStatus("idle");
    };

    return socket;
  };

  return {
    transcribe,
    transcribeLive,
    status,
    summary,
    transcriptText,
    wordSegments,
    utterances,
    error,
  };
};
