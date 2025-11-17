import { verifyToken } from "@/utils/jwt.config";
import type { GetServerSideProps } from "next";
import type { JwtPayload } from "jsonwebtoken";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Header from "@/components/layout/header";
import ButtonRed from "@/components/UI/buttonRed";
import PwdConfirmModal from "@/components/modals/pwdConfirmModal";
import { useUser } from "@/contexts/userContext";
import LogoPredict from "@/components/UI/logoPredict";
import type {
  ProfileFormType,
  ProfilePagePropsType,
} from "@/utils/types/pageTypes/profileTypes";
import {
  handleSubmitOutside,
  handleSubmitNoEmail,
  handleChangePwd,
  doSubmitEmailChange,
} from "@/utils/functions/pageFunctions/loggedInProfileFunctions";
import ProfileForm from "@/components/pageForms/profileForm";
import Helpers from "@/utils/functions/helpers";
import TitleComponent from "@/components/UI/titleComponent";

export default function ProfilePage({ user }: ProfilePagePropsType) {
  const router = useRouter();
  const userContext = useUser();
  const [showModal, setShowModal] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const titleModal = "Confirm your password to change the e-mail";
  const [form, setForm] = useState<ProfileFormType>({
    username: user.username,
    cnpj: user.cnpj,
    email: user.email,
    contactPhone: user.contactPhone,
    address: user.address,
  });
  const profileFormArgs = {
    user,
    formRef,
    form,
    setForm,
    setShowModal,
    handleSubmitNoEmail,
  };
  const handleSubmitOutsideArgs = {
    user,
    form,
    setShowModal,
    formRef,
    handleSubmitNoEmail,
  };

  useEffect(() => {
    console.log(user);
    if (!user) {
      console.log("There is no user!");
      router.push("/login");

      return;
    }

    return () => {
      toast.dismiss();
    };
  }, []);

  return (
    <div className="bg-black/90">
      <div className="min-h-screen relative text-white">
        <Header />
        <PwdConfirmModal
          showModal={showModal}
          setShowModal={setShowModal}
          title={titleModal}
          textBtn="Confirm"
          handleSubmitPwdConfirmForm={(e) =>
            doSubmitEmailChange({ e, setShowModal, form, user })
          }
        />
        <main className="flex flex-col items-center py-8 px-8 lg:pt-12 lg:pb-24">
          <div className="w-full mt-6 mb-4 lg:mb-12">
            <LogoPredict bold={false} />
          </div>
          <div className="flex justify-center w-full">
            <TitleComponent htmlTag="h2">Profile</TitleComponent>
          </div>
          <div className="flex flex-col items-center lg:items-start">
            <section id="userInfos" className="relative lg:px-16 lg:mt-2">
              <ProfileForm {...profileFormArgs} />
            </section>
            <div className="flex justify-center items-center mb-4 underline font-semibold transition-all hover:text-yellow-700 hover:border-yellow-700 hover:cursor-pointer lg:absolute lg:py-12 lg:border-l-2 lg:hidden">
              <button
                onClick={() => handleSubmitOutside(handleSubmitOutsideArgs)}
              >
                Save
              </button>
            </div>
            <div className="flex flex-col w-[100vw] justify-center items-center gap-8 pt-2 lg:flex-row lg:absolute lg:bottom-12 lg:left-0">
              <div
                className="text-gray-300 transition-all border-white/50 px-2 pb-1 hover:cursor-pointer hover:text-yellow-600 hover:duration-200 hover:scale-105"
                onClick={() => handleChangePwd({ user })}
              >
                Change Password
              </div>
              <div onClick={() => Helpers.doLogout({ userContext, router })}>
                <ButtonRed shadowColor="white/30" shadowSize="md">
                  Log out
                </ButtonRed>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.loggedInUser;
  const loginUrl = "/login";
  let user: string | false | JwtPayload = false;

  if (token) {
    user = verifyToken(token);
  }

  if (!user) {
    return {
      redirect: {
        destination: loginUrl,
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
};
