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
      "min-h-screen px-16 pt-12 flex flex-col justify-center lg:pb-8 lg:pt-6 lg:grid lg:grid-cols-10",
    h1Class =
      "py-auto text-4xl flex flex-col justify-end items-center mt-8 -mb-8",
    formClass =
      "px-auto row-span-3 flex flex-col justify-center items-center rounded-sm gap-8 lg:pt-8",
    divClass = "flex flex-col gap-1 align-center justify-center w-72",
    labelClass = "text-center lg:text-left lg:indent-1",
    inputClass = "rounded-lg px-2 shadow-md shadow-gray-400/50 text-black";
  // /css - classes
  const smTextShadow = { textShadow: "2px 2px 5px rgba(200,200,200,0.9)" };

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
    <>
      <div className="w-full h-full absolute top-0 left-0 bg-landing lg:bg-login z-0"></div>
      <div className="lg:hidden">
        <BackLink color="white" />
      </div>
      <div className="text-white z-1 relative bg-transparent animate-fadeIn lg:animate-fadeIn-l-r lg:from-black lg:bg-gradient-to-r lg:via-transparent lg:from-30% lg:to-transparent">
        <SendEmailModal
          showModal={showModal}
          setShowModal={setShowModal}
          title="Enter your information to receive the password recovery e-mail"
          textBtn="Send e-mail"
        />
        <div className="hidden lg:block">
          <BackLink color="white" />
        </div>
        <main className={mainClass}>
          <div className="flex flex-col justify-around items-center lg:col-start-1 lg:ml-24 lg:col-span-2 min-h-[95vh] lg:pt-12 lg:pb-8 lg:pt-6">
            <h1 className={h1Class} style={smTextShadow}>
              Login
            </h1>
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
              <div className="w-32 text-center lg:mt-8">
                <ButtonIndigo shadowSize="md" shadowColor="white">
                  Log in
                </ButtonIndigo>
              </div>
            </form>
            <div>
              <div className="flex flex-col justify-end pb-2 items-center text-sm italic text-center lg:pb-4">
                {/* <p className="italic text-sm text-center">Forgot my password: </p> */}
                <button
                  className="transition-all text-sm duration-200 italic font-semibold w-fit hover:underline hover:text-yellow-800 hover:underline hover:text-indigo-600 lg:mt-2"
                  onClick={sendPwdChangeEmail}
                >
                  Forgot Password
                </button>
              </div>
              <div className="flex flex-col justify-end pb-4 items-center text-sm italic text-center">
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
          </div>
        </main>
      </div>
    </>
  );
}
