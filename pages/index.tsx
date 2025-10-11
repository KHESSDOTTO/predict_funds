import LogoPredict from "@/components/UI/logoPredict";
import styles from "./landing.module.css";
import Link from "next/link";

export default function Home() {
  const smTextShadow = { textShadow: "2px 3px 3px rgba(0,0,0,0.9)" };
  const linkClass =
    "z-10 py-1 hover:text-yellow-600 md:hover:scale-110 text-center transition-all duration-200";

  return (
    <main className="bg-landing bg-cover z-0 relative">
      <div className="text-white flex min-h-screen flex-col items-center justify-around p-8 z-20 lg:p-16 animate-fadeIn-l-r lg:animate-fadeIn">
        <h1 className="relative text-center z-10 p-8">
          <div className={styles.blackBlurTitle}></div>
          <div className="relative z-10">
            <LogoPredict bold={true} />
          </div>
        </h1>
        <div className="relative overflow-visible h-48 w-full text-xl lg:top-16 flex flex-col gap-6 lg:gap-24 lg:flex-row justify-center items-center font-semibold">
          <div className={styles.blackBlurLinks}></div>
          <Link href={"/about"} className={linkClass} style={smTextShadow}>
            About us
          </Link>
          <Link href={"/signup"} className={linkClass} style={smTextShadow}>
            Sign up
          </Link>
          <Link
            href={"/free-predictions"}
            className={linkClass}
            style={smTextShadow}
          >
            Predictions
          </Link>
          <Link href={"/login"} className={linkClass} style={smTextShadow}>
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
