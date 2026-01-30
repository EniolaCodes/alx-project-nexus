"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { auth } from "@/app/firebase/config";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import logo from "@/public/assets/images/logo.svg";
import lock from "@/public/assets/images/lock.svg";
import mail from "@/public/assets/images/mail.svg";
import { loginSchema, LoginFormData } from "@/lib/schemas/user";

const Login = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const res = await signInWithEmailAndPassword(data.email, data.password);
      if (res) {
        toast.success("Login successful!");
        reset();
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    } catch (e: any) {
      console.error("Sign-in error:", e);
      if (e.code) {
        switch (e.code) {
          case "auth/invalid-email":
            toast.error("Invalid email address");
            break;
          case "auth/wrong-password":
            toast.error("Incorrect password");
            break;
          case "auth/user-not-found":
            toast.error("User not found");
            break;
          default:
            toast.error("An unknown error occurred");
            break;
        }
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gray-100 w-screen mx-auto sm:h-screen flex flex-col sm:justify-center sm:items-center sm:bg-primary sm:py-0 pt-10">
      <div className="sm:pb-10 pb-5 sm:px-0 px-5">
        <Image src={logo} alt="logo" className="sm:w-full h-auto" priority />
      </div>
      <div className="border bg-white flex flex-col gap-2 sm:w-119 sm:h-121.5 sm:p-10 px-5 py-12 rounded-md border-white">
        <h2 className="sm:text-[32px] text-2xl text-[#333333] font-bold">
          Login
        </h2>
        <h3 className="text-base text-[#737373]">
          Add your details below to get back into the{" "}
          <br className="sm:hidden block" /> app
        </h3>
        <form
          className="flex flex-col gap-4 pt-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className={`text-xs ${errors.email ? "text-[#FF3939]" : "text-[#737373]"}`}
            >
              Email address
            </label>
            <div className="relative">
              <input
                id="email"
                type="text"
                placeholder="e.g. alex@email.com"
                className={`text-base ${
                  errors.email
                    ? "text-[#FF3939] border w-full rounded-md py-3 px-10 outline-none"
                    : "border w-full rounded-md py-3 px-10 text-base text-[#737373] focus:border-[#633CFF] focus:outline-none focus:shadow-custom-shadow transition-shadow duration-300"
                }`}
                {...register("email")}
              />
              <p className="text-[#FF3939] text-xs absolute top-8 right-0 mx-5">
                {errors.email?.message}
              </p>
              <Image
                src={mail}
                alt="mail"
                className="absolute top-4 mx-3 left-0"
              />
            </div>
          </div>
          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className={`text-xs ${errors.password ? "text-[#FF3939]" : "text-[#737373]"}`}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`text-base ${
                  errors.password
                    ? "text-[#FF3939] border w-full rounded-md py-3 px-10 outline-none"
                    : "border w-full rounded-md py-3 px-10 text-base text-[#737373] focus:border-[#633CFF] focus:outline-none focus:shadow-custom-shadow transition-shadow duration-300"
                }`}
                {...register("password")}
              />
              <p className="text-[#FF3939] text-xs absolute top-8 right-0 mx-5">
                {errors.password?.message}
              </p>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-4 right-3 text-[#737373] hover:text-[#633CFF] transition-colors"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m4.753-4.753L3.596 3.039m10.318 10.318L21 21"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {/* button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full border p-3 rounded-md mt-5 text-white bg-[#633CFF] hover:border-[#BEADFF] hover:bg-[#BEADFF] hover:shadow-custom-shadow transition-shadow duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                <span>Logging in...</span>
              </>
            ) : (
              "Login"
            )}
          </button>
          <div className="text-center text-base mt-5">
            <h1 className="flex sm:flex-row justify-center items-center flex-col">
              Don&apos;t have an account?&nbsp;
              <Link
                href={"/register"}
                className="text-[#633CFF] hover:underline"
              >
                Create account
              </Link>
            </h1>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
