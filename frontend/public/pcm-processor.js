class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this.inputBuffer = [];

    this.inputSampleRate = sampleRate;
    this.targetSampleRate = 16000;

    /*
     * VAD configuration
     */

    // RMS threshold for detecting speech.
    // Lower = more sensitive.
    this.speechThreshold = 0.015;

    // Number of consecutive speech frames
    // required before declaring speech started.
    this.speechStartFrames = 3;

    // Number of consecutive silent frames
    // required before declaring speech ended.
    this.speechEndFrames = 18;

    this.speechFrames = 0;
    this.silenceFrames = 0;

    this.isSpeaking = false;

    /*
     * Keep a small amount of audio before
     * speech detection triggers.
     *
     * This helps avoid cutting off the first
     * syllable of a word.
     */
    this.preRoll = [];

    this.maxPreRollSamples =
      Math.floor(this.targetSampleRate * 0.25);

    /*
     * Audio output buffer.
     */
    this.outputSamples = [];
  }

  calculateRMS(samples) {
    if (!samples.length) {
      return 0;
    }

    let sum = 0;

    for (let i = 0; i < samples.length; i++) {
      sum += samples[i] * samples[i];
    }

    return Math.sqrt(
      sum / samples.length
    );
  }

  sendVADEvent(type, rms) {
    this.port.postMessage({
      type,
      rms,
      timestamp: currentTime,
    });
  }

  process(inputs) {
    const input = inputs[0];

    if (!input || !input[0]) {
      return true;
    }

    const channel = input[0];

    /*
     * Calculate volume / RMS.
     */
    const rms = this.calculateRMS(channel);

    const speechDetected =
      rms >= this.speechThreshold;

    /*
     * Store samples.
     */
    for (let i = 0; i < channel.length; i++) {
      this.inputBuffer.push(channel[i]);
    }

    /*
     * Keep pre-roll audio.
     */
    for (let i = 0; i < channel.length; i++) {
      this.preRoll.push(channel[i]);
    }

    if (
      this.preRoll.length >
      this.maxPreRollSamples
    ) {
      this.preRoll.splice(
        0,
        this.preRoll.length -
          this.maxPreRollSamples
      );
    }

    /*
     * VAD STATE MACHINE
     */

    if (speechDetected) {
      this.speechFrames++;
      this.silenceFrames = 0;

      /*
       * Speech has started.
       */
      if (
        !this.isSpeaking &&
        this.speechFrames >=
          this.speechStartFrames
      ) {
        this.isSpeaking = true;

        this.sendVADEvent(
          "speech-start",
          rms
        );
      }
    } else {
      this.silenceFrames++;
      this.speechFrames = 0;

      /*
       * Speech has ended.
       *
       * We deliberately wait for several
       * silent frames so small pauses inside
       * sentences don't terminate the turn.
       */
      if (
        this.isSpeaking &&
        this.silenceFrames >=
          this.speechEndFrames
      ) {
        this.isSpeaking = false;

        this.sendVADEvent(
          "speech-end",
          rms
        );
      }
    }

    /*
     * Resample audio to 16 kHz.
     */
    const ratio =
      this.inputSampleRate /
      this.targetSampleRate;

    const requiredSamples =
      Math.ceil(1600 * ratio);

    while (
      this.inputBuffer.length >=
      requiredSamples
    ) {
      const output =
        new Int16Array(1600);

      for (
        let i = 0;
        i < 1600;
        i++
      ) {
        const position =
          Math.floor(i * ratio);

        const sample =
          Math.max(
            -1,
            Math.min(
              1,
              this.inputBuffer[
                position
              ]
            )
          );

        output[i] =
          sample < 0
            ? sample * 0x8000
            : sample * 0x7fff;
      }

      /*
       * Send PCM audio to main thread.
       */
      this.port.postMessage(
        {
          type: "audio",
          buffer: output.buffer,
        },
        [output.buffer]
      );

      this.inputBuffer.splice(
        0,
        requiredSamples
      );
    }

    return true;
  }
}

registerProcessor(
  "pcm-processor",
  PCMProcessor
);