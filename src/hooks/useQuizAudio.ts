import { useSyncExternalStore } from 'react'
import {
  getAudioSnapshot,
  subscribeAudio,
  setSoundEnabled,
  setMusicEnabled,
  startBackgroundMusic,
  stopBackgroundMusic,
  playAnswerSound,
} from '../lib/audio'

// Reactive wrapper around the global QuizLab audio service (sound + music
// toggles). All mutations persist to localStorage via the service itself.
export function useQuizAudio() {
  const state = useSyncExternalStore(subscribeAudio, getAudioSnapshot)

  return {
    soundEnabled: state.soundEnabled,
    musicEnabled: state.musicEnabled,
    setSoundEnabled,
    setMusicEnabled,
    startBackgroundMusic,
    stopBackgroundMusic,
    playAnswerSound,
  }
}