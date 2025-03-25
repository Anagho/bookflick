import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {API_URL} from "../constants/api";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isCheckingAuth: true,

  //   Register function
  register: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      // store the user using Async Storage
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      await AsyncStorage.setItem("token", data.token);

      // update the state
      set({ token: data.token, user: data.user });

      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Login function
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      // store the user using Async Storage
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      await AsyncStorage.setItem("token", data.token);

      // update the state
      set({ token: data.token, user: data.user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.log("Login failed", error);
      return { success: false, error: error.message };
    }
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;

      set({ token, user });
    } catch (error) {
      console.log("Auth check failed", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    set({ token: null, user: null });
  },
}));
