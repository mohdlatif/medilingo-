import React from "react";

interface VoiceOptions {
  rate?: number;
  pitch?: number;
  languageCode?: string;
  languageName?: string;
}

let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentText: string | null = null;

export const speakText = (text: string, options: VoiceOptions = {}) => {
  const {
    rate = 0.9,
    pitch = 1,
    languageCode = "en-US",
    languageName = "English",
  } = options;

  if (!("speechSynthesis" in window)) {
    console.warn("Speech synthesis not supported in this browser");
    return;
  }

  // If the same text is playing, stop it
  if (currentText === text && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    currentText = null;
    currentUtterance = null;
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  currentText = text;
  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.rate = rate;
  currentUtterance.pitch = pitch;

  try {
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((voice) =>
      voice.lang.startsWith(languageCode)
    );

    if (preferredVoice) {
      currentUtterance.voice = preferredVoice;
      currentUtterance.lang = preferredVoice.lang;
    } else {
      const englishVoice = voices.find((voice) => voice.lang.startsWith("en"));
      if (englishVoice) {
        currentUtterance.voice = englishVoice;
        currentUtterance.lang = "en-US";
      }
      console.warn(
        `Voice not available for ${languageName}, falling back to English`
      );
    }
  } catch (error) {
    console.error("Error setting voice language:", error);
    currentUtterance.lang = "en-US";
  }

  window.speechSynthesis.speak(currentUtterance);
};

// Optional: Hook for handling voice loading
export const useVoices = () => {
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);

  React.useEffect(() => {
    // Load voices initially
    setVoices(window.speechSynthesis.getVoices());

    // Handle async voice loading
    window.speechSynthesis.onvoiceschanged = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
  }, []);

  return voices;
};

export const stopSpeaking = () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};

export const isSpeaking = () => {
  return "speechSynthesis" in window && window.speechSynthesis.speaking;
};
