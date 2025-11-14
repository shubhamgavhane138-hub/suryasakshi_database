import React, { createContext, useState, ReactNode, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Hardcoded user credentials
const users = {
    'SHUBHAM': 'SHUBHAM@14',
    'ABHISHEK': 'ABHI@37',
    'PRASHANT': 'PRASHANT@83',
    'OM': 'OM@66',
    'RAMESHWAR': 'RAMESHWAR@88'
};

type User = keyof typeof users;

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (username: string, pass: string) => boolean;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('suryasakshi_user');
        // Check if the stored user is a valid user
        if (storedUser && Object.keys(users).includes(storedUser)) {
            return storedUser as User;
        }
        return null;
    });

    const navigate = useNavigate();

    const login = (username: string, pass: string): boolean => {
        const upperCaseUsername = username.toUpperCase() as User;
        if (users[upperCaseUsername] && users[upperCaseUsername] === pass) {
            setUser(upperCaseUsername);
            localStorage.setItem('suryasakshi_user', upperCaseUsername);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('suryasakshi_user');
        navigate('/login', { replace: true });
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
