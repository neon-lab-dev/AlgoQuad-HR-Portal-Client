/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import PasswordInput from "../../Reusable/PasswordInput/PasswordInput";
import Button from "../../Reusable/Button/Button";
import { useResetPasswordMutation } from "../../../redux/Features/Auth/authApi";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

type TFormData = {
  password: string;
  confirmPassword: string;
};

const ResetPassword = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const email = query.get("email");
  const token = query.get("token");
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TFormData>();
  const password = watch("password");

  const handleResetPassword = async (data: TFormData) => {
    try {
      const payload = {
        email,
        newPassword: data.password,
      };
      const response = await resetPassword({
        resetPasswordData: payload,
        token,
      }).unwrap();
      if (response?.success) {
        toast.success(response?.message);
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };
  return (
    <div className="bg-neutral-150  h-screen flex flex-col justify-center items-center font-Montserrat">
      <div className="rounded-2xl p-6 w-full md:w-[400px] lg:w-[480px] bg-white">
        <form
          onSubmit={handleSubmit(handleResetPassword)}
          className="flex flex-col gap-6 lg:gap-5"
        >
          <PasswordInput
            label="New Password"
            placeholder="Must be at least 8 Characters"
            error={errors.password}
            {...register("password", {
              required: "New Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            isPasswordVisible={isPasswordVisible}
            setIsPasswordVisible={setIsPasswordVisible}
          />

          <PasswordInput
            label="Confirm New Password"
            placeholder="Re-type your password"
            error={errors.confirmPassword}
            {...register("confirmPassword", {
              required: "Confirm new password is required",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            isPasswordVisible={isConfirmPasswordVisible}
            setIsPasswordVisible={setIsConfirmPasswordVisible}
          />

          <Button
            type="submit"
            label="Save New Password"
            variant="primary"
            classNames="w-full"
            isLoading={isLoading}
          />
          <p className="text-neutral-140 leading-3 text-center">
            Back to{" "}
            <a
              href="/"
              className="text-primary-20 font-semibold hover:underline cursor-pointer"
            >
              Home
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
