/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import TextInput from "../../Reusable/TextInput/TextInput";
import Button from "../../Reusable/Button/Button";
import {
  setIsModalOpen,
  setModalType,
} from "../../../redux/Features/Auth/authModalSlice";
import { useVerifyOtpMutation } from "../../../redux/Features/Auth/authApi";
import toast from "react-hot-toast";

type TFormData = {
  otp: string | number;
};

const VerifyOtp = () => {
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const dispatch = useDispatch();

  const [secondsLeft, setSecondsLeft] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      setEmail(email);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormData>();

  const handleVerifyOtp = async (data: TFormData) => {
    try {
      const payload = {
        email,
        otp: data.otp,
      };
      const response = await verifyOtp(payload).unwrap();
      if (response?.success) {
        toast.success(response?.message);
        dispatch(setModalType("login"));
        dispatch(setIsModalOpen(true));
        localStorage.removeItem("email");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  useEffect(() => {
    if (secondsLeft === 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <form
      onSubmit={handleSubmit(handleVerifyOtp)}
      className="flex flex-col gap-8 px-0 lg:px-12"
    >
      <div className="flex flex-col gap-6 lg:gap-5">
        <p className="text-neutral-140 leading-5">
          OTP has been sent to{" "}
          <span className="text-neutral-20 font-semibold hover:underline cursor-pointer">
            {email}
          </span>
        </p>
        <TextInput
          label="OTP"
          type="number"
          placeholder="Enter the 6-digit OTP to verify"
          error={errors.otp}
          {...register("otp", {
            required: "OTP is required",
          })}
        />
      </div>

      <Button
        type="submit"
        label="Verify OTP"
        variant="primary"
        classNames="w-full"
        isLoading={isLoading}
      />

      {canResend ? (
        <button
          onClick={() => {
            dispatch(setModalType("signup"));
            dispatch(setIsModalOpen(true));
            setSecondsLeft(120);
            setCanResend(false);
          }}
          type="button"
          className="text-primary-20 font-semibold hover:underline cursor-pointer"
        >
          Resend OTP
        </button>
      ) : (
        <p className="text-primary-20 leading-5 text-center font-semibold">
          Resend OTP{" "}
          <span className="font-normal">(in {formatTime(secondsLeft)})</span>
        </p>
      )}
    </form>
  );
};

export default VerifyOtp;
