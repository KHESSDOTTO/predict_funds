import { useState } from "react";
import { ax } from "@/database/axios.config";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Link from "next/link";
import ButtonIndigo from "@/components/UI/buttonIndigo";
import BackLink from "@/components/UI/backLink";

export default function LoginPage() {
  const [form, setForm] = useState({
      username: "",
      password: "",
    }),
    router = useRouter();

  // css - classes
  const mainClass =
      "min-h-screen px-16 pt-12 text-lg flex flex-col justify-around md:grid md:grid-rows-5 md:pb-8 md:pt-2",
    h1Class =
      "font-bold py-auto text-5xl flex flex-col justify-end items-center font-serif",
    formClass =
      "px-auto row-span-3 flex flex-col justify-center items-center rounded-sm gap-8 md:pt-16",
    divClass = "flex flex-col gap-2 align-center justify-center w-72",
    labelClass = "text-center lg:text-left lg:indent-1",
    inputClass = "rounded-xl px-2 shadow-md shadow-gray-400/50";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const loading = toast.loading("Logging in...");
    try {
      const response = await ax.post("/user/login", form);
      console.log(response);
      toast.success("Successfully logged in!");
      router.push("/loggedin/home");
    } catch (err) {
      console.log(err);
      toast.error("Couldn't complete the log in.");
    }
    toast.dismiss(loading);
  }

  return (
    <>
      <BackLink />
      <main className={mainClass}>
        <h1 className={h1Class}>Login</h1>
        <form className={formClass} onSubmit={handleSubmit}>
          <div className={divClass}>
            <label className={labelClass}>Usuário</label>
            <input
              className={inputClass}
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
            ></input>
          </div>
          <div className={divClass}>
            <label className={labelClass}>Senha</label>
            <input
              className={inputClass}
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            ></input>
          </div>
          <div className="w-32 text-center">
            <ButtonIndigo>Log in</ButtonIndigo>
          </div>
        </form>
        <div className="flex flex-col justify-end pb-4 items-center text-sm italic text-center md:pb-4">
          <p className="italic text-sm text-center">Não tem uma conta?</p>
          <Link
            href={"/signup"}
            className="transition-all duration-200 text-indigo-700 font-semibold w-fit hover:underline hover:text-yellow-700 hover:underline hover:text-indigo-600"
          >
            Sign Up
          </Link>
        </div>
      </main>
    </>
  );
}
