import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import {
  createMasterProfile,
  getMasterProfile,
  createSalon,
  joinSalon,
} from "../services/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [masterProfile, setMasterProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const profile = await getMasterProfile(firebaseUser.uid);
        setMasterProfile(profile);
      } else {
        setMasterProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function register({ email, password, fullName, specialization, inviteCode }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await createMasterProfile(cred.user.uid, { email, fullName, specialization });

    if (inviteCode && inviteCode.trim()) {
      await joinSalon(cred.user.uid, inviteCode.trim());
    }

    const profile = await getMasterProfile(cred.user.uid);
    setMasterProfile(profile);
    return cred.user;
  }

  async function registerSalonOwner({ email, password, fullName, salonName }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await createMasterProfile(cred.user.uid, { email, fullName, specialization: null });
    const { inviteCode } = await createSalon(cred.user.uid, salonName);
    const profile = await getMasterProfile(cred.user.uid);
    setMasterProfile(profile);
    return { user: cred.user, inviteCode };
  }

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  }

  async function logout() {
    await signOut(auth);
  }

  const value = {
    user,
    masterProfile,
    loading,
    register,
    registerSalonOwner,
    login,
    logout,
    setMasterProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
