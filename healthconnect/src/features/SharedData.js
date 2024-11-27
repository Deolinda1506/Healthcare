import { createSlice } from "@reduxjs/toolkit";

// Default values for shared host
const initialState = {
  usersLogin: [],
  page: "dashboard",
  profile: {
    patient: {
      user: {},
    },
  },
  callId: {},
  matchedDoctor: null,
};

const sharedDataSlice = createSlice({
  name: "HealthConnect",
  initialState,
  reducers: {
    addUserLogin: (state, action) => {
      const users = action.payload;
      state.usersLogin = users;
    },
    changepage: (state, action) => {
      state.page = action.payload;
    },
    addProfile: (state, action) => {
      state.profile = action.payload;
    },
    updateProfile: (state, action) => {
      state.profile.patient = { ...state.profile.patient, ...action.payload };
    },
    addCallId: (state, action) => {
      console.log(action.payload);
      state.callId = action.payload;
    },
    resetCallId: (state, action) => {
      state.callId = {};
    },
    addMatchedDoctor: (state, action) => {
      state.matchedDoctor = action.payload;
    },
    resetMatchedDoctor: (state, action) => {
      state.matchedDoctor = null;
    },
    changeAvailability: (state, action) => {
      state.profile.patient.available = action.payload;
    },
    resetStateToDefault: (state, action) => {
      // Reset state to initial values
      state.usersLogin = [];
      state.page = "dashboard";
      (state.profile = {
        patient: {
          user: {},
        },
      }),
        (state.callId = {});
      state.matchedDoctor = null;
    },
  },
});

export const {
  addUserLogin,
  changepage,
  addProfile,
  addCallId,
  resetCallId,
  addMatchedDoctor,
  resetMatchedDoctor,
  updateProfile,
  changeAvailability,
  resetStateToDefault,
} = sharedDataSlice.actions;

export default sharedDataSlice.reducer;
