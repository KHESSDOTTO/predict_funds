import LogoPredict from "@/components/UI/logoPredict";
import Link from "next/link";

export default function Home() {
  const smTextShadow = { textShadow: "2px 3px 3px rgba(0,0,0,0.9)" };

  return (
    <main className="bg-landing bg-cover z-0 relative">
      <div className="text-white flex min-h-screen flex-col items-center justify-around p-8 z-20 lg:p-16 animate-fadeIn-l-r lg:animate-fadeIn">
        <h1 className="relative text-center z-10 p-8">
          <div className="black-blur w-[1000px] h-[300px] hidden lg:block"></div>
          <div className="relative z-10">
            <LogoPredict bold={true} />
          </div>
        </h1>
        <div className="relative overflow-visible h-48 w-full text-xl lg:top-16 flex flex-col gap-6 lg:flex-row justify-center items-center lg:w-[50%] font-semibold">
          <div className="absolute gray-blur w-[150%] h-[400px] hidden lg:block"></div>
          <Link
            href={"/signup"}
            className="z-10 py-1 hover:text-yellow-600 md:hover:scale-110 lg:w-1/3 text-center transition-all duration-200"
            style={smTextShadow}
          >
            Sign up
          </Link>
          <Link
            href={"/login"}
            className="z-10 py-1 hover:text-yellow-600 hover:scale-110 lg:w-1/3 text-center transition-all duration-200"
            style={smTextShadow}
          >
            Login
          </Link>
          <Link
            href={"/free-predictions"}
            className="z-10 py-1 hover:text-yellow-600 md:hover:scale-110 lg:w-1/3 text-center transition-all duration-200"
            style={smTextShadow}
          >
            Predictions
          </Link>
        </div>
      </div>
    </main>
  );
}
