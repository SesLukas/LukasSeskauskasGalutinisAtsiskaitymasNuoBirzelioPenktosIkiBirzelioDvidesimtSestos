export const fetchWithToken = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const authHeaders = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const mergedOptions = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...(options.headers || {})
    }
  };

  return fetch(url, mergedOptions);
};
