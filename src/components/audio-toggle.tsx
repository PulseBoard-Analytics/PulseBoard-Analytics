"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function AudioToggle() {
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.15;

    // Show button after short delay
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  // Handle audio ending / errors
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("play", onPlay);
    return () => {
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("play", onPlay);
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setHasInteracted(true);

    if (playing) {
      audio.pause();
    } else {
      try {
        audio.currentTime = 0;
        await audio.play();
      } catch (e) {
        console.warn("Audio playback failed:", e);
      }
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        loop
        src="/music/ambient.mp3"
        preload="auto"
      />

      <button
        onClick={toggle}
        className={`
          fixed bottom-6 right-6 z-50
          flex items-center justify-center
          w-12 h-12 rounded-full
          bg-white/80 dark:bg-zinc-900/80
          backdrop-blur-xl
          border border-black/10 dark:border-white/10
          shadow-2xl shadow-black/10 dark:shadow-black/40
          hover:border-primary/50
          hover:scale-110
          active:scale-95
          transition-all duration-200
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
        aria-label={playing ? "Pause music" : "Play ambient music"}
        title={playing ? "Pause ambient music" : "Play ambient music"}
      >
        {/* Pulsing ring when playing */}
        {playing && (
          <>
            <span className="absolute inset-0 rounded-full border-2 border-primary/40 animate-ping" />
            <span className="absolute inset-[-4px] rounded-full border border-primary/20 animate-pulse" />
          </>
        )}

        {playing ? (
          <Volume2 className="w-5 h-5 text-primary relative z-10" />
        ) : (
          <VolumeX className="w-5 h-5 text-foreground/40 relative z-10" />
        )}
      </button>

      {/* No tooltip — just the icon */}
    </>
  );
}
