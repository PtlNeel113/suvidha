import React, { createContext, useContext, useState, useEffect } from "react";

type UserProfile = {
    name: string;
    phoneNumber: string;
    aadhaar: string;
    isLoggedIn: boolean;
};

type UserContextType = {
    user: UserProfile | null;
    login: (data: Omit<UserProfile, "isLoggedIn">) => void;
    logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        // Check local storage for existing session
        const savedUser = localStorage.getItem("suvidha_user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (data: Omit<UserProfile, "isLoggedIn">) => {
        const newUser = { ...data, isLoggedIn: true };
        setUser(newUser);
        localStorage.setItem("suvidha_user", JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("suvidha_user");
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
