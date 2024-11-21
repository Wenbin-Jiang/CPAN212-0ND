import { createContext, useContext, useState } from "react";

// Create UserContext
const UserContext = createContext();

// Custom hook to use UserContext
export const useUser = () => {
  return useContext(UserContext);
};

// UserProvider component to wrap the app and provide context
export default function UserProvider({ children }) {
  const [user, setUser] = useState(null); // This will store the user object
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const [profileComplete, setProfileComplete] = useState(false); // Track profile completion

  const login = (token, userData) => {
    setAuthToken(token);
    setUser(userData);
    setProfileComplete(userData.profileComplete);
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setProfileComplete(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider
      value={{ user, authToken, profileComplete, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}
