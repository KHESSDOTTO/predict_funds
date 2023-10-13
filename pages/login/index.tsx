import { useState } from "react";
import { ax } from "@/database/axios.config";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({
      username: "",
      password: "",
    }),
    router = useRouter();

  // css - classes
  const mainClass = "min-h-screen px-16 pt-2 pb-8 grid grid-rows-5 text-lg",
    h1Class = "font-bold py-auto text-5xl flex justify-center items-end",
    formClass =
      "px-32 pt-16 row-span-3 flex flex-col justify-start items-center rounded-sm gap-8",
    divClass = "flex flex-col gap-2 align-center justify-center w-72",
    labelClass = "indent-1",
    inputClass = "rounded-md",
    btnClass = "rounded-md bg-blue-300 w-32 py-1 mt-8 border-2 border-blue-600";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await ax.post("/user/login", form);
      console.log(response);
      toast.success("Successfully logged in!");
      router.push("/loggedin/home");
    } catch (err) {
      console.log(err);
      toast.error("Couldn't complete the log in.");
    }
  }

  return (
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
        <button type="submit" className={btnClass}>
          Log in
        </button>
      </form>
      <div className="flex flex-col justify-center items-center text-sm italic text-center">
        <p className="italic text-sm text-center">Não tem uma conta?</p>
        <Link
          href={"/signup"}
          className="text-indigo-700 font-semibold w-fit hover:underline hover:text-base hover:text-indigo-600 transition-all"
        >
          Sign Up
        </Link>
      </div>
    </main>
  );
}
