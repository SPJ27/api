"use client";
import { authClient } from "@/lib/auth-client";
import { FaGithub } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { useState } from "react";

const LoginPage = () => {
    const [loading, setLoading] = useState(false)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-light  text-neutral-900">Saksham's APIs</h1>
          <h1 className="text-sm font-extralight text-neutral-600 tracking-wider mb-4">My platform for generic API management</h1>
        <button
        className={`${
          loading ? "cursor-not-allowed bg-neutral-300 text-neutral-600 " : "cursor-pointer hover:bg-neutral-50 text-neutral-900"
        }  items-center flex  border border-neutral-200 rounded-sm  transition-colors duration-200 ease-in-out px-10 py-1`}
          onClick={async () => {
            setLoading(true);
            await authClient.signIn.social({ provider: "github" });
          }}
          disabled={loading}
        >
          {loading ? (
            <CgSpinner className="mr-2 text-black animate-spin" />
          ) : (
            <FaGithub className="mr-2 text-black" />
          )}
          {loading ? "Signing In..." : "Sign In"}
          
        </button>
          <h1 className="text-xs font-extralight text-neutral-400 mt-5 tracking-wide mb-4">You need to be authenticated to be able to use this platform.</h1>

      </div>
      </div>
    );

  
};

export default LoginPage;
