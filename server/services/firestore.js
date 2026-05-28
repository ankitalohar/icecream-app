import process from 'node:process'

let firestorePromise
let adminPromise

async function getFirebaseAdmin() {
  const configured = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    || process.env.GOOGLE_APPLICATION_CREDENTIALS
    || process.env.FIREBASE_USE_APPLICATION_DEFAULT === 'true'
  if (!configured) {
    return null
  }

  if (!adminPromise) {
    adminPromise = import('firebase-admin').then(({ default: admin }) => {
      if (!admin.apps.length) {
        const options = process.env.FIREBASE_PROJECT_ID ? { projectId: process.env.FIREBASE_PROJECT_ID } : {}
        if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
          options.credential = admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON))
        } else {
          options.credential = admin.credential.applicationDefault()
        }
        admin.initializeApp(options)
      }
      return admin
    })
  }
  return adminPromise
}

async function getFirestore() {
  if (!firestorePromise) {
    firestorePromise = getFirebaseAdmin().then((admin) => admin?.firestore() || null)
  }
  return firestorePromise
}

function documentData(value) {
  const raw = value?.toObject ? value.toObject({ depopulate: true }) : { ...value }
  const data = JSON.parse(JSON.stringify(raw))
  delete data._id
  delete data.__v
  delete data.passwordHash
  if ('loginStatus' in data) data.active = Boolean(data.loginStatus)
  if ('lastLoginAt' in data) data.loginTimestamp = data.lastLoginAt
  return data
}

async function write(collection, id, value) {
  try {
    const database = await getFirestore()
    if (!database) return
    await database.collection(collection).doc(String(id)).set(documentData(value), { merge: true })
  } catch (error) {
    console.error(`Firestore ${collection} sync failed:`, error.message)
  }
}

export async function deleteFirestoreDocument(collection, id) {
  try {
    const database = await getFirestore()
    if (!database) return
    await database.collection(collection).doc(String(id)).delete()
  } catch (error) {
    console.error(`Firestore ${collection} delete failed:`, error.message)
  }
}

export function syncAccount(account) {
  const collection = account.role === 'admin' ? 'admins' : 'users'
  return write(collection, account._id, account)
}

export function syncCart(cart) {
  return write('carts', cart.user, cart)
}

export function syncOrder(order) {
  return write('orders', order.orderId, order)
}

export function syncContact(contact) {
  return write('contacts', contact._id, contact)
}

export function syncSession(id, session) {
  return write('sessions', id, session)
}

export function syncAdminActivity(id, activity) {
  return write('adminActivity', id, activity)
}

export async function createFirebaseAuthToken(account) {
  try {
    const admin = await getFirebaseAdmin()
    if (!admin) return null
    return admin.auth().createCustomToken(String(account._id), { role: account.role })
  } catch (error) {
    console.error('Firebase authentication token creation failed:', error.message)
    return null
  }
}
