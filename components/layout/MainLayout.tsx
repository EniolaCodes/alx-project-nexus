"use client";
import React, { FC } from "react";
import Image from "next/image";
import innerShape from "@/public/assets/images/Rectangle 15.svg";
import outerShape from "@/public/assets/images/Subtract.svg";
import github from "@/public/assets/images/github.svg";
import linkedin from "@/public/assets/images/linkedin.svg";
import facebook from "@/public/assets/images/facebook.svg";
import youtube from "@/public/assets/images/youtube.svg";
import arrow from "@/public/assets/images/arrow.svg";

interface MainLayoutProps {
  links: { platform: string; url: string }[];
  profilePicture?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

const platformImages: Record<string, string> = {
  GitHub: github,
  LinkedIn: linkedin,
  YouTube: youtube,
  Facebook: facebook,
};

const MainLayout: FC<MainLayoutProps> = ({
  links = [],
  profilePicture,
  firstName,
  lastName,
  email,
}) => {
  const validLinks = links.filter(
    (link) => link.platform && platformImages[link.platform],
  );

  const boxes = new Array(5).fill(null);

  return (
    <section className="px-28 lg:block hidden bg-white shadow-md rounded-lg p-12">
      <main className="h-157.75 w-76.75 relative">
        <Image
          className="absolute top-0 left-0"
          style={{ width: "90%", height: "auto" }}
          alt="inner shape"
          src={innerShape}
        />
        <Image
          src={outerShape}
          alt="outer"
          className="w-[16rem] absolute top-3 mx-2.5"
        />
        <div>
          <div className="rounded-full w-20 h-20 content-none bg-[#EEEEEE] mx-20 top-16 absolute left-0">
            {profilePicture && (
              <Image
                src={profilePicture}
                alt="Profile Picture"
                className="rounded-full"
                width={80}
                height={80}
              />
            )}
          </div>
          {!firstName && !lastName && (
            <>
              <div className="w-40 top-48 mx-[3.6rem] absolute h-5 rounded-full bg-[#EEEEEE] " />
              <div className="w-20 top-56 mx-[6.4rem] absolute h-2 rounded-full bg-[#EEEEEE] " />
            </>
          )}
          {firstName && lastName && (
            <div className="text-center absolute top-48 left-0 right-0 ">
              <span className="text-black mr-8 text-xl font-semibold">
                {firstName} {lastName}
              </span>
            </div>
          )}
          {email && (
            <div className="text-center absolute top-56 left-0 right-0 ">
              <span className="text-black mr-8 text-sm">{email}</span>
            </div>
          )}
        </div>
        <div className="absolute flex gap-3 flex-col top-66 left-0 mx-9">
          {boxes.map((_, index) => (
            <div
              key={index}
              className={`rounded-md w-52 h-11 flex items-center justify-between pl-2 gap-1 text-white ${
                validLinks[index] && validLinks[index].platform === "GitHub"
                  ? "bg-black"
                  : validLinks[index] &&
                      validLinks[index].platform === "LinkedIn"
                    ? "bg-[#2D68FF]"
                    : validLinks[index] &&
                        validLinks[index].platform === "YouTube"
                      ? "bg-[#EE0000]"
                      : validLinks[index] &&
                          validLinks[index].platform === "Facebook"
                        ? "bg-[#3e63ae]"
                        : "bg-[#EEEEEE]"
              }`}
            >
              {validLinks[index] ? (
                <>
                  <div className="flex gap-1 items-center mx-1">
                    <Image
                      src={platformImages[validLinks[index].platform] || ""}
                      alt={validLinks[index].platform}
                      width={20}
                      height={20}
                    />
                    <a
                      href={validLinks[index].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white"
                    >
                      {validLinks[index].platform}
                    </a>
                  </div>
                  <Image src={arrow} alt="arrow" className="mx-2" />
                </>
              ) : (
                <span className="text-gray-500"></span>
              )}
            </div>
          ))}
        </div>
      </main>
    </section>
  );
};

export default MainLayout;
