// Web Audio API ambient resonance generator (completely offline, calm, solemn harmonic drone)
let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isPlaying = false;
let oscillators: OscillatorNode[] = [];

export function toggleAmbientSound(onStateChange?: (playing: boolean) => void): boolean {
  if (isPlaying) {
    stopAmbientSound();
    if (onStateChange) onStateChange(false);
    return false;
  } else {
    startAmbientSound();
    if (onStateChange) onStateChange(true);
    return true;
  }
}

export function isAmbientPlaying(): boolean {
  return isPlaying;
}

export function startAmbientSound(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Master gain
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.06, audioCtx.currentTime + 3);

    // Warm low-pass filter
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, audioCtx.currentTime);

    masterGain.connect(filter);
    filter.connect(audioCtx.destination);

    // Harmonic warm frequencies (D minor / F major peaceful contemplative chord)
    // D2 (73.42Hz), A2 (110.00Hz), D3 (146.83Hz), F3 (174.61Hz)
    const baseFreqs = [73.42, 110.0, 146.83, 174.61];

    oscillators = baseFreqs.map((freq, idx) => {
      const osc = audioCtx!.createOscillator();
      const oscGain = audioCtx!.createGain();
      
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx!.currentTime);

      // Subtle slow detune modulation
      osc.detune.setValueAtTime((idx - 1.5) * 3, audioCtx!.currentTime);

      const gainVal = idx === 0 ? 0.4 : idx === 1 ? 0.3 : 0.15;
      oscGain.gain.setValueAtTime(gainVal, audioCtx!.currentTime);

      osc.connect(oscGain);
      oscGain.connect(masterGain!);
      osc.start();
      return osc;
    });

    isPlaying = true;
  } catch {
    isPlaying = false;
  }
}

export function stopAmbientSound(): void {
  if (!audioCtx || !masterGain) {
    isPlaying = false;
    return;
  }

  try {
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

    setTimeout(() => {
      oscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      oscillators = [];
      isPlaying = false;
    }, 1300);
  } catch {
    isPlaying = false;
  }
}
