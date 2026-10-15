/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import TextInput from "../../Reusable/TextInput/TextInput";
import PasswordInput from "../../Reusable/PasswordInput/PasswordInput";
import Button from "../../Reusable/Button/Button";
import {
  setIsModalOpen,
  setModalType,
} from "../../../redux/Features/Auth/authModalSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../../redux/Features/Auth/authApi";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import {
  clearRedirectPath,
  setUser,
  useRedirectPath,
} from "../../../redux/Features/Auth/authSlice";
import { useNavigate } from "react-router-dom";

type TFormData = {
  email: string;
  password: string;
};
const Login = () => {
  const navigate = useNavigate();
  const redirectPath = useSelector(useRedirectPath);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormData>();

  const handleLogin = async (data: TFormData) => {
    try {
      const payload = {
        ...data,
      };
      const response = await login(payload).unwrap();
      const user = response.data?.user;
      const accessToken = response.data?.accessToken;

      const userRole = response?.data?.user?.role;
      if (accessToken) {
        Cookies.set("accessToken", accessToken, {
          expires: 7,
          secure:
            typeof window !== "undefined" &&
            window.location.protocol === "https:",
          sameSite: "strict",
        });
        Cookies.set("role", userRole, {
          expires: 7,
          secure: window.location.protocol === "https:",
          sameSite: "strict",
        });
      }

      if (response?.success) {
        dispatch(setUser({ user, token: response?.data?.accessToken }));
        toast.success(response?.message);
        dispatch(setIsModalOpen(false));

        let targetPath = "/"; // default

        if (userRole === "admin") {
          targetPath = "/dashboard/admin";
        } else if (userRole === "user") {
          targetPath = redirectPath || "/dashboard";
          if (redirectPath) dispatch(clearRedirectPath());
        }

        navigate(targetPath);

        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };
  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="flex flex-col gap-6 lg:gap-5 px-0 lg:px-12"
    >
      <TextInput
        label="Email"
        type="email"
        placeholder="you@email.com"
        error={errors.email}
        {...register("email", {
          required: "Email is required",
        })}
      />

      <div className="flex flex-col gap-[6px]">
        <PasswordInput
          label="Password"
          placeholder="Must be at least 8 Characters"
          error={errors.password}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
          isPasswordVisible={isPasswordVisible}
          setIsPasswordVisible={setIsPasswordVisible}
        />

        <div className="flex justify-end">
          <button
            onClick={() => {
              dispatch(setModalType("forgotPassword"));
              dispatch(setIsModalOpen(true));
            }}
            className="text-primary-20 font-semibold hover:underline cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>
      </div>

      <Button
        type="submit"
        label="Login"
        variant="primary"
        classNames="w-full"
        isLoading={isLoading}
      />
      <p className="text-neutral-140 leading-5 mt-2 text-center">
        New to HanjiFinance?{" "}
        <button
          onClick={() => {
            dispatch(setModalType("signup"));
            dispatch(setIsModalOpen(true));
          }}
          className="text-primary-20 font-semibold hover:underline cursor-pointer"
        >
          Signup
        </button>
      </p>
    </form>
  );
};

export default Login;
