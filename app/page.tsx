"use client";
import React from "react";
import { authClient } from "@/lib/auth-client";
import { user } from "@/auth-schema";
import { generateApiKey } from "@/actions/apiKey";
import { LuGithub } from "react-icons/lu";
import { FaGithub } from "react-icons/fa";

const page = () => {
  const { data: session, isPending } = authClient.useSession();
  console.log(session);
  if (isPending) return "Loading...";

  if (!session)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-light  text-neutral-900">Saksham's APIs</h1>
          <h1 className="text-sm font-extralight text-neutral-600 tracking-wider mb-4">My platform for generic API management</h1>
        <button
        className="hover:bg-neutral-50 text-neutral-900 border border-neutral-200 rounded-sm  transition-colors duration-200 ease-in-out px-10 py-1 transition-colors cursor-pointer"
          onClick={async () => {
            await authClient.signIn.social({ provider: "github" });
          }}
        >
          <FaGithub className="inline-block mr-2 text-black" />
          Sign In
        </button>
          <h1 className="text-xs font-extralight text-neutral-400 mt-5 tracking-wide mb-4">You need to be authenticated to be able to use this platform.</h1>

      </div>
      </div>
    );

  return (
    <>
      <h1>Hello!</h1>
      <p>Welcome Back, {session?.user?.name}</p>
      <button onClick={() => generateApiKey("hello", 2)}>
        Generate API Key
      </button>
      <button onClick={async () => await authClient.signOut()}>Sign Out</button>
    </>
  );
};

export default page;
