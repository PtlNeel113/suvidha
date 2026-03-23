import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  userName: string;
  aadhaar: string;
  needsOnboarding: boolean;
  loginCitizen: (aadhaar: string, name?: string) => void;
  loginCitizenWithOnboarding: (aadhaar: string) => void;
  loginAdmin: () => void;
  logout: () => void;
  updateUserName: (name: string) => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isAdmin: false,
  userName: "",
  aadhaar: "",
  needsOnboarding: false,
  loginCitizen: () => {},
  loginCitizenWithOnboarding: () => {},
  loginAdmin: () => {},
  logout: () => {},
  updateUserName: () => {},
  completeOnboarding: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  const loginCitizen = useCallback((aadhaarNum: string, name?: string) => {
    setIsLoggedIn(true);
    setIsAdmin(false);
    setAadhaar(aadhaarNum);
    setUserName(name || "Citizen");
    setNeedsOnboarding(false);
  }, []);

  const loginCitizenWithOnboarding = useCallback((aadhaarNum: string) => {
    setIsLoggedIn(true);
    setIsAdmin(false);
    setAadhaar(aadhaarNum);
    setUserName("Citizen");
    setNeedsOnboarding(true);
  }, []);

  const loginAdmin = useCallback(() => {
    setIsLoggedIn(true);
    setIsAdmin(true);
    setUserName("Admin");
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserName("");
    setAadhaar("");
    setNeedsOnboarding(false);
  }, []);

  const updateUserName = useCallback((name: string) => {
    setUserName(name);
  }, []);

  const completeOnboarding = useCallback(() => {
    setNeedsOnboarding(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, userName, aadhaar, needsOnboarding, loginCitizen, loginCitizenWithOnboarding, loginAdmin, logout, updateUserName, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
