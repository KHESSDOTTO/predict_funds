import { ax } from "@/database/axios.config";
import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import ButtonIndigo from "@/components/UI/buttonIndigo";
import Link from "next/link";
import BackLink from "@/components/UI/backLink";

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
      "bg-gray-900 text-white min-h-screen px-auto pt-8 pb-8 flex flex-col justify-around gap-8 text-lg md:grid md:grid-rows-6 md:justify-stretch md:px-16",
    h1Class =
      "text-center font-bold text-5xl mt-6 flex justify-center items-center gap-4 font-serif py-4 lg:mx-16 lg:w-10/12 lg:justify-start lg:mt-4",
    formClass = "px-4 py-2 flex flex-col justify-around gap-4 md:row-span-5",
    divClass = "flex flex-col",
    inputClass =
      "rounded-md border border-gray-400 px-1 shadow-white/30 shadow-lg";
  const lgTextShadow = { textShadow: "2px 2px 1px rgba(200,200,200,0.4)" };
  const smTextShadow = { textShadow: "2px 3px 3px rgba(0,0,0,0.9)" };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let newVal = e.target.value;
    if (e.target.name === "cnpj") {
      const cnpjNum = e.target.value.replaceAll(/[.\/-]/gm, ""),
        lenNum = cnpjNum.length,
        len = e.target.value.length,
        specialChars = [".", "/", "-"];
      if (!specialChars.includes(e.target.value[len - 2])) {
        switch (lenNum) {
          case 3:
            newVal =
              e.target.value.slice(0, lenNum - 1) +
              "." +
              e.target.value.slice(lenNum - 1, lenNum);
            break;
          case 6:
            newVal =
              e.target.value.slice(0, lenNum) +
              "." +
              e.target.value.slice(lenNum, lenNum + 1);
            break;
          case 9:
            newVal =
              e.target.value.slice(0, lenNum + 1) +
              "/" +
              e.target.value.slice(lenNum + 1, lenNum + 2);
            break;
          case 13:
            newVal =
              e.target.value.slice(0, lenNum + 2) +
              "-" +
              e.target.value.slice(lenNum + 2, lenNum + 3);
            break;
          case 15:
            newVal = e.target.value.slice(0, len - 1);
            break;
          default:
            break;
        }
      }
      setForm({ ...form, [e.target.name]: newVal });
    } else if (e.target.name === "contactPhone") {
      const len = e.target.value.length,
        lastChar = e.target.value[len - 1];
      if (len === 1 && lastChar !== "+") {
        newVal = "+" + newVal;
      }
      if (len > 14) {
        newVal = e.target.value.slice(0, len - 1);
      }
      setForm({ ...form, [e.target.name]: newVal });
    } else {
      setForm({ ...form, [e.target.name]: newVal });
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const clone = {
      ...form,
      contactPhone: form.contactPhone.replaceAll(/[+]/gm, ""),
    };
    if (clone.password !== clone.passwordConfirm) {
      console.log(
        "The 'password confirm' field does not match the 'password' field."
      );
      toast.error(
        "The 'password confirm' field does not match the 'password' field."
      );
      return;
    }
    const loading = toast.loading("Creating user...");
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
    toast.dismiss(loading);
  }

  return (
    <>
      <BackLink color="white" />
      <main className={mainClass}>
        <h1 className={h1Class} style={lgTextShadow}>
          Sign up
        </h1>
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
              placeholder=" xx.xxx.xxx/xxxx-xx"
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
              placeholder=" example@ex.com"
            ></input>
          </div>
          <div className={divClass}>
            <label htmlFor="contactPhone">
              Telefone de contato{" "}
              <small className="italic">
                (com DD e código país: Brasil "+55")
              </small>
            </label>
            <input
              className={inputClass}
              id="contactPhone"
              name="contactPhone"
              type="text"
              value={form.contactPhone}
              onChange={handleChange}
              placeholder=" +xxxxxxxxxxxxx"
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
            <label htmlFor="password">
              Senha{" "}
              <small className="italic">
                (mínimo 8 dígitos: incluir letras maíusculas, minúsculas,
                números e caracteres especiais)
              </small>
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
          <div className="self-center">
            <ButtonIndigo>Create user</ButtonIndigo>
          </div>
        </form>
      </main>
    </>
  );
}
