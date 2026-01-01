import { initializeApp, getApps, getApp } from 'firebase/app';
import {
    getAuth,
    initializeAuth,
    getReactNativePersistence,
    signInWithCredential,
    GoogleAuthProvider,
    GithubAuthProvider,
    onAuthStateChanged,
    User,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    updateProfile
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from 'firebase/firestore';

// TODO: Replace with actual config or environment variables
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

let app;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const firestore = getFirestore(app);

export const AuthService = {
    auth,
    firestore,

    getCurrentUser: () => auth.currentUser,

    onAuthStateChanged: (callback: (user: User | null) => void) => {
        return onAuthStateChanged(auth, callback);
    },

    signInWithEmail: async (email: string, password: string) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Ensure user document exists
        if (userCredential.user) {
            await AuthService.createUserAccount(userCredential.user);
        }
        return userCredential;
    },

    registerWithEmail: async (email: string, password: string, firstName: string, lastName: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (userCredential.user) {
            const displayName = `${firstName} ${lastName}`;
            await updateProfile(userCredential.user, { displayName });
            await AuthService.createUserAccount(userCredential.user, firstName, lastName);
        }
        return userCredential;
    },

    // Note: Google/GitHub sign-in in React Native usually requires additional libraries (e.g. expo-auth-session)
    // For now, we will stub these or assume web compatibility if using Firebase JS SDK on web, 
    // but for mobile, you typically need platform-specific credential handling.
    signInWithGoogle: async () => {
        // Placeholder for actual implementation which often involves:
        // 1. GoogleSignin.signIn() (react-native-google-signin)
        // 2. GoogleAuthProvider.credential(idToken)
        // 3. signInWithCredential(auth, credential)
        console.warn("Google Sign-In requires platform specific setup (expo-auth-session or react-native-google-signin)");
        throw new Error("Google Sign-In not implemented yet");
    },

    signInWithGithub: async () => {
        console.warn("GitHub Sign-In requires platform specific setup");
        throw new Error("GitHub Sign-In not implemented yet");
    },

    signOut: async () => {
        await firebaseSignOut(auth);
    },

    createUserAccount: async (user: User, firstName?: string, lastName?: string) => {
        try {
            const userRef = doc(firestore, 'users', user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                return userSnap.data();
            }

            let fName = firstName || '';
            let lName = lastName || '';

            if (!fName && user.displayName) {
                const parts = user.displayName.split(' ');
                fName = parts[0];
                lName = parts.slice(1).join(' ') || '';
            }

            const userData = {
                uid: user.uid,
                firstName: fName,
                lastName: lName,
                email: user.email,
                photoURL: user.photoURL,
                createdAt: serverTimestamp(),
                lastSignIn: serverTimestamp(),
            };

            await setDoc(userRef, userData, { merge: true });
            return userData;
        } catch (error) {
            console.error("Error creating user account", error);
            throw error;
        }
    },

    getUserData: async (uid: string) => {
        try {
            const userRef = doc(firestore, 'users', uid);
            const userSnap = await getDoc(userRef);
            return userSnap.exists() ? userSnap.data() : null;
        } catch (error) {
            console.error("Error getting user data", error);
            return null;
        }
    }
};
