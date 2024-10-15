import LogoPredict from "@/components/UI/logoPredict";
import Link from "next/link";
import useWindowWidth from "@/hooks/useWindowWidth";

export default function Home() {
  const smTextShadow = { textShadow: "2px 3px 3px rgba(0,0,0,0.9)" };
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 992;

  return (
    <main className="bg-landing bg-cover z-0 relative">
      <div className="z-0 hidden lg:block bg-gradient-to-l from-black via-black/10 absolute top-0 left-0 h-full w-[50%]"></div>
      <div className="z-0 hidden lg:block bg-gradient-to-r from-black via-black/10 absolute top-0 left-[50%] h-full w-[50%]"></div>
      <div className="text-white flex min-h-screen flex-col items-center justify-around p-8 z-20 lg:p-16 animate-fadeIn-l-r lg:animate-fadeIn">
        <h1 className="text-center">
          <LogoPredict bold={true} />
        </h1>
        <div className="flex flex-col gap-8 w-10/12 items-center text-xl font-semibold z-20 justify-around h-fit lg:relative lg:top-16 lg:gap-10">
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
      </div>
    </main>
  );
}
