import { useSyncExternalStore } from 'react'
import {
  getHapticsSnapshot,
  subscribeHaptics,
  setHapticsEnabled,
  triggerHaptic,
} from '../lib/haptics'

// Reactive wrapper around the Vibratsiya setting. The toggle persists to
// localStorage; trigger() fires one short vibration on touch devices.
export function useHaptics() {
  const state = useSyncExternalStore(subscribeHaptics, getHapticsSnapshot)

  return {
    hapticsEnabled: state.hapticsEnabled,
    setHapticsEnabled,
    trigger: triggerHaptic,
  }
}