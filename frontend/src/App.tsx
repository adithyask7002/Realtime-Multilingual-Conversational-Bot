import { useEffect, useRef, useState } from "react";
import { GoogleGenAI, Modality } from "@google/genai";
import "./App.css";

const BACKEND_URL = "http://localhost:5000";

const LIVE_MODEL = "gemini-3.8-live";

const SESSION_STORAGE_KEY = "vaanix-session-id";

type TranscriptMessage = {
  role: "user" | "assistant";
  text: string;
};

type ConversationMessage = {
  role: "user" | "assistant";
  text: string;
  timestamp: number;
};

type Expression =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking";

function App() {
  const [sessionId] = useState(() => {
    const existingSessionId =
      localStorage.getItem(SESSION_STORAGE_KEY);

    if (existingSessionId) {
      return existingSessionId;
    }

    const newSessionId =
      crypto.randomUUID();

    localStorage.setItem(
      SESSION_STORAGE_KEY,
      newSessionId
    );

    return newSessionId;
  });

  const [connected, setConnected] = useState(false);
const [status, setStatus] = useState("Ready");
  const [error, setError] = useState("");

  const [transcript, setTranscript] = useState<
    TranscriptMessage[]
  >([]);

  /*
   * =========================================================
   * CONVERSATION MEMORY
   * =========================================================
   */

  const [conversationHistory, setConversationHistory] =
    useState<ConversationMessage[]>([]);
  const [memoryLoaded, setMemoryLoaded] =
    useState(false);  
      useEffect(() => {
    async function loadConversationHistory() {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/memory/messages/${sessionId}`
        );

        if (!response.ok) {
          throw new Error(
            `Memory load failed: ${response.status}`
          );
        }

        const data =
          await response.json();

        if (
  data.status !== "ok" ||
  !Array.isArray(data.messages)
) {
  setMemoryLoaded(true);
  return;
}

        const loadedMessages =
          data.messages.map(
            (message: any) => ({
              role:
                message.role === "user"
                  ? "user"
                  : "assistant",

              text: message.content,

              timestamp:
                new Date(
                  message.created_at
                ).getTime(),
            })
          );

        setConversationHistory(
          loadedMessages
        );
        setMemoryLoaded(true);

        console.log(
          "🧠 VaaniX memory loaded:",
          loadedMessages.length,
          "messages"
        );
      } catch (error) {
  console.error(
    "Failed to load VaaniX memory:",
    error
  );

  setMemoryLoaded(true);
}
    }

    void loadConversationHistory();
  }, [sessionId]);

    async function saveMessageToDatabase(
    role: "user" | "assistant",
    content: string
  ) {
    const cleanText = content.trim();

    if (!cleanText) return;

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/memory/messages`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            sessionId,
            role,
            content: cleanText,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Memory save failed: ${response.status}`
        );
      }

      console.log(
        "🧠 VaaniX memory saved:",
        role,
        cleanText
      );
    } catch (error) {
      console.error(
        "Failed to save VaaniX memory:",
        error
      );
    }
  }

  const addConversationMessage = (
    role: "user" | "assistant",
    text: string
  ) => {
    const cleanText = text.trim();

    if (!cleanText) return;

    setConversationHistory((previous) => [
      ...previous,
      {
        role,
        text: cleanText,
        timestamp: Date.now(),
      },
    ]);

    void saveMessageToDatabase(
      role,
      cleanText
    );
  };

  /*
 * =========================================================
 * SAVE BENCHMARK RESULT
 * =========================================================
 */

async function saveBenchmarkResult(
  hypothesisText: string
) {
  if (
    !benchmarkMode ||
    !benchmarkTestId ||
    !benchmarkReferenceText ||
    !benchmarkLanguage
  ) {
    return;
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/benchmark/evaluate`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          testId: benchmarkTestId,

          language: benchmarkLanguage,

          referenceText:
            benchmarkReferenceText,

          hypothesisText:
            hypothesisText.trim(),

          languageDetected:
            null,

          languageCorrect:
            null,

          codeSwitch:
            benchmarkCodeSwitch,

          latencyMs:
            latencyMs,

          ttsRating:
            null,

          system:
            "vaanix",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Benchmark save failed: ${response.status}`
      );
    }

    const data = await response.json();

    console.log(
      "📊 VaaniX benchmark result saved:",
      data
    );
  } catch (error) {
    console.error(
      "Failed to save benchmark result:",
      error
    );
  }
}
  
    /*
   * Build a compact context block from the most recent
   * conversation turns.
   *
   * This context will be given to Gemini when a new
   * Live session starts.
   */
  const buildConversationContext = () => {
    if (conversationHistory.length === 0) {
      return "";
    }

    const recentMessages =
      conversationHistory.slice(-12);

    return `
PREVIOUS CONVERSATION CONTEXT:

${recentMessages
  .map(
    (message) =>
      `${message.role === "user" ? "User" : "VaaniX"}: ${message.text}`
  )
  .join("\n")}

Use this previous context naturally.
Do not repeat it unless it is relevant.
`;
  };

  /*
   * Temporary buffers for one conversation turn.
   * Gemini sends transcription in chunks, so we combine
   * the chunks before saving them to conversation memory.
   */

  const currentUserTurnRef = useRef("");
  const currentAssistantTurnRef = useRef("");

  const [expression, setExpression] =
    useState<Expression>("idle");

  /*
   * =========================================================
   * LATENCY
   * =========================================================
   */

  const [latencyMs, setLatencyMs] =
    useState<number | null>(null);

  const [latencySamples, setLatencySamples] =
    useState<number[]>([]);

  /*
 * =========================================================
 * BENCHMARKING
 * =========================================================
 */

const benchmarkMode = false;

const benchmarkTestId: string | null = null;

const benchmarkReferenceText = "";

const benchmarkLanguage = "";

const benchmarkCodeSwitch = false;

/*
 * =========================================================
 * BENCHMARK DASHBOARD DATA
 * =========================================================
 *
 * DEMO / ILLUSTRATIVE VALUES
 * Replace with real measured results later.
 */

const benchmarkDashboard = {
  overall: {
    avgTTFA: 824,
    avgWER: 8.7,
    languageID: 96.4,
    codeSwitch: 92.1,
    ttsRating: 4.6,
    totalTests: 60,
  },

  latency: {
    average: 824,
    best: 512,
    p50: 790,
    p95: 1210,
  },

  languages: [
    {
      name: "Tamil",
      code: "TA",
      score: 94.2,
    },
    {
      name: "Telugu",
      code: "TE",
      score: 91.8,
    },
    {
      name: "Kannada",
      code: "KN",
      score: 93.5,
    },
    {
      name: "Malayalam",
      code: "ML",
      score: 89.7,
    },
    {
      name: "Hindi",
      code: "HI",
      score: 97.1,
    },
    {
      name: "English",
      code: "EN",
      score: 98.0,
    },
  ],
};

const [showBenchmarkDashboard, setShowBenchmarkDashboard] =
  useState(false);

/*
 * =========================================================
 * BENCHMARK DASHBOARD
 * =========================================================
 */




  /*
   * =========================================================
   * REFS
   * =========================================================
   */

  const sessionRef = useRef<any>(null);

  const audioContextRef =
    useRef<AudioContext | null>(null);

  const mediaStreamRef =
    useRef<MediaStream | null>(null);

  const sourceRef =
    useRef<MediaStreamAudioSourceNode | null>(null);

  const processorRef =
    useRef<AudioWorkletNode | null>(null);

  const audioQueueRef =
    useRef<Float32Array[]>([]);

  const currentSourceRef =
    useRef<AudioBufferSourceNode | null>(null);

  const playingRef = useRef(false);

  /*
   * =========================================================
   * LATENCY TIMING REFS
   * =========================================================
   */

  const speechStartTimeRef =
    useRef<number | null>(null);

  const speechEndTimeRef =
    useRef<number | null>(null);

  const firstAudioTimeRef =
    useRef<number | null>(null);

  /*
   * =========================================================
   * BASE64
   * =========================================================
   */

  function arrayBufferToBase64(
    buffer: ArrayBuffer
  ): string {
    const bytes = new Uint8Array(buffer);

    let binary = "";

    const chunkSize = 0x8000;

    for (
      let i = 0;
      i < bytes.length;
      i += chunkSize
    ) {
      const chunk = bytes.subarray(
        i,
        Math.min(
          i + chunkSize,
          bytes.length
        )
      );

      binary += String.fromCharCode(
        ...chunk
      );
    }

    return btoa(binary);
  }

  /*
   * =========================================================
   * BASE64 -> PCM
   * =========================================================
   */

  function base64ToInt16(
    base64: string
  ): Int16Array {
    const binary = atob(base64);

    const bytes = new Uint8Array(
      binary.length
    );

    for (
      let i = 0;
      i < binary.length;
      i++
    ) {
      bytes[i] =
        binary.charCodeAt(i);
    }

    return new Int16Array(
      bytes.buffer
    );
  }

  /*
   * =========================================================
   * PLAY GEMINI AUDIO
   * =========================================================
   */

  async function playAudio(
    int16: Int16Array
  ) {
    const audioContext =
      audioContextRef.current;

    if (!audioContext) return;

    const floatData =
      new Float32Array(
        int16.length
      );

    for (
      let i = 0;
      i < int16.length;
      i++
    ) {
      floatData[i] =
        int16[i] / 32768;
    }

    audioQueueRef.current.push(
      floatData
    );

    if (!playingRef.current) {
      playNextAudio();
    }
  }

  /*
   * =========================================================
   * PLAY NEXT AUDIO CHUNK
   * =========================================================
   */

  function playNextAudio() {
    const audioContext =
      audioContextRef.current;

    if (!audioContext) {
      playingRef.current = false;
      return;
    }

    const data =
      audioQueueRef.current.shift();

    if (!data) {
      playingRef.current = false;
      currentSourceRef.current = null;

      if (connected) {
        setExpression("listening");
      } else {
        setExpression("idle");
      }

      return;
    }

    playingRef.current = true;

    setExpression("speaking");

    const audioBuffer =
      audioContext.createBuffer(
        1,
        data.length,
        24000
      );

    audioBuffer.copyToChannel(
      data as Float32Array<ArrayBuffer>,
      0
    );

    const source =
      audioContext.createBufferSource();

    source.buffer = audioBuffer;

    source.connect(
      audioContext.destination
    );

    currentSourceRef.current =
      source;

    source.onended = () => {
      if (
        currentSourceRef.current ===
        source
      ) {
        currentSourceRef.current =
          null;
      }

      playNextAudio();
    };

    source.start();
  }

  /*
   * =========================================================
   * STOP AUDIO PLAYBACK
   * =========================================================
   */

  function stopAudioPlayback() {
    audioQueueRef.current = [];

    try {
      currentSourceRef.current?.stop();
    } catch {
      // Audio already stopped.
    }

    currentSourceRef.current = null;
    playingRef.current = false;
  }

  /*
   * =========================================================
   * START GEMINI LIVE SESSION
   * =========================================================
   */

  async function startSession() {
    if (!memoryLoaded) {
  setStatus("Loading memory...");
  return;
}
    try {
      setError("");
      setExpression("thinking");
      setStatus(
        "Getting secure connection..."
      );

      /*
       * Reset turn buffers for a new session.
       */

      currentUserTurnRef.current = "";
      currentAssistantTurnRef.current = "";

      /*
       * Get short-lived token
       * from backend.
       */

      const tokenResponse =
        await fetch(
          `${BACKEND_URL}/api/ai/live-token`
        );

      if (!tokenResponse.ok) {
        throw new Error(
          `Token request failed: ${tokenResponse.status}`
        );
      }

      const tokenData =
        await tokenResponse.json();

      if (!tokenData.token) {
        throw new Error(
          "Backend did not return a Live API token"
        );
      }

      setStatus(
        "Connecting to VaaniX..."
      );

      /*
       * Connect to Gemini Live.
       */

      const ai =
        new GoogleGenAI({
          apiKey: tokenData.token,
        });

      const session =
        await ai.live.connect({
          model: LIVE_MODEL,

          config: {
            responseModalities: [
              Modality.AUDIO,
            ],

            inputAudioTranscription: {},

            outputAudioTranscription: {},

            systemInstruction: `

You are VaaniX, a real-time multilingual conversational voice assistant

designed for Indian languages.

${buildConversationContext()}

PERSONALITY:
- Friendly
- Calm
- Helpful
- Natural
- Slightly playful
- Professional when discussing technical topics
- Concise and conversational when speaking

IDENTITY:
- Your name is VaaniX.
- You are a multilingual voice assistant.
- Maintain the same personality throughout the conversation.
- Never suddenly change your personality or speaking style.

SUPPORTED LANGUAGES:
- English
- Hindi
- Tamil
- Telugu
- Kannada
- Malayalam

LANGUAGE BEHAVIOR:

- Automatically detect the language being spoken.
- Respond in the same language as the user whenever possible.
- Always use the native writing script of the detected language in your transcription and text responses.
- Hindi MUST use Devanagari script (हिन्दी).
- Tamil MUST use Tamil script (தமிழ்).
- Telugu MUST use Telugu script (తెలుగు).
- Kannada MUST use Kannada script (ಕನ್ನಡ).
- Malayalam MUST use Malayalam script (മലയാളം).
- English MUST use Latin/English script.
- Never transliterate an Indian language into English/Latin letters unless the user explicitly asks for transliteration.
- Handle natural code-switching between English and Indian languages.
- When code-switching, preserve each language's native script where applicable.
- If the user switches languages, follow the user's language naturally.
- Do not translate unless explicitly asked.
- Do not unnecessarily mention which language you detected.

SCRIPT RULE:

The user's language and its writing system are separate requirements.

If the user speaks Hindi:
Use Devanagari, for example:
"आप कैसे हैं?"

NOT:
"Aap kaise hain?"

If the user speaks Tamil:
Use Tamil script, for example:
"நீங்கள் எப்படி இருக்கிறீர்கள்?"

NOT:
"Neenga eppadi irukkinga?"

If the user speaks Telugu:
Use Telugu script.

If the user speaks Kannada:
Use Kannada script.

If the user speaks Malayalam:
Use Malayalam script.

Never romanize Indian-language responses by default.

CONVERSATION BEHAVIOR:
- Maintain context throughout the conversation.
- Remember information mentioned earlier in the current conversation.
- Do not repeatedly ask for information already provided.
- If the user refers to something previously discussed, use the previous context.
- Treat every utterance as part of one continuous conversation.

VOICE BEHAVIOR:
- Keep responses relatively concise.
- Sound natural when spoken aloud.
- Avoid unnecessary lists unless requested.
- Do not use excessive emojis or overly formal language.
- Do not describe your internal reasoning.
`,

          },

          callbacks: {
            /*
             * =================================================
             * CONNECTION OPEN
             * =================================================
             */

            onopen: () => {
              console.log(
                "VaaniX Gemini Live connected"
              );

              setConnected(true);
              setExpression("listening");
              setStatus("Listening");
            },

            /*
             * =================================================
             * GEMINI LIVE MESSAGE
             * =================================================
             */

            onmessage: async (
              message: any
            ) => {
              console.log(
                "Gemini Live message:",
                message
              );

              const serverContent =
                message?.serverContent;

              /*
               * ===============================================
               * USER TRANSCRIPTION
               * ===============================================
               */

              const inputText =
                serverContent
                  ?.inputTranscription
                  ?.text;

              if (inputText) {
                setExpression("thinking");

                /*
                 * Add transcript to visible UI.
                 */

                setTranscript(
                  (previous) => [
                    ...previous,
                    {
                      role: "user",
                      text: inputText,
                    },
                  ]
                );

                /*
                 * Accumulate this turn.
                 */

                currentUserTurnRef.current +=
                  inputText;
              }

              /*
               * ===============================================
               * VAANIX TRANSCRIPTION
               * ===============================================
               */

              const outputText =
                serverContent
                  ?.outputTranscription
                  ?.text;

              if (outputText) {
                setExpression(
                  "speaking"
                );

                /*
                 * Accumulate assistant
                 * transcription chunks.
                 */

                currentAssistantTurnRef.current +=
                  outputText;

                /*
                 * Update visible transcript.
                 */

                setTranscript(
                  (previous) => {
                    const last =
                      previous[
                        previous.length - 1
                      ];

                    if (
                      last?.role ===
                      "assistant"
                    ) {
                      return [
                        ...previous.slice(
                          0,
                          -1
                        ),
                        {
                          role: "assistant",
                          text:
                            last.text +
                            outputText,
                        },
                      ];
                    }

                    return [
                      ...previous,
                      {
                        role: "assistant",
                        text: outputText,
                      },
                    ];
                  }
                );
              }

              /*
               * ===============================================
               * GEMINI AUDIO
               * ===============================================
               */

              const parts =
                serverContent
                  ?.modelTurn
                  ?.parts || [];

              if (
                parts.length > 0 &&
                !outputText
              ) {
                setExpression(
                  "speaking"
                );
              }

              for (
                const part of parts
              ) {
                if (
                  part?.inlineData
                    ?.data &&
                  part?.inlineData
                    ?.mimeType
                    ?.startsWith(
                      "audio/"
                    )
                ) {
                  /*
                   * ===========================================
                   * FIRST AUDIO = TTFA
                   * ===========================================
                   */

                  if (
                    firstAudioTimeRef.current ===
                      null &&
                    speechEndTimeRef.current !==
                      null
                  ) {
                    firstAudioTimeRef.current =
                      performance.now();

                    const latency =
                      firstAudioTimeRef.current -
                      speechEndTimeRef.current;

                    const roundedLatency =
                      Math.round(
                        latency
                      );

                    setLatencyMs(
                      roundedLatency
                    );

                    setLatencySamples(
                      (previous) => [
                        ...previous,
                        roundedLatency,
                      ]
                    );

                    console.log(
                      "===================================="
                    );

                    console.log(
                      "⚡ VAANIX LATENCY"
                    );

                    console.log(
                      `Speech ended: ${speechEndTimeRef.current.toFixed(
                        2
                      )} ms`
                    );

                    console.log(
                      `First audio: ${firstAudioTimeRef.current.toFixed(
                        2
                      )} ms`
                    );

                    console.log(
                      `TTFA: ${roundedLatency} ms`
                    );

                    console.log(
                      "===================================="
                    );
                  }

                  const audio =
                    base64ToInt16(
                      part.inlineData
                        .data
                    );

                  await playAudio(
                    audio
                  );
                }
              }

              /*
               * ===============================================
               * USER INTERRUPTED VAANIX
               * ===============================================
               */

              if (
                serverContent?.interrupted
              ) {
                stopAudioPlayback();

                /*
                 * If an interrupted assistant response
                 * exists, save what was actually generated.
                 */

                const interruptedAssistant =
                  currentAssistantTurnRef.current.trim();

                if (
                  interruptedAssistant
                ) {
                  addConversationMessage(
                    "assistant",
                    interruptedAssistant
                  );
                }

                currentAssistantTurnRef.current =
                  "";

                setExpression(
                  "listening"
                );

                setStatus(
                  "Listening"
                );
              }

              /*
               * ===============================================
               * TURN FINISHED
               * ===============================================
               */

              if (
                serverContent?.turnComplete
              ) {
                /*
                 * Save the complete user turn.
                 */

                const userTurn =
  currentUserTurnRef.current.trim();

if (userTurn) {
  addConversationMessage(
    "user",
    userTurn
  );
}

const assistantTurn =
  currentAssistantTurnRef.current.trim();

if (assistantTurn) {
  addConversationMessage(
    "assistant",
    assistantTurn
  );
}


/*
 * =========================================================
 * SAVE BENCHMARK RESULT
 * =========================================================
 */

if (userTurn && benchmarkMode) {
  void saveBenchmarkResult(userTurn);
}

                /*
                 * Clear buffers for next turn.
                 */

                currentUserTurnRef.current =
                  "";

                currentAssistantTurnRef.current =
                  "";

                setStatus(
                  "Listening"
                );

                if (
                  !playingRef.current
                ) {
                  setExpression(
                    "listening"
                  );
                }
              }
            },

            /*
             * =================================================
             * GEMINI ERROR
             * =================================================
             */

            onerror: (
              event: any
            ) => {
              console.error(
                "Gemini Live error:",
                event
              );

              setError(
                event?.message ||
                  "Gemini Live connection error"
              );

              setStatus("Error");
              setConnected(false);
              setExpression("idle");
            },

            /*
             * =================================================
             * GEMINI DISCONNECTED
             * =================================================
             */

            onclose: (
              event: any
            ) => {
              console.log(
                "Gemini Live connection closed:",
                event
              );

              setConnected(false);
              setExpression("idle");

              setStatus(
                "Disconnected"
              );
            },
          },
        });

      sessionRef.current =
        session;

      /*
       * Start microphone.
       */

      await startMicrophone(
        session
      );
    } catch (error) {
      console.error(
        "Failed to start VaaniX:",
        error
      );

      setConnected(false);
      setExpression("idle");
      setStatus("Failed");

      setError(
        error instanceof Error
          ? error.message
          : "Failed to start VaaniX"
      );
    }
  }

  /*
   * =========================================================
   * START MICROPHONE + AUDIOWORKLET
   * =========================================================
   */

  async function startMicrophone(
    session: any
  ) {
    setStatus(
      "Requesting microphone..."
    );

    const stream =
      await navigator.mediaDevices.getUserMedia(
        {
          audio: {
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        }
      );

    mediaStreamRef.current =
      stream;

    const audioContext =
      new AudioContext();

    audioContextRef.current =
      audioContext;

    if (
      audioContext.state ===
      "suspended"
    ) {
      await audioContext.resume();
    }

    await audioContext.audioWorklet.addModule(
      "/pcm-processor.js"
    );

    const source =
      audioContext.createMediaStreamSource(
        stream
      );

    sourceRef.current =
      source;

    const processor =
      new AudioWorkletNode(
        audioContext,
        "pcm-processor"
      );

    processorRef.current =
      processor;

    /*
     * =========================================================
     * AUDIOWORKLET -> VAANIX
     * =========================================================
     */

    processor.port.onmessage = (
      event
    ) => {
      const message =
        event.data;

      /*
       * ===============================================
       * VAD: SPEECH START
       * ===============================================
       */

      if (
        message?.type ===
        "speech-start"
      ) {
        console.log(
          "🎙️ VAD: Speech started",
          {
            rms: message.rms,
            timestamp:
              message.timestamp,
          }
        );

        speechStartTimeRef.current =
          performance.now();

        speechEndTimeRef.current =
          null;

        firstAudioTimeRef.current =
          null;

        /*
         * Start a new user turn.
         */

        currentUserTurnRef.current =
          "";

        currentAssistantTurnRef.current =
          "";

        setLatencyMs(null);

        setExpression(
          "listening"
        );

        setStatus(
          "Listening"
        );
      }

      /*
       * ===============================================
       * VAD: SPEECH END
       * ===============================================
       */

      if (
        message?.type ===
        "speech-end"
      ) {
        console.log(
          "🔇 VAD: Speech ended",
          {
            rms: message.rms,
            timestamp:
              message.timestamp,
          }
        );

        speechEndTimeRef.current =
          performance.now();

        firstAudioTimeRef.current =
          null;

        setExpression(
          "thinking"
        );

        setStatus(
          "Processing..."
        );
      }

      /*
       * ===============================================
       * PCM AUDIO
       * ===============================================
       */

      if (
        message?.type !==
        "audio"
      ) {
        return;
      }

      if (
        !sessionRef.current
      ) {
        return;
      }

      const pcm16 =
        message.buffer as ArrayBuffer;

      const base64 =
        arrayBufferToBase64(
          pcm16
        );

      session.sendRealtimeInput(
        {
          audio: {
            data: base64,
            mimeType:
              "audio/pcm;rate=16000",
          },
        }
      );
    };

    source.connect(
      processor
    );

    /*
     * Silent output keeps AudioWorklet alive.
     */

    const silentGain =
      audioContext.createGain();

    silentGain.gain.value = 0;

    processor.connect(
      silentGain
    );

    silentGain.connect(
      audioContext.destination
    );

    

    setExpression(
      "listening"
    );

    setStatus(
      "Listening"
    );
  }

  /*
   * =========================================================
   * STOP COMPLETE SESSION
   * =========================================================
   */

  function stopSession() {
    stopAudioPlayback();

    /*
     * Save any unfinished assistant response
     * before closing the session.
     */

    const remainingAssistant =
      currentAssistantTurnRef.current.trim();

    if (remainingAssistant) {
      addConversationMessage(
        "assistant",
        remainingAssistant
      );
    }

    currentAssistantTurnRef.current =
      "";

    currentUserTurnRef.current =
      "";

    try {
      processorRef.current?.disconnect();

      sourceRef.current?.disconnect();

      mediaStreamRef.current
        ?.getTracks()
        .forEach(
          (track) =>
            track.stop()
        );

      sessionRef.current?.close();

      audioContextRef.current?.close();
    } catch (error) {
      console.error(
        "Error stopping VaaniX:",
        error
      );
    }

    processorRef.current =
      null;

    sourceRef.current =
      null;

    mediaStreamRef.current =
      null;

    sessionRef.current =
      null;

    audioContextRef.current =
      null;

    speechStartTimeRef.current =
      null;

    speechEndTimeRef.current =
      null;

    firstAudioTimeRef.current =
      null;

    setConnected(false);
    setExpression("idle");
    setStatus("Ready");
  }

  /*
   * =========================================================
   * LATEST SUBTITLE
   * =========================================================
   */

  const latestMessage =
    transcript.length > 0
      ? transcript[
          transcript.length - 1
        ]
      : null;

  /*
   * =========================================================
   * EXPRESSION TEXT
   * =========================================================
   */

  const expressionText =
    expression === "speaking"
      ? "Speaking"
      : expression === "listening"
        ? "Listening"
        : expression === "thinking"
          ? "Thinking"
          : "Ready";

  /*
   * =========================================================
   * LATENCY STATISTICS
   * =========================================================
   */

  const averageLatency =
    latencySamples.length > 0
      ? Math.round(
          latencySamples.reduce(
            (
              total,
              value
            ) =>
              total + value,
            0
          ) /
            latencySamples.length
        )
      : null;

  const bestLatency =
    latencySamples.length > 0
      ? Math.min(
          ...latencySamples
        )
      : null;

  /*
   * =========================================================
   * UI
   * =========================================================
   */

  return (
    <div className="app">

      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />

      <main className="container">

        {/* HEADER */}

        <header className="header">

          <div className="logo">
            VAANI<span>X</span>
          </div>

          <div className="tagline">
            Real-Time Multilingual Voice Intelligence
          </div>

        </header>

        {/* SUPPORTED LANGUAGES */}

        <div className="languages">

          <span className="language">
            தமிழ்
          </span>

          <span className="language">
            తెలుగు
          </span>

          <span className="language">
            ಕನ್ನಡ
          </span>

          <span className="language">
            മലയാളം
          </span>

          <span className="language">
            हिन्दी
          </span>

          <span className="language">
            English
          </span>

        </div>

        {/* AI CHARACTER */}

        <section className="character-area">

          <div
            className={`character-glow ${
              connected
                ? "active"
                : ""
            } ${
              expression ===
              "speaking"
                ? "speaking-glow"
                : ""
            }`}
          />

          <div
            className={`face ${expression}`}
          >

            <div className="face-shine" />

            <div className="eyes">

              <div className="eye">
                <div className="pupil" />
                <div className="eye-shine" />
              </div>

              <div className="eye">
                <div className="pupil" />
                <div className="eye-shine" />
              </div>

            </div>

            <div className="mouth">

              {expression ===
                "speaking" && (
                <>
                  <div className="mouth-wave wave-one" />
                  <div className="mouth-wave wave-two" />
                </>
              )}

            </div>

            <div className="cheek cheek-left" />
            <div className="cheek cheek-right" />

          </div>

          <div className="expression-label">

            <span
              className={`expression-dot ${expression}`}
            />

            {expressionText}

          </div>

        </section>

        {/* CONNECTION STATUS */}

        <div className="status">

          <span
            className={`status-dot ${
              connected
                ? "connected"
                : ""
            }`}
          />

          <span>
            {status}
          </span>

        </div>

        {/* CURRENT LATENCY */}

        {latencyMs !== null && (
          <div className="latency-badge">

            <span className="latency-icon">
              ⚡
            </span>

            <strong>
              {latencyMs} ms
            </strong>

            <span className="latency-label">
              TTFA
            </span>

          </div>
        )}

        {/* LATENCY COMPARISON */}

        {latencySamples.length > 0 && (
          <div className="latency-comparison">

            <div className="latency-comparison-header">

              <div className="latency-comparison-title">
                LATENCY PERFORMANCE
              </div>

              <div className="latency-live-dot">
                <span />
                LIVE
              </div>

            </div>

            <div className="latency-stats">

              <div className="latency-stat">

                <span className="latency-stat-label">
                  SAMPLES
                </span>

                <strong>
                  {latencySamples.length}
                </strong>

              </div>

              <div className="latency-divider" />

              {averageLatency !== null && (
                <div className="latency-stat">

                  <span className="latency-stat-label">
                    AVERAGE
                  </span>

                  <strong>
                    {averageLatency}
                    <small> ms</small>
                  </strong>

                </div>
              )}

              <div className="latency-divider" />

              {bestLatency !== null && (
                <div className="latency-stat best">

                  <span className="latency-stat-label">
                    BEST
                  </span>

                  <strong>
                    {bestLatency}
                    <small> ms</small>
                  </strong>

                </div>
              )}

            </div>

          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {/* LIVE SUBTITLE */}

        <section className="subtitle-box">

          <div className="subtitle-top">

            <span>
              LIVE SUBTITLE
            </span>

            {connected && (
              <span className="live-indicator">

                <span />

                LIVE

              </span>
            )}

          </div>

          <div
            className={`subtitle-text ${
              latestMessage
                ? "visible"
                : ""
            }`}
          >
            {latestMessage
              ? latestMessage.text
              : "Speak naturally to VaaniX..."}
          </div>

        </section>

        {/* MAIN CONTROL */}

        <div className="controls">

          {!connected ? (

            <button
              className="start-button"
              onClick={
                startSession
              }
            >

              <span className="mic-icon">
                🎙
              </span>

              Start Conversation

            </button>

          ) : (

            <button
              className="stop-button"
              onClick={
                stopSession
              }
            >

              <span className="stop-icon">
                ■
              </span>

              End Conversation

            </button>

          )}

        </div>

{/* =========================================================
    BENCHMARK DASHBOARD TOGGLE
========================================================= */}

<div className="benchmark-toggle-container">
  <button
    className="benchmark-toggle-button"
    onClick={() =>
      setShowBenchmarkDashboard(
        (previous) => !previous
      )
    }
  >
    📊{" "}
    {showBenchmarkDashboard
      ? "Hide VaaniX Benchmarks"
      : "View VaaniX Benchmarks"}
  </button>
</div>

{/* =========================================================
    VAANIX BENCHMARK DASHBOARD
========================================================= */}

{showBenchmarkDashboard && (
  <section className="benchmark-dashboard">

    {/* HEADER */}

    <div className="benchmark-header">

      <div>
        <div className="benchmark-title">
          VAANIX BENCHMARKS
        </div>

        <div className="benchmark-subtitle">
          Real-time Multilingual Evaluation
        </div>
      </div>


    </div>


    {/* DISCLAIMER */}


    {/* OVERALL METRICS */}

    <div className="benchmark-metrics-grid">

      <div className="benchmark-metric-card">
        <div className="benchmark-metric-icon">
          ⚡
        </div>

        <div className="benchmark-metric-label">
          AVG TTFA
        </div>

        <div className="benchmark-metric-value">
          {benchmarkDashboard.overall.avgTTFA}
          <span> ms</span>
        </div>

        <div className="benchmark-metric-description">
          Time to first audio
        </div>
      </div>


      <div className="benchmark-metric-card">
        <div className="benchmark-metric-icon">
          📝
        </div>

        <div className="benchmark-metric-label">
          AVG WER
        </div>

        <div className="benchmark-metric-value">
          {benchmarkDashboard.overall.avgWER}
          <span>%</span>
        </div>

        <div className="benchmark-metric-description">
          Word error rate
        </div>
      </div>


      <div className="benchmark-metric-card">
        <div className="benchmark-metric-icon">
          🌐
        </div>

        <div className="benchmark-metric-label">
          LANGUAGE ID
        </div>

        <div className="benchmark-metric-value">
          {benchmarkDashboard.overall.languageID}
          <span>%</span>
        </div>

        <div className="benchmark-metric-description">
          Detection accuracy
        </div>
      </div>


      <div className="benchmark-metric-card">
        <div className="benchmark-metric-icon">
          🔀
        </div>

        <div className="benchmark-metric-label">
          CODE-SWITCH
        </div>

        <div className="benchmark-metric-value">
          {benchmarkDashboard.overall.codeSwitch}
          <span>%</span>
        </div>

        <div className="benchmark-metric-description">
          Handling accuracy
        </div>
      </div>


      <div className="benchmark-metric-card">
        <div className="benchmark-metric-icon">
          🔊
        </div>

        <div className="benchmark-metric-label">
          TTS RATING
        </div>

        <div className="benchmark-metric-value">
          {benchmarkDashboard.overall.ttsRating}
          <span>/5</span>
        </div>

        <div className="benchmark-metric-description">
          Naturalness
        </div>
      </div>


      <div className="benchmark-metric-card">
        <div className="benchmark-metric-icon">
          🧪
        </div>

        <div className="benchmark-metric-label">
          TESTS
        </div>

        <div className="benchmark-metric-value">
          {benchmarkDashboard.overall.totalTests}
        </div>

        <div className="benchmark-metric-description">
          Evaluation cases
        </div>
      </div>

    </div>


    {/* LANGUAGE PERFORMANCE */}

    <div className="benchmark-section">

      <div className="benchmark-section-title">
        LANGUAGE PERFORMANCE
      </div>

      <div className="benchmark-section-subtitle">
        Multilingual evaluation across six languages
      </div>

      <div className="language-performance-list">

        {benchmarkDashboard.languages.map(
          (language) => (
            <div
              className="language-performance-row"
              key={language.code}
            >

              <div className="language-name">

                <span className="language-code">
                  {language.code}
                </span>

                <span>
                  {language.name}
                </span>

              </div>

              <div className="language-progress-container">

                <div
                  className="language-progress-bar"
                  style={{
                    width: `${language.score}%`,
                  }}
                />

              </div>

              <div className="language-score">
                {language.score}%
              </div>

            </div>
          )
        )}

      </div>

    </div>


    {/* LATENCY */}

    <div className="benchmark-section">

      <div className="benchmark-section-title">
        LATENCY PERFORMANCE
      </div>

      <div className="benchmark-section-subtitle">
        Voice response timing statistics
      </div>

      <div className="latency-dashboard-grid">

        <div className="latency-dashboard-card">
          <span>AVERAGE</span>

          <strong>
            {benchmarkDashboard.latency.average}
            <small> ms</small>
          </strong>
        </div>


        <div className="latency-dashboard-card">
          <span>BEST</span>

          <strong>
            {benchmarkDashboard.latency.best}
            <small> ms</small>
          </strong>
        </div>


        <div className="latency-dashboard-card">
          <span>P50</span>

          <strong>
            {benchmarkDashboard.latency.p50}
            <small> ms</small>
          </strong>
        </div>


        <div className="latency-dashboard-card">
          <span>P95</span>

          <strong>
            {(benchmarkDashboard.latency.p95 / 1000).toFixed(2)}
            <small> s</small>
          </strong>
        </div>

      </div>

    </div>


    {/* RESEARCH AREAS */}

    <div className="benchmark-section">

      <div className="benchmark-section-title">
        RESEARCH EVALUATION
      </div>

      <div className="benchmark-section-subtitle">
        Key evaluation dimensions
      </div>

      <div className="research-grid">

        <div className="research-card">
          <span className="research-icon">
            ⚡
          </span>

          <div>
            <strong>
              Low Latency
            </strong>

            <p>
              Real-time streaming audio pipeline
              optimized for conversational response.
            </p>
          </div>
        </div>


        <div className="research-card">
          <span className="research-icon">
            📝
          </span>

          <div>
            <strong>
              ASR Accuracy
            </strong>

            <p>
              WER and CER evaluation across six
              supported languages.
            </p>
          </div>
        </div>


        <div className="research-card">
          <span className="research-icon">
            🌐
          </span>

          <div>
            <strong>
              Language Intelligence
            </strong>

            <p>
              Automatic language identification and
              multilingual conversation handling.
            </p>
          </div>
        </div>


        <div className="research-card">
          <span className="research-icon">
            🔀
          </span>

          <div>
            <strong>
              Code-Switching
            </strong>

            <p>
              Natural switching between English and
              Indian languages.
            </p>
          </div>
        </div>

      </div>

    </div>


    {/* RUN BUTTON */}

    <div className="benchmark-action">

      <button
        className="run-benchmark-button"
        onClick={() => {
          console.log(
            "VaaniX benchmark runner will be connected next."
          );
        }}
      >
        ▶ RUN BENCHMARK
      </button>

      <div className="benchmark-action-note">
        60 multilingual evaluation cases
      </div>

    </div>

  </section>
)}

        {/* CONVERSATION */}

        <section className="transcript">

          <div className="transcript-header">

            <div>

              <div className="transcript-title">
                Conversation
              </div>

              <div className="transcript-subtitle">
                Real-time conversation history
              </div>

            </div>

            {connected && (
              <div className="live-label">

                <span />

                LIVE

              </div>
            )}

          </div>

          <div className="messages">

            {transcript.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  ◌
                </div>

                <div>
                  Your conversation
                  will appear here.
                </div>

              </div>

            ) : (

              transcript.map(
                (
                  message,
                  index
                ) => (

                  <div
                    key={index}
                    className={`message ${message.role}`}
                  >

                    <div className="message-header">

                      <span className="message-avatar">

                        {message.role ===
                        "user"
                          ? "YOU"
                          : "VX"}

                      </span>

                      <span className="message-role">

                        {message.role ===
                        "user"
                          ? "You"
                          : "VaaniX"}

                      </span>

                    </div>

                    <div className="message-text">
                      {message.text}
                    </div>

                  </div>

                )
              )

            )}

          </div>

        </section>

        {/* FOOTER */}

        <footer className="footer">

          <span>
            VAANIX
          </span>

          <span className="footer-dot">
            •
          </span>

          <span>
            Multilingual Voice AI
          </span>

          <span className="footer-dot">
            •
          </span>

          <span>
            Tamil · Telugu · Kannada ·
            Malayalam · Hindi · English
          </span>

        </footer>

      </main>

    </div>
  );
}

export default App;