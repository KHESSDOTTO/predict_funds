import { useState } from "react";
import { ax } from "@/database/axios.config";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Link from "next/link";
import ButtonIndigo from "@/components/UI/buttonIndigo";
import BackLink from "@/components/UI/backLink";
import SendEmailModal from "@/components/modals/sendEmailModal";

export default function LoginPage() {
  const [form, setForm] = useState({
      username: "",
      password: "",
    }),
    router = useRouter();
  const [showModal, setShowModal] = useState(false);

  // css - classes
  const mainClass =
      "min-h-screen px-16 pt-12 text-lg flex flex-col justify-around lg:grid lg:grid-rows-5 lg:pb-8 lg:pt-6",
    h1Class =
      "font-bold py-auto text-5xl flex flex-col justify-end items-center lg:text-6xl",
    formClass =
      "px-auto row-span-3 flex flex-col justify-center items-center rounded-sm gap-8 lg:pt-8",
    divClass = "flex flex-col gap-2 align-center justify-center w-72",
    labelClass = "text-center lg:text-left lg:indent-1",
    inputClass = "rounded-xl px-2 shadow-md shadow-gray-400/50 text-black";

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

  async function sendPwdChangeEmail() {
    setShowModal(true);
  }

  return (
    <div className="relative bg-[rgb(0,10,30)] text-white">
      <SendEmailModal
        showModal={showModal}
        setShowModal={setShowModal}
        title="Enter your information to receive the password recovery e-mail"
        textBtn="Send e-mail"
      />
      <BackLink color="black" />
      <main className={mainClass}>
        <h1 className={h1Class}>Login</h1>
        <form className={formClass} onSubmit={handleSubmit}>
          <div className={divClass}>
            <label className={labelClass}>Username</label>
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
            <label className={labelClass}>Password</label>
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
            <ButtonIndigo shadowSize="md" shadowColor="white">
              Log in
            </ButtonIndigo>
          </div>
        </form>
        <div>
          <div className="flex flex-col justify-end pb-4 items-center text-sm italic text-center md:pb-4">
            {/* <p className="italic text-sm text-center">Forgot my password: </p> */}
            <button
              className="transition-all duration-200 italic font-semibold w-fit hover:underline hover:text-yellow-800 hover:underline hover:text-indigo-600 lg:mt-2"
              onClick={sendPwdChangeEmail}
            >
              Forgot Password
            </button>
          </div>
          <div className="flex flex-col justify-end pb-4 items-center text-sm italic text-center md:pb-4">
            <p className="italic text-sm text-center">
              Don't have an account yet?
            </p>
            <Link
              href={"/signup"}
              className="transition-all duration-200 text-indigo-300 font-semibold w-fit hover:underline hover:text-yellow-800 hover:underline hover:text-indigo-600"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
