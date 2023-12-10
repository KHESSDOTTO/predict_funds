import { verifyToken } from "@/utils/jwt.config";
import type { GetServerSideProps } from "next";
import type { JwtPayload } from "jsonwebtoken";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/layout/header";
import ButtonRed from "@/components/UI/buttonRed";
import toast from "react-hot-toast";
import { ax } from "@/database/axios.config";

export default function ProfilePage({ user }: any) {
  const router = useRouter(),
    inputClass = "rounded-md px-1 border-2 border-black box-border",
    [form, setForm] = useState({
      username: user.username,
      cnpj: user.cnpj,
      email: user.email,
      contactPhone: user.contactPhone,
      address: user.address,
      password: user.password,
    });

  useEffect(() => {
    console.log(user);
    if (!user) {
      console.log("There is no user!");
      router.push("/login");
      return;
    }
    return;
  }, []);

  async function handleLogout() {
    try {
      await ax.post("/user/logout");
      toast.success("Logged out.");
      router.push("/");
    } catch (err) {
      console.log(err);
      toast.error("Error logging out.");
    }
  }

  return (
    <div className="min-h-screen">
      <Header user={user}></Header>
      <main className="flex flex-col items-center py-8 md:py-16 lg:py-12">
        <h1 className="text-4xl font-bold mb-4 font-serif px-4 pb-2 lg:px-32 lg:border-b lg:border-black">
          Profile
        </h1>
        <section id="userInfos" className="flex py-8 gap-4">
          <div className="flex flex-col font-semibold gap-8 lg:gap-6">
            <label htmlFor="username">Username:</label>
            <label htmlFor="email" className="pt-1">
              Email:
            </label>
            <label htmlFor="address" className="pt-1">
              Address:
            </label>
            <label htmlFor="cnpj" className="pt-1">
              CNPJ:
            </label>
            <label htmlFor="contactPhone" className="pt-1">
              Phone:
            </label>
          </div>
          <div className="flex flex-col gap-8 lg:gap-6">
            <div className="flex gap-2">
              <input
                type="text"
                id="username"
                name="username"
                className={inputClass}
                value={form.username}
              />
            </div>
            <div className="flex gap-2 italic">
              <input
                type="text"
                id="email"
                name="email"
                style={{ color: "rgb(125, 125, 125" }}
                className={inputClass}
                value={form.email}
                disabled
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                id="address"
                name="address"
                className={inputClass}
                value={form.address}
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                className={inputClass}
                value={form.cnpj}
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                id="contactPhone"
                name="contactPhone"
                className={inputClass}
                value={"+" + form.contactPhone}
              />
            </div>
          </div>
        </section>
        <div className="flex flex-col justify-center items-center gap-8 pt-2 lg:flex-row lg:gap-24">
          <div className="text-indigo-800 transition-all underline hover:text-indigo-600 hover:cursor-pointer hover:text-yellow-600 hover:duration-300">
            Redefinir Senha
          </div>
          <div onClick={handleLogout}>
            <ButtonRed>Log out</ButtonRed>
          </div>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.loggedInUser;
  let user: string | false | JwtPayload = false;
  if (token) {
    user = verifyToken(token);
  }
  return {
    props: {
      user,
    },
  };
};
