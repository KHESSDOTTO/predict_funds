import { ax } from "@/database/axios.config";
import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import ButtonIndigo from "@/components/UI/buttonIndigo";
import BackLink from "@/components/UI/backLink";
import { SignUpFormType } from "@/utils/types/pageTypes/signupTypes";
import { handleChangeSignUpForm, handleSubmitSignUpForm } from "@/utils/functions/pageFunctions/signupFunctions";

export default function SignUpPage() {
  const router = useRouter(),
    [form, setForm] = useState<SignUpFormType>({
      username: "",
      cnpj: "",
      email: "",
      contactPhone: "",
      address: "",
      password: "",
      passwordConfirm: "",
    }),
    mainClass =
      "text-white min-h-screen px-auto pt-8 pb-8 flex flex-col justify-around gap-8 lg:grid lg:grid-rows-6 lg:justify-stretch lg:px-12",
    h1Class =
      "mx-16 text-center text-4xl mt-6 border-b flex border-white justify-center items-center py-4 lg:w-10/12 lg:justify-start lg:mt-4 lg:px-4 lg:border-b-2 lg:text-4xl",
    formClass = "px-10 py-2 flex flex-col justify-around gap-4 md:row-span-5",
    divClass = "flex flex-col gap-1",
    labelClass = "indent-1",
    inputClass =
      "rounded-md border border-gray-400 px-1 shadow-white/30 shadow-sm text-black";
  const lgTextShadow = { textShadow: "1px 1px 2px gray" };

  return (
    <div className="bg-gradient-to-br from-black via-[rgb(30,50,70)] from-25% lg:from-0% to-black">
      <BackLink color="white" />
      <main className={mainClass + " animate-fadeIn-l-r lg:animate-fadeIn"}>
        <h1 className={h1Class} style={lgTextShadow}>
          Sign up
        </h1>
        <form className={formClass} onSubmit={(e) => handleSubmitSignUpForm({ e, form, ax, router })}>
          <div className={divClass}>
            <label className={labelClass} htmlFor="username">
              Username
            </label>
            <input
              className={inputClass}
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={(e) => handleChangeSignUpForm({ e, setForm })}
            ></input>
          </div>
          <div className={divClass}>
            <label className={labelClass} htmlFor="cnpj">
              CNPJ
            </label>
            <input
              className={inputClass}
              id="cnpj"
              name="cnpj"
              type="text"
              value={form.cnpj}
              onChange={(e) => handleChangeSignUpForm({ e, setForm })}
              placeholder=" xx.xxx.xxx/xxxx-xx"
            ></input>
          </div>
          <div className={divClass}>
            <label className={labelClass} htmlFor="email">
              E-mail
            </label>
            <input
              className={inputClass}
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChangeSignUpForm({ e, setForm })}
              placeholder=" example@ex.com"
            ></input>
          </div>
          <div className={divClass}>
            <label className={labelClass} htmlFor="contactPhone">
              Contact phone{" "}
              <small className="italic">
                (With country code: Brasil "+55")
              </small>
            </label>
            <input
              className={inputClass}
              id="contactPhone"
              name="contactPhone"
              type="text"
              value={form.contactPhone}
              onChange={(e) => handleChangeSignUpForm({ e, setForm })}
              placeholder=" +xxxxxxxxxxxxx"
            ></input>
          </div>
          <div className={divClass}>
            <label className={labelClass} htmlFor="address">
              Address
            </label>
            <input
              className={inputClass}
              id="address"
              name="address"
              type="text"
              value={form.address}
              onChange={(e) => handleChangeSignUpForm({ e, setForm })}
            ></input>
          </div>
          <div className={divClass}>
            <label className={labelClass} htmlFor="password">
              Password{" "}
              <small className="italic">
                (At least 8 digits: include lowercase and uppercase letters,
                numbers and special characters)
              </small>
            </label>
            <input
              className={inputClass}
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={(e) => handleChangeSignUpForm({ e, setForm })}
            ></input>
          </div>
          <div className={divClass}>
            <label className={labelClass} htmlFor="passwordConfirm">
              Confirm Password
            </label>
            <input
              className={inputClass}
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              value={form.passwordConfirm}
              onChange={(e) => handleChangeSignUpForm({ e, setForm })}
            ></input>
          </div>
          <div className="self-center mt-6">
            <ButtonIndigo shadowSize="md" shadowColor="white">
              Create user
            </ButtonIndigo>
          </div>
        </form>
      </main>
    </div>
  );
}
