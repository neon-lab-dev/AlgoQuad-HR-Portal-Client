/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import TextInput from "../../../components/Reusable/TextInput/TextInput";
import Button from "../../../components/Reusable/Button/Button";
import { useDispatch } from "react-redux";
import {
  setIsModalOpen,
  setModalType,
} from "../../../redux/Features/Auth/authModalSlice";
import { useForgotPasswordMutation } from "../../../redux/Features/Auth/authApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ICONS } from "../../../assets";

type TFormData = {
  email: string;
};
const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TFormData>();

  const handleForgotPassword = async (data: TFormData) => {
    try {
      const payload = {
        email: data.email,
      };
      const response = await forgotPassword(payload).unwrap();
      if (response?.success) {
        localStorage.setItem("resetEmail", data.email);
        reset();
        navigate("/verify-otp");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };
  return (
    <div className="bg-neutral-150  h-screen flex flex-col justify-center items-center font-Montserrat">
      <form
        onSubmit={handleSubmit(handleForgotPassword)}
        className="flex flex-col gap-6 rounded-2xl p-6 w-full md:w-[400px] lg:w-[480px] bg-white"
      >
        <div>
          <img src={ICONS.logo} alt="AlgoQuad" className="w-50 mx-auto mb-2" />
          <h1 className="text-neutral-140 leading-5 font-semibold text-xl text-center mb-3">
            Reset Your Password
          </h1>
        </div>

        <TextInput
          label="Enter Registered Email ID"
          placeholder="example@algoquad.com"
          error={errors.email}
          {...register("email", {
            required: "Email is required",
          })}
        />

        <Button
          type="submit"
          label="Send OTP"
          variant="primary"
          classNames="w-full"
          isLoading={isLoading}
        />

        <p className="text-neutral-140 leading-3 text-center">
          Back to{" "}
          <button
            onClick={() => {
              dispatch(setModalType("login"));
              dispatch(setIsModalOpen(true));
            }}
            type="button"
            className="text-primary-10 font-semibold hover:underline cursor-pointer"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
