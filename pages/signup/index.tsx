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
    mainClass = "min-h-screen px-16 pt-2 pb-8 grid grid-rows-5 text-lg",
    h1Class =
      "indent-8 font-bold py-auto text-4xl flex flex-col justify-center",
    formClass = "px-4 py-2 row-span-4 flex flex-col justify-around",
    divClass = "flex flex-col gap-2",
    inputClass = "rounded-md",
    btnClass =
      "rounded-md bg-blue-300 w-64 px-4 py-1 border-2 border-blue-600 self-center mt-2";

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
          <label htmlFor="username">Nome de usuário</label>
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
          <label htmlFor="cnpj">CNPJ</label>
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
          <label htmlFor="email">E-mail</label>
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
          <label htmlFor="contactPhone">Telefone de contato</label>
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
          <label htmlFor="address">Endereço</label>
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
          <label htmlFor="password">Senha</label>
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
          <label htmlFor="passwordConfirm">Confirmar Senha</label>
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
