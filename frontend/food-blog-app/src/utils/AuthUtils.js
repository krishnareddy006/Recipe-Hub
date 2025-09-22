// Simple utility functions - NO context, NO event listeners
export const getUser = () => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    localStorage.removeItem("user");
    return null;
  }
};

export const getToken = () => localStorage.getItem("token");

export const isLoggedIn = () => {
  const token = getToken();
  const user = getUser();
  return !!(token && user);
};

export const login = (userData, token) => {
  try {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

export const logout = () => {
  try {
    localStorage.clear();
    // ✅ Small delay to ensure localStorage is cleared
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  } catch (error) {
    console.error("Error during logout:", error);
    window.location.href = "/";
  }
};
