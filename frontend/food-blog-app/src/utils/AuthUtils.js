// Simple utility functions - NO context, NO event listeners
export const getUser = () => {
  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
};

export const getToken = () => localStorage.getItem("token");

export const isLoggedIn = () => !!getToken();

export const login = (userData, token) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(userData));
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/";
};
