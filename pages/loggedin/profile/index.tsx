import { verifyToken } from "@/utils/jwt.config";
import type { GetServerSideProps } from "next";
import type { JwtPayload } from "jsonwebtoken";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/layout/header";
import ButtonRed from "@/components/UI/buttonRed";
import toast from "react-hot-toast";
import { ax } from "@/database/axios.config";
import { UserType } from "@/utils/types";
import PwdConfirmModal from "@/components/modals/pwdConfirmModal";

interface ProfilePagePropsType {
  user: UserType;
}

export default function ProfilePage({ user }: ProfilePagePropsType) {
  const router = useRouter(),
    inputClass = "rounded-sm px-1 shadow-sm shadow-gray-600",
    [form, setForm] = useState({
      username: user.username,
      cnpj: user.cnpj,
      email: user.email,
      contactPhone: user.contactPhone,
      address: user.address,
    });
  const [showModal, setShowModal] = useState(false);
  const titleModal = "Confirm your password to change the e-mail";

  useEffect(() => {
    console.log(user);
    if (!user) {
      console.log("There is no user!");
      router.push("/login");
      return;
    }
    return;
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

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

  async function handleSubmitNoEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (user.email != form.email) {
      setShowModal(true);
      return;
    }
    try {
      const loading = toast.loading("Updating...");
      const updUser = await ax.post(`/user/edit/${user._id}`, form);
      console.log(updUser);
      toast.success("Informations updated!");
      toast.dismiss(loading);
    } catch (err) {
      console.log(err);
      toast.error("An error occured when trying to update the informations.");
    }
  }

  async function handleSubmitEmailChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setShowModal(false);
    const confirmFormData = new FormData(e.currentTarget);
    const confirmFormValues = Object.fromEntries(confirmFormData.entries());
    const formData = { ...form, ...confirmFormValues };
    console.log("formData:", formData);
    try {
      if (!confirmFormValues.pwd) {
        toast.error("Insert a password.");
        return;
      }
      const loading = toast.loading("Updating...");
      setTimeout(() => {
        toast.dismiss(loading);
      }, 5000);
      const updUser = await ax.post(`/user/edit/${user._id}`, formData);
      console.log(updUser);
      toast.success("Informations updated!");
    } catch (err) {
      console.log(err);
      toast.error("An error occurred when trying to update the information.");
    }
  }

  // async function handleChangePwd() {
  //   try {
  //     const addChangeId = await createChangeId(user._id);
  //     const sendChangePwdEmail = await sendPwdUpdateEmail(
  //       user._id,
  //       addChangeId.changeId
  //     );
  //     console.log(addChangeId);
  //     console.log(sendChangePwdEmail);
  //     toast.success(`Sent e-mail for changing password to ${user.email}.`);
  //   } catch (err) {
  //     console.log(err);
  //     toast.error("An error occured when trying to update the informations.");
  //   }
  // }

  return (
    <div className="min-h-screen relative">
      <Header user={user}></Header>
      <PwdConfirmModal
        showModal={showModal}
        setShowModal={setShowModal}
        title={titleModal}
        textBtn="Confirm"
        handleSubmitPwdConfirmForm={handleSubmitEmailChange}
      />
      <main className="flex flex-col items-center py-8 md:py-16 lg:py-12">
        <h1 className="text-4xl font-bold mb-2 mt-6 font-serif px-4 pb-2 lg:px-32 lg:border-b lg:border-black lg:mt-0">
          Profile
        </h1>
        <section id="userInfos" className="relative">
          <form className="flex py-8 gap-4" onSubmit={handleSubmitNoEmail}>
            <div className="flex flex-col font-semibold gap-8 lg:gap-6">
              <label htmlFor="username">Username:</label>
              <label htmlFor="email">Email:</label>
              <label htmlFor="address">Address:</label>
              <label htmlFor="cnpj">CNPJ:</label>
              <label htmlFor="contactPhone">Phone:</label>
            </div>
            <div className="flex flex-col gap-8 lg:gap-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  id="username"
                  name="username"
                  className={inputClass}
                  value={form.username}
                  onChange={handleChange}
                />
              </div>
              <div className="flex gap-2 italic">
                <input
                  type="text"
                  id="email"
                  name="email"
                  className={inputClass}
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="address"
                  name="address"
                  className={inputClass}
                  value={form.address}
                  onChange={handleChange}
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="cnpj"
                  name="cnpj"
                  className={inputClass}
                  value={form.cnpj}
                  onChange={handleChange}
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="contactPhone"
                  name="contactPhone"
                  className={inputClass}
                  value={form.contactPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex text-lg justify-center mb-4 underline font-semibold transition-all hover:text-yellow-700 hover:border-yellow-700 hover:cursor-pointer lg:absolute lg:py-12 lg:border-l-2 lg:border-black lg:no-underline lg:px-2 lg:right-[-100px] lg:bottom-[25%] lg:text-base">
              <button type="submit">Save</button>
            </div>
          </form>
        </section>
        <div className="flex flex-col justify-center items-center gap-8 pt-2 lg:flex-row">
          <div
            className="text-indigo-800 transition-all underline hover:cursor-pointer hover:text-yellow-600 hover:duration-300"
            // onClick={handleChangePwd}
          >
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
