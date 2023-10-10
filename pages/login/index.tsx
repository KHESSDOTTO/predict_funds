import { useState } from "react";
import { ax } from "@/database/axios_config";
import { useRouter } from "next/router";

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
      "px-32 py-16 row-span-4 flex flex-col justify-start items-center rounded-sm gap-8",
    divClass = "flex flex-col gap-2 align-center justify-center w-72",
    labelClass = "indent-1",
    inputClass = "rounded-md",
    btnClass =
      "rounded-md bg-blue-300 w-32 px- py-1 mt-8 border-2 border-blue-600";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await ax.post("/user/login", form);
      console.log(response);
      router.push("/loggedin/home");
    } catch (err) {
      console.log(err);
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
    </main>
  );
}
