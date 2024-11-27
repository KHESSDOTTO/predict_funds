import LogoPredict from "@/components/UI/logoPredict";
import Link from "next/link";

export default function Home() {
  const smTextShadow = { textShadow: "2px 3px 3px rgba(0,0,0,0.9)" };

  return (
    <main className="bg-landing bg-cover z-0 relative">
      <div className="z-0 hidden lg:block bg-gradient-to-l from-black via-black/10 absolute top-0 left-0 h-full w-[50%]"></div>
      <div className="z-0 hidden lg:block bg-gradient-to-r from-black via-black/10 absolute top-0 left-[50%] h-full w-[50%]"></div>
      <div className="text-white flex min-h-screen flex-col items-center justify-around p-8 z-20 lg:p-16 animate-fadeIn-l-r lg:animate-fadeIn">
        <h1 className="text-center z-10">
          <LogoPredict bold={true} />
        </h1>
        <div className="relative h-28 w-full text-xl lg:top-16 font-semibold">
          <Link
            href={"/signup"}
            className="py-1 absolute top-0 right-[50%] translate-x-[50%] hover:text-yellow-600 md:hover:scale-125 w-28 text-center transition-all duration-300"
            style={smTextShadow}
          >
            Sign up
          </Link>
          <Link
            href={"/login"}
            className="py-1 absolute bottom-0 right-[50%] translate-x-[50%] hover:text-yellow-600 md:hover:scale-125 w-28 text-center transition-all duration-300"
            style={smTextShadow}
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
