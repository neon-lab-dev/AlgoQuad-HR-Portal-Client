/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Button from "../../../components/Reusable/Button/Button";
import {
  setIsModalOpen,
  setModalType,
} from "../../../redux/Features/Auth/authModalSlice";
import {
  useVerifyOtpMutation,
  useResendOTPMutation,
} from "../../../redux/Features/Auth/authApi";

const OTP_LENGTH = 6;
const TIMER_SECONDS = 120; // 2 minutes

const VerifyOTP = () => {
  // ---- Mutations ----
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOTP, { isLoading: isResending }] = useResendOTPMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get email from localStorage
  const email = localStorage.getItem("resetEmail") || "N/A";

  // ---- OTP State ----
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ---- Timer State ----
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [canResend, setCanResend] = useState(false);

  // ---- Redirect if no email ----
  useEffect(() => {
    if (!email || email === "N/A") {
      toast.error("Session expired. Please try again.");
      navigate("/login");
    }
  }, [email, navigate]);

  // ---- Countdown Timer Logic ----
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  // Format time (e.g. 01:59)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // ---- OTP Handlers ----
  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^0-9]/g, ""); // Allow only numbers
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Take last char
    setOtp(newOtp);
    setError(null);

    // Move to next input
    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current is empty, move back and clear previous
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Just clear current
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .slice(0, OTP_LENGTH)
      .replace(/[^0-9]/g, "");

    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      const nextIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  // ---- Submit OTP ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== OTP_LENGTH) {
      setError("Please enter all 6 digits.");
      return;
    }

    try {
      const payload = { email, otp: otpString };
      const response = await verifyOtp(payload).unwrap();

      if (response?.success) {
        toast.success(response?.message || "OTP verified successfully!");
        navigate("/reset-password?purpose=passwordReset");
      }
    } catch (err: any) {
      setError(err?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  // ---- Resend OTP ----
  const handleResend = async () => {
    if (!canResend) return;

    try {
      // Call the dedicated resend API
      await resendOTP({ email }).unwrap();
      toast.success("A new OTP has been sent to your email.");

      // Reset timer and inputs
      setTimeLeft(TIMER_SECONDS);
      setCanResend(false);
      setOtp(new Array(OTP_LENGTH).fill(""));
      setError(null);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <div className="bg-neutral-150 h-screen flex flex-col justify-center items-center font-Montserrat">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 rounded-2xl p-6 w-full md:w-[400px] lg:w-[480px] bg-white"
      >
        <div className="text-center space-y-2">
          <h1 className="text-neutral-140 leading-5 font-semibold text-xl">
            Verify Your Email
          </h1>
          <p className="text-sm text-neutral-65">
            We've sent a 6-digit verification code to <br />
            <span className="font-semibold text-neutral-40">{email}</span>
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-semibold text-neutral-40 border-2 rounded-lg outline-none transition-all
                ${
                  error
                    ? "border-red-300 focus:border-red-500"
                    : "border-neutral-98 focus:border-primary-10 bg-neutral-105 focus:bg-white"
                }`}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && <p className="text-xs text-red-500 text-center">{error}</p>}

        <Button
          type="submit"
          label="Verify OTP"
          variant="primary"
          classNames="w-full"
          isLoading={isVerifying}
        />

        <div className="flex flex-col gap-2 text-center text-sm">
          {/* Timer & Resend */}
          <p className="text-neutral-140">
            {canResend ? (
              <>
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-primary-10 font-semibold hover:underline cursor-pointer disabled:opacity-50"
                >
                  {isResending ? "Resending..." : "Resend"}
                </button>
              </>
            ) : (
              <span className="text-neutral-65">
                Resend code in{" "}
                <span className="font-semibold text-neutral-40">
                  {formatTime(timeLeft)}
                </span>
              </span>
            )}
          </p>

          <p className="text-neutral-140 mt-2">
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
        </div>
      </form>
    </div>
  );
};

export default VerifyOTP;
