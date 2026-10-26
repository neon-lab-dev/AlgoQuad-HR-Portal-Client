/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useLoginMutation } from "../../../redux/Features/Auth/authApi";
import { setUser } from "../../../redux/Features/Auth/authSlice";
import TextInput from "../../../components/Reusable/TextInput/TextInput";
import PasswordInput from "../../../components/Reusable/PasswordInput/PasswordInput";
import Button from "../../../components/Reusable/Button/Button";

type TFormData = {
  email: string;
  password: string;
};

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
        navigate("/dashboard/admin");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };
  return (
    <div className="bg-neutral-150  h-screen flex flex-col justify-center items-center font-Montserrat">
      <div className="rounded-2xl p-6 w-full md:w-[400px] lg:w-[480px] bg-white">
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="flex flex-col gap-6 lg:gap-5"
        >
          <h1 className="text-neutral-140 leading-5 font-semibold text-center text-xl mb-3">
            Welcome Back
          </h1>
          <TextInput
            label="Email"
            type="email"
            placeholder="you@email.com"
            error={errors.email}
            {...register("email", {
              required: "Email is required",
            })}
          />

          <div className="flex flex-col gap-1.5">
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

            {/* <div className="flex justify-end">
            <button className="text-primary-20 font-semibold hover:underline cursor-pointer">
              Forgot Password?
            </button>
          </div> */}
          </div>

          <Button
            type="submit"
            label="Login"
            variant="primary"
            classNames="w-full"
            isLoading={isLoading}
          />
          {/* <p className="text-neutral-140 leading-5 mt-2 text-center">
          New to HanjiFinance?{" "}
          <button
            type="button"
            className="text-primary-20 font-semibold hover:underline cursor-pointer"
          >
            Signup
          </button>
        </p> */}
        </form>
      </div>
    </div>
  );
};

export default Login;
