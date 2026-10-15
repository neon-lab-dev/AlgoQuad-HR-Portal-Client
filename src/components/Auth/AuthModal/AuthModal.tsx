import { RxCrossCircled } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { setIsModalOpen } from "../../../redux/Features/Auth/authModalSlice";
import Login from "../Login/Login";
import VerifyOtp from "../VerifyOtp/VerifyOtp";
import ForgotPassword from "../ForgotPassword/ForgotPassword";
import ResetPassword from "../ResetPassword/ResetPassword";
import Signup from "../Signup/Signup";

const AuthModal = () => {
  const dispatch = useDispatch();
  const { isModalOpen, modalType } = useSelector(
    (state: RootState) => state.authModal
  );

  return (
    <div
      className={`${
        isModalOpen ? " visible" : " invisible"
      } w-full h-screen fixed top-0 left-0 z-[20000000000] bg-[#0000002a] flex items-center justify-center transition-all duration-300 p-4`}
    >
      <div
        className={`${
          isModalOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
        } w-full md:w-[400px] lg:w-[580px] bg-white rounded-2xl p-6 transition-all duration-300 z-[999] h-fit max-h-[600px] overflow-y-auto`}
      >
        <div className="w-full">
          <RxCrossCircled
            onClick={() => dispatch(setIsModalOpen(false))}
            className="text-end justify-self-end text-2xl text-neutral-125 cursor-pointer"
          />
          <h1 className="text-neutral-20 text-xl md:text-2xl font-medium leading-7 text-center mb-8">
            <span className="bg-primary-20 px-2 text-white">
              {modalType === "signup"
                ? "Sign Up"
                : modalType === "login"
                ? "Log In"
                : modalType === "verifyOtp"
                ? "Verify"
                : modalType === "forgotPassword"
                ? "Forgot"
                : modalType === "resetPassword"
                ? "Reset"
                : ""}
            </span>{" "}
            {modalType === "signup" || modalType === "login"
              ? "to HanjiFinance"
              : modalType === "verifyOtp"
              ? "Your Email"
              : modalType === "forgotPassword"
              ? "Password"
              : modalType === "resetPassword"
              ? "Password"
              : ""}
          </h1>

          {modalType === "signup" ? (
            <Signup />
          ) : modalType === "login" ? (
            <Login />
          ) : modalType === "verifyOtp" ? (
            <VerifyOtp />
          ) : modalType === "forgotPassword" ? (
            <ForgotPassword />
          ) : modalType === "resetPassword" ? (
            <ResetPassword />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
