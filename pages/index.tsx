import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-24">
      <h1 className="font-bold text-5xl">Predict Funds - Landing Page</h1>
      <div className="flex w-10/12 items-center text-2xl font-semibold underline justify-around">
        <Link
          href={"/signup"}
          className="py-1 px-4 hover:text-yellow-600 hover:text-3xl transition-all"
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
