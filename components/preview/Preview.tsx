"use client";
import { FC, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { db, auth } from "@/app/firebase/config";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  where,
  query,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import github from "@/public/assets/images/github.svg";
import youtube from "@/public/assets/images/youtube.svg";
import facebook from "@/public/assets/images/facebook.svg";
import linkedin from "@/public/assets/images/linkedin.svg";
import ArrowRight from "@/public/assets/images/arrow-right.svg";
import { toast } from "react-hot-toast";

interface Link {
  platform: string;
  url: string;
}

interface PreviewProps {
  links: Link[];
  profilePicture: string | null;
  email: string | null;
  imageUrl: string | null;
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

const PreviewPage: FC<PreviewProps> = ({ links, imageUrl, email }) => {
  const [user] = useAuthState(auth);
  const [linksData, setLinksData] = useState<Link[]>([]);
  const [profileData, setProfileData] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    imageUrl?: string;
  }>({});

  useEffect(() => {
    if (user) {
      const fetchAllData = async () => {
        // 1. Fetch Profile
        const profileRef = doc(db, "profiles", user.uid);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          setProfileData(profileSnap.data());
        }

        // 2. Fetch Links
        const linksRef = collection(db, "links");
        const q = query(linksRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedLinks = querySnapshot.docs.map(
          (doc) => doc.data() as Link,
        );
        setLinksData(fetchedLinks);
      };
      fetchAllData();
    }
  }, [user]);
  const handleShareLink = async () => {
    try {
      // This gets the current browser URL (e.g., http://localhost:3000/preview)
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);

      toast.success("The link has been copied to your clipboard!", {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#333",
          color: "#fff",
          borderRadius: "12px",
        },
      });
    } catch (err) {
      console.error("Failed to copy link: ", err);
      toast.error("Failed to copy link.");
    }
  };

  if (!profileData.firstName && !linksData.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-[#633CFF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="relative md:bg-[#633CFF] rounded-bl-4xl rounded-br-4xl h-92.5 flex flex-col gap-15 lg:gap-26.5 sm:gap-31.5 z-10">
        <div className="w-full top-0 sm:px-6 sm:py-4">
          <nav className="px-6 py-4 rounded-xl bg-white w-full flex justify-center gap-4 sm:gap-0 sm:justify-between items-center">
            <Link
              href="/links"
              className="rounded-lg text-[#633CFF] sm:w-fit w-full border border-[#633CFF] bg-white px-[27px] py-[11px] whitespace-nowrap"
            >
              Back to Links
            </Link>
            <button
              onClick={handleShareLink}
              className="rounded-lg text-white border sm:w-fit w-full border-[#633CFF] bg-[#633CFF] px-[40.5px] sm:px-[27px] py-[11px]"
            >
              Share Link
            </button>
          </nav>
        </div>
        <div className="w-full flex justify-center items-center ">
          <div className="h-fit w-87.25 rounded-3xl md:bg-white flex flex-col py-12 gap-8 items-center">
            <div className="flex flex-col gap-6.25 items-center">
              {profileData.imageUrl ? (
                <Image
                  src={profileData.imageUrl} // Use the fetched URL
                  alt="Profile"
                  className="rounded-full"
                  width={80}
                  height={80}
                />
              ) : (
                <div className="rounded-full w-28 h-28 bg-[#EEEEEE]" />
              )}
              <div className="flex flex-col items-center">
                {profileData.firstName && profileData.lastName && (
                  <div className="text-[#333333] text-[32px] font-bold mt-2">
                    {profileData.firstName} {profileData.lastName}
                  </div>
                )}

                {profileData.email && (
                  <div className="text-[#737373] text-[16px]">
                    {profileData.email}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-5 w-full sm:px-14 flex-col left-0 mx-9">
              {linksData.map((link, index) => (
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
