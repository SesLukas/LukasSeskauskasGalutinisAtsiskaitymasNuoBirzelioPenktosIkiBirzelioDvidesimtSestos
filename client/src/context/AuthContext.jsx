import { createContext, useReducer, useEffect } from "react";
import { fetchWithToken } from "../utils/fetchtwithoken.js";

export const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      return {
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        user: null,
        token: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const checkUser = async () => {
      if (!state.token) return;
      try {
        const res = await fetchWithToken("http://localhost:5500/me");
        if (res.ok) {
          const data = await res.json();
          dispatch({ type: "LOGIN", payload: { user: data.username, token: state.token } });
        } else {
          dispatch({ type: "LOGOUT" });
        }
      } catch (err) {
        console.error("Autentifikacijos klaida:", err);
        dispatch({ type: "LOGOUT" });
      }
    };
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
