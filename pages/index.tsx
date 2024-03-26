import Link from "next/link";

export default function Home() {
  const lgTextShadow = { textShadow: "2px 3px 3px rgba(200,200,200,0.9)" };
  const smTextShadow = { textShadow: "2px 3px 3px rgba(0,0,0,0.9)" };

  return (
    <>
      <main className="text-white bg-cover flex min-h-screen flex-col items-center justify-around p-8 md:p-16 lg:p-16 bg-landing">
        <h1
          className="font-bold text-5xl text-center font-serif border-black py-2 px-4"
          style={lgTextShadow}
        >
          <span className="hidden lg:block">P R E D I C T</span>
          <span className="lg:hidden">PREDICT</span>
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
    </>
  );
}
