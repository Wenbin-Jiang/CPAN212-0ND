import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();
const baseURL = "http://localhost:8001";

export const UserProvider = ({ children }) => {
  const [profileComplete, setProfileComplete] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUserProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const response = await axios.get(`${baseURL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Ensure we're setting both user data and profile completion status
        const user = response.data.data;
        setUserData(user);
        setProfileComplete(!!user.profileComplete); // Convert to boolean explicitly
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Clear data on error
        setUserData(null);
        setProfileComplete(false);
        localStorage.removeItem("authToken");
      }
    } else {
      // Clear data if no token exists
      setUserData(null);
      setProfileComplete(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkUserProfile();
  }, []);

  const setUser = async (data) => {
    try {
      setUserData(data);
      setProfileComplete(!!data.profileComplete); // Convert to boolean explicitly

      // If this is a profile completion update, verify the profile status
      if (data.profileComplete) {
        const token = localStorage.getItem("authToken");
        if (token) {
          const response = await axios.get(`${baseURL}/api/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const user = response.data.data;
          setUserData(user);
          setProfileComplete(!!user.profileComplete);
        }
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

  // Add a refresh function that can be called when needed
  const refreshUserProfile = async () => {
    setLoading(true);
    await checkUserProfile();
  };

  return (
    <UserContext.Provider
      value={{
        profileComplete,
        userData,
        setUser,
        logout,
        loading,
        refreshUserProfile, // Export the refresh function
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
