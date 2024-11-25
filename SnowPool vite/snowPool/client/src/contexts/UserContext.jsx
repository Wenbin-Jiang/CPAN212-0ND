import { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profileComplete, setProfileComplete] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUserProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setUserData(null);
      setProfileComplete(false);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/users/profile");
      const user = response.data.data;
      setUserData(user);
      setProfileComplete(!!user.profileComplete);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserData(null);
      setProfileComplete(false);
      localStorage.removeItem("authToken");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserProfile();
  }, []);

  const setUser = async (data) => {
    try {
      setUserData(data);
      setProfileComplete(!!data.profileComplete);

      // Verify profile status if profile is complete
      if (data.profileComplete) {
        const response = await api.get("/users/profile");
        const user = response.data.data;
        setUserData(user);
        setProfileComplete(!!user.profileComplete);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUserData(null);
    setProfileComplete(false);
  };

  const refreshUserProfile = async () => {
    setLoading(true);
    await checkUserProfile();
  };

  const value = {
    profileComplete,
    userData,
    setUser,
    logout,
    loading,
    refreshUserProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
