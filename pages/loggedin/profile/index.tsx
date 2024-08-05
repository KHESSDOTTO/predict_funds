import { verifyToken } from "@/utils/jwt.config";
import type { GetServerSideProps } from "next";
import type { JwtPayload } from "jsonwebtoken";
import React, { useEffect, useRef, useState, useContext } from "react";
import { useRouter } from "next/router";
import Header from "@/components/layout/header";
import ButtonRed from "@/components/UI/buttonRed";
import toast from "react-hot-toast";
import { ax } from "@/database/axios.config";
import { UserType } from "@/utils/types";
import PwdConfirmModal from "@/components/modals/pwdConfirmModal";
import { UserContext } from "@/contexts/UserContext";

interface ProfilePagePropsType {
  user: UserType;
}

export default function ProfilePage({ user }: ProfilePagePropsType) {
  const router = useRouter();
  const userContext = useContext(UserContext);

  const inputClass =
      "rounded-sm px-2 shadow-sm shadow-gray-600 text-black lg:w-[60vw]",
    [form, setForm] = useState({
      username: user.username,
      cnpj: user.cnpj,
      email: user.email,
      contactPhone: user.contactPhone,
      address: user.address,
    });
  const [showModal, setShowModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
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
      userContext.setUser(null);
      userContext.setCenarios([]);
      await ax.post("/user/logout");
      toast.success("Logged out.");
      router.push("/");
    } catch (err) {
      console.log(err);
      toast.error("Error logging out.");
    }
  }

  function handleSubmitOutside() {
    const fakeSubmitEvent: React.FormEvent<HTMLFormElement> = {
      ...new Event("submit", { bubbles: true, cancelable: true }),
      currentTarget: formRef.current,
      target: formRef.current,
      preventDefault: () => {},
    } as unknown as React.FormEvent<HTMLFormElement>;
    handleSubmitNoEmail(fakeSubmitEvent);
  }

  async function handleSubmitNoEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (user.email != form.email) {
      setShowModal(true);
      return;
    }
    const loading = toast.loading("Updating...");
    try {
      const updUser = await ax.post(`/user/edit/${user._id}`, form);
      // console.log(updUser);
      toast.success("Informations updated!");
    } catch (err) {
      console.log(err);
      toast.error("An error occured when trying to update the informations.");
    }
    toast.dismiss(loading);
  }

  async function handleSubmitEmailChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setShowModal(false);
    const confirmFormData = new FormData(e.currentTarget);
    const confirmFormValues = Object.fromEntries(confirmFormData.entries());
    const formData = { ...form, ...confirmFormValues };
    // console.log("formData:", formData);
    if (!confirmFormValues.pwd) {
      toast.error("Insert a password.");
      return;
    }
    const loading = toast.loading("Updating...");
    try {
      await ax.post(`/user/edit/${user._id}`, formData);
      toast.success("Informations updated!");
    } catch (err) {
      console.log(err);
      toast.error("An error occurred when trying to update the information.");
    }
    toast.dismiss(loading);
  }

  async function handleChangePwd() {
    const loading = toast.loading("Sending e-mail...");
    try {
      await ax.post("/user/change-pwd-email", { _id: user._id });
      toast.success(`Sent e-mail for changing password to ${user.email}.`);
    } catch (err) {
      console.log(err);
      toast.error("An error occured when trying to update the informations.");
    }
    toast.dismiss(loading);
  }

  return (
    <>
      <div className="min-h-screen relative bg-gradient-to-br bg-fixed from-black to-green-900 from-25% text-white">
        <Header user={user}></Header>
        <PwdConfirmModal
          showModal={showModal}
          setShowModal={setShowModal}
          title={titleModal}
          textBtn="Confirm"
          handleSubmitPwdConfirmForm={handleSubmitEmailChange}
        />
        <main className="flex flex-col items-center py-8 md:py-16 lg:py-12">
          <h1 className="text-3xl font-bold my-6 font-serif px-4 pb-2 lg:w-[90vw] border-b lg:border-white lg:mt-0 lg:mb-12">
            Profile
          </h1>
          <div className="flex flex-col items-center lg:items-start">
            <section id="userInfos" className="relative lg:px-16">
              <form
                ref={formRef}
                className="flex py-8 gap-4 lg:gap-12"
                onSubmit={handleSubmitNoEmail}
              >
                <div className="flex flex-col gap-8 lg:gap-12 lg:items-end">
                  <label htmlFor="username">Username:</label>
                  <label htmlFor="email">Email:</label>
                  <label htmlFor="address">Address:</label>
                  <label htmlFor="cnpj">CNPJ:</label>
                  <label htmlFor="contactPhone">Phone:</label>
                </div>
                <div className="flex flex-col gap-8 lg:gap-12">
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
                      className={inputClass + " bg-gray-400 italic w-full"}
                      value={form.cnpj}
                      onChange={handleChange}
                      disabled
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
                <div className="hidden lg:flex text-lg justify-center mb-4 underline font-semibold transition-all duration-300 hover:text-yellow-700 hover:border-yellow-700 hover:cursor-pointer lg:absolute lg:py-24 lg:border-l-2 lg:border-white lg:no-underline lg:px-2 lg:right-[-30px] lg:bottom-[10%] lg:text-base">
                  <button type="submit">Save</button>
                </div>
              </form>
            </section>
            <div className="flex justify-center items-center mb-4 underline font-semibold transition-all hover:text-yellow-700 hover:border-yellow-700 hover:cursor-pointer lg:absolute lg:py-12 lg:border-l-2 lg:hidden">
              <button onClick={handleSubmitOutside}>Save</button>
            </div>
            <div className="flex flex-col w-[100vw] justify-center items-center gap-8 pt-2 lg:flex-row lg:absolute lg:bottom-12 lg:left-0">
              <div
                className="text-indigo-100 transition-all underline hover:cursor-pointer hover:text-yellow-600 hover:duration-300 hover:-translate-y-px"
                onClick={handleChangePwd}
              >
                Change Password
              </div>
              <div onClick={handleLogout}>
                <ButtonRed shadowColor="white" shadowSize="md">
                  Log out
                </ButtonRed>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
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
