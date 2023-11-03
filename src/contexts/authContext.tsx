import { NextOrObserver, User, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { createContext, useState, useEffect, ReactNode } from "react";
import { auth } from "../configs/firebase";

interface Props {
  children?: ReactNode
}

export const AuthContext = createContext({
  currentUser: {} as User | null,
  setCurrentUser: (user: User) => {},
  signOut: () => {}
});

const SignOutUser = async () => await signOut(auth);

const userStateListener = (callback:NextOrObserver<User>) => {
    return onAuthStateChanged(auth, callback)
  }

export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = userStateListener((user) => {
      if (user) {
        setCurrentUser(user)
      }
    });
    return unsubscribe
  }, [setCurrentUser]);

  const signOut = () => {
    SignOutUser()
    setCurrentUser(null)
    navigate('/')
  }

  const value = {
    currentUser, 
    setCurrentUser,
    signOut
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
