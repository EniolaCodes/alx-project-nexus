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
                type="password"
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
              <Image
                src={lock}
                alt="lock"
                className="absolute top-4 mx-3 left-0"
              />
            </div>
          </div>
          {/* button */}
          <button
            type="submit"
            className="w-full border p-3 rounded-md mt-5 text-white bg-[#633CFF] hover:border-[#BEADFF] hover:bg-[#BEADFF] hover:shadow-custom-shadow transition-shadow duration-300"
          >
            Login
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
