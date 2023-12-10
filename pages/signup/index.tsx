import { ax } from "@/database/axios.config";
import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import ButtonIndigo from "@/components/UI/buttonIndigo";

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
      "min-h-screen px-auto pt-8 pb-8 flex flex-col justify-around gap-8 text-lg md:grid md:grid-rows-6 md:justify-stretch md:px-16",
    h1Class =
      "text-center font-bold text-5xl flex flex-col justify-center font-serif py-4 md:text-left md:mx-4 md:indent-8 md:w-10/12 lg:indent-24",
    formClass = "px-4 py-2 flex flex-col justify-around gap-4 md:row-span-5",
    divClass = "flex flex-col gap-2",
    inputClass = "rounded-md border border-gray-400";

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
            CNPJ (somente números)
          </label>
          <input
            className={inputClass}
            id="cnpj"
            name="cnpj"
            type="text"
            value={form.cnpj}
            onChange={handleChange}
            placeholder="  xx.xxx.xxx/xxxx-xx"
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
            placeholder="  example@ex.com"
          ></input>
        </div>
        <div className={divClass}>
          <label htmlFor="contactPhone" className="indent-2">
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
            Senha{" "}
            <small className="italic">
              (mínimo 8 dígitos: incluir letras maíusculas, minúsculas, números
              e caracteres especiais)
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
        <div className="self-center">
          <ButtonIndigo>Create user</ButtonIndigo>
        </div>
      </form>
    </main>
  );
}
