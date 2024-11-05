import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { get, getDatabase, query, ref, serverTimestamp, set } from "firebase/database"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const rtdb = getDatabase(app);
const storage = getStorage(app);


export function focusTo(id: string) {
    try {
        document.getElementById(id)?.focus()
    } catch { }
}


export async function getServerTimeZone() {
    const dbtsref = ref(rtdb, "/Metrics/timestamp");
    await set(dbtsref, serverTimestamp());
    const r = (await (get(query(dbtsref)))).val();
    return r;
};

export { app, db, auth, rtdb, storage };
