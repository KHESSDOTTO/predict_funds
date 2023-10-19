import { ax } from "@/database/axios.config";
import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter(),
    [form, setForm] = useState({
      username: "",
      cnpj: "",
      email: "",
      contactPhone: "",
      address: "",
      password: "",
      passwordConfirm: "",
    }),
    mainClass =
      "min-h-screen px-auto pt-8 pb-8 grid grid-rows-6 justify-around gap-8 text-lg md:grid md:grid-rows-6 md:justify-stretch md:px-16",
    h1Class =
      "text-center font-bold text-5xl flex flex-col justify-center font-serif md:text-left md:mx-4 md:indent-8 md:w-10/12 lg:indent-24",
    formClass = "px-4 py-2 flex flex-col justify-around gap-4 md:row-span-5",
    divClass = "flex flex-col gap-2",
    inputClass = "rounded-md",
    btnClass =
      "rounded-md bg-gradient-to-b from-indigo-700 to-indigo-400 text-white font-semibold w-64 px-4 py-1 border-2 border-blue-600 self-center mt-2";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const clone = { ...form };
    if (clone.password !== clone.passwordConfirm) {
      console.log(
        "The 'password confirm' field does not match the 'password' field."
      );
      return;
    }
    try {
      await ax.post("/user/create", { ...clone });
      toast.success("User created successfully!");
      router.push("/login");
    } catch (err) {
      console.log(err);
      toast.error(
        "Error creating the user. Please, check the informations provided."
      );
    }
  }

  return (
    <main className={mainClass}>
      <h1 className={h1Class}>Sign up</h1>
      <form className={formClass} onSubmit={handleSubmit}>
        <div className={divClass}>
          <label htmlFor="username" className="indent-2">
            Nome de usuário
          </label>
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
          <label htmlFor="cnpj" className="indent-2">
            CNPJ
          </label>
          <input
            className={inputClass}
            id="cnpj"
            name="cnpj"
            type="text"
            value={form.cnpj}
            onChange={handleChange}
          ></input>
        </div>
        <div className={divClass}>
          <label htmlFor="email" className="indent-2">
            E-mail
          </label>
          <input
            className={inputClass}
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          ></input>
        </div>
        <div className={divClass}>
          <label htmlFor="contactPhone" className="indent-2">
            Telefone de contato
          </label>
          <input
            className={inputClass}
            id="contactPhone"
            name="contactPhone"
            type="text"
            value={form.contactPhone}
            onChange={handleChange}
          ></input>
        </div>
        <div className={divClass}>
          <label htmlFor="address" className="indent-2">
            Endereço
          </label>
          <input
            className={inputClass}
            id="address"
            name="address"
            type="text"
            value={form.address}
            onChange={handleChange}
          ></input>
        </div>
        <div className={divClass}>
          <label htmlFor="password" className="indent-2">
            Senha
          </label>
          <input
            className={inputClass}
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          ></input>
        </div>
        <div className={divClass}>
          <label htmlFor="passwordConfirm" className="indent-2">
            Confirmar Senha
          </label>
          <input
            className={inputClass}
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            value={form.passwordConfirm}
            onChange={handleChange}
          ></input>
        </div>
        <button type="submit" className={btnClass}>
          Cadastrar
        </button>
      </form>
    </main>
  );
}
