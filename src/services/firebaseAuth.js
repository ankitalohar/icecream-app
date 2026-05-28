const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

function firebaseConfigured() {
  return firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId
}

async function firebaseApplication() {
  if (!firebaseConfigured()) return null
  const { getApp, getApps, initializeApp } = await import('firebase/app')
  return getApps().length ? getApp() : initializeApp(firebaseConfig)
}

async function authentication() {
  const app = await firebaseApplication()
  if (!app) return null
  const { getAuth, signInWithCustomToken, signOut } = await import('firebase/auth')
  return { auth: getAuth(app), signInWithCustomToken, signOut }
}

export async function startFirebaseSession(customToken) {
  if (!customToken) return
  const session = await authentication()
  if (session) await session.signInWithCustomToken(session.auth, customToken)
}

export async function endFirebaseSession() {
  const session = await authentication()
  if (session?.auth.currentUser) await session.signOut(session.auth)
}

export async function watchAdminOrders(onChange) {
  const app = await firebaseApplication()
  if (!app) return () => {}
  const { collection, getFirestore, onSnapshot } = await import('firebase/firestore')
  return onSnapshot(collection(getFirestore(app), 'orders'), onChange, (error) => {
    console.warn('Firestore live order updates unavailable:', error.message)
  })
}

export async function watchContactMessages(onChange) {
  const app = await firebaseApplication()
  if (!app) return () => {}
  const { collection, getFirestore, onSnapshot } = await import('firebase/firestore')
  return onSnapshot(collection(getFirestore(app), 'contacts'), onChange, (error) => {
    console.warn('Firestore live contact updates unavailable:', error.message)
  })
}
