"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { auth, db } from "@/app/firebase/config";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { setDoc, doc } from "firebase/firestore";
import logo from "@/public/assets/images/logo.svg";
import lock from "@/public/assets/images/lock.svg";
import mail from "@/public/assets/images/mail.svg";
import { signupSchema, SignupFormData } from "@/lib/schemas/user";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  const router = useRouter();

  const onSubmit = async (data: SignupFormData) => {
    try {
      const { email, password } = data;
      const userCredential = await createUserWithEmailAndPassword(
        email,
        password,
      );

      if (userCredential) {
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          createdAt: new Date(),
        });
        toast.success("Sign-up successful! Redirecting to sign-in...");
        reset();
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        toast.error("Sign-up failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Firebase error:", error);
      if (error.code) {
        switch (error.code) {
          case "auth/invalid-email":
            toast.error("Invalid email address");
            break;
          case "auth/weak-password":
            toast.error(
              "Password must be at least 8 characters with uppercase, number, and special character",
            );
            break;
          case "auth/email-already-in-use":
            toast.error("Email already in use");
            break;
          default:
            toast.error("An error occurred");
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

      <div className="border bg-white flex flex-col gap-2 sm:w-119 sm:h-140 sm:p-10 px-5 py-12 rounded-md border-white">
        <h2 className="sm:text-[32px] text-2xl text-[#333333] font-bold">
          Create account
        </h2>
        <h3 className="text-base text-[#737373]">
          Let&apos;s get you started sharing your links!
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
              Create Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                placeholder="At least 8 characters"
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

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="text-xs text-primary">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type="password"
                placeholder="At least 8 characters"
                className={`text-base ${
                  errors.confirmPassword
                    ? "text-[#FF3939] border w-full rounded-md py-3 px-10 outline-none"
                    : "border w-full rounded-md py-3 px-10 text-base text-[#737373] focus:border-[#633CFF] focus:outline-none focus:shadow-custom-shadow transition-shadow duration-300"
                }`}
                {...register("confirmPassword")}
              />
              <p className="text-[#FF3939] text-xs absolute top-8 right-0 mx-5">
                {errors.confirmPassword?.message}
              </p>
              <Image
                src={lock}
                alt="lock"
                className="absolute top-4 mx-3 left-0"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full border p-3 rounded-md mt-4 text-white bg-[#633CFF] hover:border-[#BEADFF] hover:bg-[#BEADFF] hover:shadow-custom-shadow transition-shadow duration-300"
          >
            Create new account
          </button>
          <div className="text-center text-base mt-4">
            <h1 className="flex sm:flex-row justify-center items-center flex-col">
              Already have an account?&nbsp;
              <Link href={"/login"} className="text-[#633CFF] hover:underline">
                Sign in
              </Link>
            </h1>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Register;
