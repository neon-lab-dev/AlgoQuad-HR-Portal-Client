/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PasswordInput from "../../../components/Reusable/PasswordInput/PasswordInput";
import Button from "../../../components/Reusable/Button/Button";
import { useResetPasswordMutation } from "../../../redux/Features/Auth/authApi";

type TResetPasswordForm = {
  newPassword: string;
  confirmPassword: string;
};

const ResetPassword = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TResetPasswordForm>();

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (!storedEmail) {
      toast.error("Session expired. Please request a new reset link.");
      navigate("/login");
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  // 2. Handle Submit
  const handleReset = async (data: TResetPasswordForm) => {
    if (!email) return;

    try {
      const payload = {
        email: email,
        newPassword: data.newPassword,
        purpose : "firstTimeLogin"
      };

      const response = await resetPassword(payload).unwrap();

      if (response?.success) {
        toast.success(response?.message || "Password reset successfully.");
        localStorage.removeItem("resetEmail");
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="bg-neutral-150 h-screen flex flex-col justify-center items-center font-Montserrat">
      <div className="rounded-2xl p-6 w-full md:w-[400px] lg:w-[480px] bg-white">
        <form
          onSubmit={handleSubmit(handleReset)}
          className="flex flex-col gap-6 lg:gap-5"
        >
          <div className="text-center mb-3">
            <h1 className="text-neutral-140 leading-5 font-semibold text-xl">
              Set New Password
            </h1>
          </div>

          {/* New Password */}
          <PasswordInput
            label="New Password"
            placeholder="Must be at least 8 characters"
            error={errors.newPassword}
            {...register("newPassword", {
              required: "New password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            isPasswordVisible={isPasswordVisible}
            setIsPasswordVisible={setIsPasswordVisible}
          />

          {/* Confirm Password */}
          <PasswordInput
            label="Confirm Password"
            placeholder="Re-enter new password"
            error={errors.confirmPassword}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (val) => {
                if (watch("newPassword") !== val) {
                  return "Passwords do not match";
                }
              },
            })}
            isPasswordVisible={isConfirmVisible}
            setIsPasswordVisible={setIsConfirmVisible}
          />

          <Button
            type="submit"
            label="Reset Password"
            variant="primary"
            classNames="w-full"
            isLoading={isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
