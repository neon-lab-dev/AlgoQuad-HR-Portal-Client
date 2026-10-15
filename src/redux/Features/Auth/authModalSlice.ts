// src/redux/features/authModal/authModalSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ModalType =
  | "signup"
  | "verifyOtp"
  | "login"
  | "resetPassword"
  | "forgotPassword"
  | "forgotPasswordSuccess"
  | null;

interface AuthModalState {
  modalType: ModalType;
  isModalOpen: boolean;
}

const initialState: AuthModalState = {
  modalType: "login",
  isModalOpen: false,
};

const authModalSlice = createSlice({
  name: "authModal",
  initialState,
  reducers: {
    setModalType(state, action: PayloadAction<ModalType>) {
      state.modalType = action.payload;
    },
    setIsModalOpen(state, action: PayloadAction<boolean>) {
      state.isModalOpen = action.payload;
    },
    openModal(state, action: PayloadAction<ModalType>) {
      state.modalType = action.payload;
      state.isModalOpen = true;
    },
    closeModal(state) {
      state.modalType = null;
      state.isModalOpen = false;
    },
  },
});

export const { setModalType, setIsModalOpen, openModal, closeModal } =
  authModalSlice.actions;
export default authModalSlice.reducer;
