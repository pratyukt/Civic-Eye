import { createSlice } from "@reduxjs/toolkit";
const initialState={
    userName: "",
    email: "",
    mobileNumber: "",
    password: "",
    credit: 0,
    role:"",
    createdAt:""
}
const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    addUserData: (state, action) => {
      state.userName = action.payload.userName;
      state.email = action.payload.email;
      state.mobileNumber = action.payload.mobileNumber;
      state.password = action.payload.password;
      state.credit = action.payload.credit;
      state.role = action.payload.role;
      state.createdAt = action.payload.createdAt;
    },
  },
});

export const {addUserData}=userDataSlice.actions;
export default userDataSlice.reducer;