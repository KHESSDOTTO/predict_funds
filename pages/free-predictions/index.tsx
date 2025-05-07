import TitleComponent from "@/components/UI/titleComponent";
import Link from "next/link";
import { useState } from "react";

export default function FreePredictions() {
  const [chartsData, setChartsData] = useState({
    "Renda Fixa": [],
    Multimercado: [],
    Ações: [],
  });
  const [controlForm, setControlForm] = useState({
    weeksBack: 8,
    weeksForward: 4,
  });
  const linkClass =
    "hover:text-yellow-600 lg:hover:scale-110 transition-all duration-200";

  return (
    <>
      <header className="bg-black py-6 border-b-2 border-gray-500 flex justify-around">
        <Link href={"/"} className={linkClass}>
          Home
        </Link>
        <Link href={"/signup"} className={linkClass}>
          Sign up
        </Link>
        <Link href={"/login"} className={linkClass}>
          Login
        </Link>
      </header>
      <main className="min-h-screen px-6 bg-black">
        <div className="py-6">
          <div>
            <TitleComponent htmlTag="h1">My title</TitleComponent>
          </div>
          <div>My description</div>
        </div>
        <div>
          <p>Here goes all predictions:</p>
          {Object.keys(chartsData).map((currKey) => {
            return <p>{currKey}</p>;
          })}
        </div>
      </main>
    </>
  );
}
