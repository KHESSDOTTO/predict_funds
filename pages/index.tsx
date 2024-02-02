import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const lgTextShadow = { textShadow: "5px 5px 3px rgba(10,0,10,0.2)" };
  const smTextShadow = { textShadow: "2px 2px 3px rgba(0,0,0,0.2)" };

  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-8 md:p-16 lg:p-24 lg:">
      <h1
        className="font-bold text-6xl text-center font-serif border-black py-2 px-4 lg:text-5xl"
        style={lgTextShadow}
      >
        Predict
      </h1>
      <div className="flex flex-col gap-8 w-10/12 items-center text-xl font-semibold justify-around h-fit lg:relative lg:top-16 lg:gap-10">
        <Link
          href={"/signup"}
          className="py-1 hover:text-yellow-600 md:hover:text-2xl w-28 text-center transition-all"
          style={smTextShadow}
        >
          Sign up
        </Link>
        <Link
          href={"/login"}
          className="py-1 hover:text-yellow-600 md:hover:text-2xl w-28 text-center transition-all"
          style={smTextShadow}
        >
          Login
        </Link>
      </div>
    </main>
  );
}
