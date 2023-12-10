import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-8 md:p-16 lg:p-24">
      <h1 className="font-bold text-5xl text-center font-serif lg:text-6xl">
        Predict Funds
      </h1>
      <div className="flex flex-col gap-8 w-10/12 items-center text-xl font-semibold justify-around md:flex-row md:text-2xl md-flex-row md:underline">
        <Link
          href={"/signup"}
          className="py-1 px-4 hover:text-yellow-600 md:hover:text-3xl hover:text-lg transition-all"
        >
          Sign up
        </Link>
        <Link
          href={"/login"}
          className="py-1 px-4 hover:text-yellow-600 hover:text-3xl transition-all"
        >
          Login
        </Link>
      </div>
    </main>
  );
}
