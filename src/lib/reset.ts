/**
 * Account/session reset for the quiz app and its NAVI/QuizLab data.
 *
 * Only keys owned by this app are cleared: the known persistent keys plus any
 * key that lives under this app's own namespaces (`quizlab.`/`navi_`). Foreign
 * sites' localStorage keys are never touched.
 */

const LOCAL_STORAGE_KEYS = [
  'onboardingCompleted',
  'selectedLanguage',
  'selectedTheme',
  'motionEnabled',
  'selectedAccentColor',
  'quizlab_intro_seen',
  'quizlab.sound.enabled',
  'quizlab.music.enabled',
  'quizlab.haptics.enabled',
]

const SESSION_STORAGE_KEYS = ['navi_session_v1']

function removeAll(storage: Storage, keys: string[]) {
  const known = new Set(keys)
  // Sweep namespaced keys this app may create in the future.
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i)
    if (key && (key.startsWith('quizlab.') || key.startsWith('navi_'))) known.add(key)
  }
  known.forEach((key) => storage.removeItem(key))
}

/** Clears every QuizLab/NAVI persistent key from localStorage + sessionStorage. */
export function clearQuizLabData() {
  try {
    removeAll(window.localStorage, LOCAL_STORAGE_KEYS)
  } catch {
    /* private mode / unavailable */
  }
  try {
    removeAll(window.sessionStorage, SESSION_STORAGE_KEYS)
  } catch {
    /* private mode / unavailable */
  }
}