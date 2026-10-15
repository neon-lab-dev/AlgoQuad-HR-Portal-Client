/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import TextInput from "../../Reusable/TextInput/TextInput";
import Button from "../../Reusable/Button/Button";
import { useDispatch } from "react-redux";
import {
  setIsModalOpen,
  setModalType,
} from "../../../redux/Features/Auth/authModalSlice";
import {  useState } from "react";
import { useForgotPasswordMutation } from "../../../redux/Features/Auth/authApi";
import toast from "react-hot-toast";

type TFormData = {
  email: string;
};
const ForgotPassword = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [isOtpSent, setIsOtpSent] = useState("");
  const dispatch = useDispatch();

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
        toast.success(response?.message);
        setIsOtpSent(data?.email);
        reset();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };
  return (
    <form
      onSubmit={handleSubmit(handleForgotPassword)}
      className="flex flex-col gap-8 px-0 lg:px-12"
    >
      <div className="flex flex-col gap-6 lg:gap-5">
        {isOtpSent !== "" && (
          <p className="text-neutral-140 leading-5">
            Reset link Has been sent to{" "}
            <span className="text-neutral-20 font-semibold hover:underline cursor-pointer">
              {isOtpSent}
            </span>
          </p>
        )}
        <TextInput
          label="Enter Registered Email ID"
          placeholder="youremail@gmail.com"
          error={errors.email}
          {...register("email", {
            required: "Email is required",
          })}
        />
      </div>

      <Button
        type="submit"
        label="Send Confirmation Email"
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
          className="text-primary-20 font-semibold hover:underline cursor-pointer"
        >
          Login
        </button>
      </p>
    </form>
  );
};

export default ForgotPassword;
