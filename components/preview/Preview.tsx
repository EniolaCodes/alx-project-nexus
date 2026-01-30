"use client";
import { FC, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { db, auth } from "@/app/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import github from "@/public/assets/images/github.svg";
import youtube from "@/public/assets/images/youtube.svg";
import facebook from "@/public/assets/images/facebook.svg";
import linkedin from "@/public/assets/images/linkedin.svg";
import ArrowRight from "@/public/assets/images/arrow-right.svg";

interface Link {
  platform: string;
  url: string;
}

interface PreviewProps {
  links: Link[];
  profilePicture: string | null;
  email: string | null;
}

const platformImages: Record<string, string> = {
  GitHub: github,
  LinkedIn: linkedin,
  YouTube: youtube,
  Facebook: facebook,
};

const platformColors: Record<string, string> = {
  GitHub: "#1A1A1A",
  LinkedIn: "#2D68FF",
  YouTube: "#EE3939",
  Facebook: "#4267B2",
};

const PreviewPage: FC<PreviewProps> = ({ links, profilePicture, email }) => {
  const [user] = useAuthState(auth);
  const [profileData, setProfileData] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    profilePicture?: string;
  }>({});

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const docRef = doc(db, "profiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data() as any);
        }
      };
      fetchProfile();
    }
  }, [user]);

  return (
    <div className="min-h-screen w-full">
      <div className="relative sm:bg-none bg-[#633CFF] rounded-bl-4xl rounded-br-4xl h-92.5 flex flex-col gap-15 lg:gap-26.5 sm:gap-31.5 z-10">
        <div className="w-full top-0 sm:px-6 sm:py-4">
          <nav className="px-6 py-4 rounded-xl bg-white w-full flex justify-center gap-4 sm:gap-0 sm:justify-between items-center">
            <Link
              href="/"
              className="rounded-lg text-[#633CFF] sm:w-fit w-full border border-[#633CFF] bg-white px-[27px] py-[11px] whitespace-nowrap"
            >
              Back to Links
            </Link>
            <button className="rounded-lg text-white border sm:w-fit w-full border-[#633CFF] bg-[#633CFF] px-[40.5px] sm:px-[27px] py-[11px]">
              Share Link
            </button>
          </nav>
        </div>
        <div className="w-full flex justify-center items-center">
          <div className="h-fit w-76.75 rounded-3xl bg-white flex flex-col py-12 gap-14 items-center">
            <div className="flex flex-col gap-6.25 items-center">
              {profilePicture ? (
                <div className="relative">
                  <Image
                    src={profilePicture}
                    alt="Profile Picture"
                    priority
                    className="w-28 h-28 rounded-full border-4 border-[#633CFF] object-cover"
                    width={100}
                    height={100}
                  />
                </div>
              ) : (
                <div className="rounded-full w-28 h-28 content-none bg-[#EEEEEE] mx-20 top-16 left-0" />
              )}
              <div className="flex flex-col gap-3.25 items-center">
                {profileData.firstName && profileData.lastName && (
                  <div className="text-[#737373] text-sm mt-2">
                    {profileData.firstName} {profileData.lastName}
                  </div>
                )}
                {email && (
                  <div className="text-[#737373] text-sm mt-2">{email}</div>
                )}
              </div>
            </div>
            <div className="flex gap-5 w-full sm:px-14 flex-col top-50 left-0 mx-9">
              {links.map((link, index) => (
                <div
                  key={index}
                  className="rounded-md h-11 w-full flex items-center pl-4 pr-5 py-4 gap-2 justify-between text-white"
                  style={{ backgroundColor: platformColors[link.platform] }}
                >
                  <div className="flex gap-2 items-center">
                    <Image
                      src={platformImages[link.platform]}
                      alt={link.platform}
                      width={20}
                      height={20}
                    />
                    <Link
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white"
                    >
                      {link.platform}
                    </Link>
                  </div>
                  <Image src={ArrowRight} alt="arrow" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
