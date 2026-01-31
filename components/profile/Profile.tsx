"use client";
import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import MainLayout from "../layout/MainLayout";
import upload from "@/public/assets/images/upload.svg";
import change from "@/public/assets/images/change.svg";
import { db, auth, storage } from "@/app/firebase/config";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface UserLink {
  id: string;
  platform: string;
  url: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

const ProfilePage: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [links, setLinks] = useState<UserLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    // Real-time listener for profile document
    const profileRef = doc(db, "profiles", user.uid);
    const unsubscribeProfile = onSnapshot(
      profileRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const profileData = docSnap.data() as FormData & {
            imageUrl?: string;
          };
          setValue("firstName", profileData.firstName);
          setValue("lastName", profileData.lastName);
          setValue("email", profileData.email);
          setProfilePicture(profileData.imageUrl || null);
          setFirstName(profileData.firstName || "");
          setLastName(profileData.lastName || "");
          setEmail(profileData.email || "");
        }
      },
      (err) => {
        console.error("Profile onSnapshot error:", err);
      },
    );

    // One-time fetch for links
    const fetchLinks = async () => {
      const linksRef = collection(db, "links");
      const q = query(linksRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const userLinks: UserLink[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        userLinks.push({ id: doc.id, ...data } as UserLink);
      });
      setLinks(userLinks);
    };

    fetchLinks();

    return () => {
      unsubscribeProfile();
    };
  }, [user, setValue]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onSubmit = async (data: FormData) => {
    if (user) {
      setIsLoading(true);
      try {
        let imageUrl: string | null = profilePicture;

        if (selectedFile) {
          // Validate file size (max 5MB)
          if (selectedFile.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            setIsLoading(false);
            return;
          }

          // Validate file type
          if (!selectedFile.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            setIsLoading(false);
            return;
          }

          try {
            //  Add an extension to the reference so the console recognizes it as an image
            const fileExtension = selectedFile.name.split(".").pop();
            const imageRef = ref(
              storage,
              `profile_images/${user.uid}/avatar.${fileExtension}`,
            );
            //  Upload with metadata (helps the Firebase Console display it correctly)
            const metadata = { contentType: selectedFile.type };
            await uploadBytes(imageRef, selectedFile, metadata);
            //  Get the permanent URL
            imageUrl = await getDownloadURL(imageRef);
          } catch (uploadError: any) {
            console.error("Upload error:", uploadError);
            if (uploadError.code === "storage/unauthorized") {
              toast.error("Storage access denied. Contact support.");
            } else if (uploadError.code === "storage/retry-limit-exceeded") {
              toast.error("Upload timeout. Please try again.");
            } else {
              toast.error(`Upload failed: ${uploadError.message}`);
            }
            setIsLoading(false);
            return;
          }
        }

        console.log("Submitting profile update:", data, { imageUrl });
        await setDoc(
          doc(db, "profiles", user.uid),
          {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            imageUrl,
          },
          { merge: true },
        );

        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        setProfilePicture(imageUrl);

        toast.success("Profile updated successfully!");
        setTimeout(() => {
          router.push("/links");
        }, 1000);
      } catch (error: any) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-2 border-[#633CFF]"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin flex justify-center items-center rounded-full h-20 w-20 border-t-4 border-b-2 border-[#b32828]"></div>

        <p className="text-gray-700 mt-4">Please log in to continue.</p>

        <Link
          href="/login"
          className="text-[#b32828] underline mt-2 font-medium"
        >
          Go to Login Page
        </Link>
      </div>
    );
  }
  return (
    <div className="lg:flex bg-gray-100 p-5">
      <div className="bg-gray-100 p-7">
        <MainLayout
          profilePicture={profilePicture || undefined}
          firstName={firstName}
          lastName={lastName}
          email={email}
          links={links}
        />
      </div>
      <div className="max-w-4xl my-8 bg-white shadow-md rounded-lg p-5 flex-1">
        <h1 className="text-black sm:text-[32px] text-2xl font-bold">
          Profile Details
        </h1>
        <h2 className="text-[#737373] text-base mt-2">
          Add your details to create a personal touch to your profile
        </h2>
        <div className="flex sm:flex-row flex-col border mt-8 rounded-md border-[#FAFAFA] bg-[#FAFAFA] py-8 px-4 sm:gap-20 gap-8 sm:items-center items-start justify-between">
          <h3 className="text-base text-[#737373]">Profile picture</h3>
          <div className="flex sm:flex-row flex-col sm:items-center items-start gap-10">
            <div
              className="border border-[#EFEBFF] bg-[#EFEBFF] sm:py-4 py-12 sm:px-8 px-6 rounded-md flex flex-col items-center cursor-pointer"
              onClick={handleUploadClick}
              style={{
                backgroundImage: profilePicture
                  ? `url(${profilePicture})`
                  : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <Image
                src={profilePicture || selectedFile ? change : upload}
                alt={profilePicture || selectedFile ? "change" : "upload"}
                className="mb-2"
              />
              <h4
                className={`font-semibold ${profilePicture || selectedFile ? "text-white" : "text-[#633CFF]"}`}
              >
                {profilePicture || selectedFile
                  ? "Change Image"
                  : "+ Upload Image"}
              </h4>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept="image/png, image/jpeg"
              />
            </div>
            <h5 className="text-xs text-[#737373]">
              Image must be below 1024x1024px.
              <br className="sm:block hidden" />
              Use PNG <br className="sm:hidden block" /> or JPG format.
            </h5>
          </div>
        </div>
        {selectedFile && (
          <div className="mt-4 text-[#737373]">
            <p>Selected file: {selectedFile.name}</p>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="border mt-8 rounded-md border-[#FAFAFA] py-8 px-4 flex flex-col gap-2 bg-[#FAFAFA] items-center">
            <div className="sm:flex w-full relative">
              <label
                htmlFor="firstName"
                className="w-full text-[#737373] sm:text-base text-xs"
              >
                First name*
              </label>
              <input
                type="text"
                placeholder="e.g John"
                {...register("firstName", { required: "Can't be empty" })}
                className="w-full rounded-md py-2 border px-[.7rem] border-light-gray text-base outline-none font-normal text-black"
              />
              {errors.firstName && (
                <span className="text-red-500 absolute top-3 px-4 right-0 text-red text-xs">
                  {errors.firstName.message}
                </span>
              )}
            </div>
            <div className="sm:flex w-full relative">
              <label
                htmlFor="lastName"
                className="w-full text-[#737373] sm:text-base text-xs"
              >
                Last name*
              </label>
              <input
                type="text"
                placeholder="e.g Appleseed"
                {...register("lastName", { required: "Can't be empty" })}
                className="w-full rounded-md py-2 border px-[.7rem] border-[#D9D9D9] text-base outline-none text-black"
              />
              {errors.lastName && (
                <span className="text-[#FF3939] absolute top-3 right-0 px-4 text-xs">
                  {errors.lastName.message}
                </span>
              )}
            </div>
            <div className="sm:flex w-full">
              <label
                htmlFor="email"
                className="w-full text-[#737373] sm:text-base text-xs"
              >
                Email
              </label>
              <input
                type="text"
                placeholder="e.g email@example.com"
                {...register("email", {
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full rounded-md py-2 border px-[.7rem] border-[#D9D9D9] text-base outline-none text-black"
              />
              {errors.email && (
                <span className="text-[#FF3939]">{errors.email.message}</span>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="text-right border py-2 px-7 mt-20 border-t rounded-md text-white bg-[#633CFF] font-semibold hover:bg-[#4e2ed1] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                  <span>Saving...</span>
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
