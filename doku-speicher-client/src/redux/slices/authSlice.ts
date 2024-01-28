import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import {
  register,
  login,
} from "../../features/authentication/services/authService";
import {
  AuthResponse,
  RegistrationData,
  RegistrationResponse,
  UserCredentials,
} from "../../features/authentication";

// User model
export type User = {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
};

// User state
export type AuthState = {
  user: User | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
};

const getErrorMessage = (error: unknown): string => {
  const axiosError = error as AxiosError<{ message?: string; error?: string }>;
  if (axiosError.response) {
    return (
      axiosError.response.data.message ||
      axiosError.response.data.error ||
      axiosError.response.statusText
    );
  } else if (axiosError.request) {
    return "No response received from the server.";
  } else {
    return axiosError.message || "An unknown error occurred.";
  }
};

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: RegistrationData, thunkAPI) => {
    try {
      const response = await register(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: UserCredentials, thunkAPI) => {
    try {
      const response = await login(credentials);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload as RegistrationResponse;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload as AuthResponse;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
