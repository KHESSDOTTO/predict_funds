import { ax } from "@/database/axios.config";
import type { GetServerSideProps } from "next";
import { useState } from "react";
import toast from "react-hot-toast";

interface PwdChangePagePropsType {
  userId: string;
  changeId: string;
  user: {
    _id?: string;
    username?: string;
    email?: string;
    address?: string;
    cnpj?: string;
    contactPhone?: string;
    products?: string[];
    changeId?: string;
    createdAt?: Date;
    emailConfirm?: boolean;
    isActive?: boolean;
  };
}

export default function PwdChangePage({
  userId,
  changeId,
  user,
}: PwdChangePagePropsType) {
  const [pwdChangeForm, setPwdChangeForm] = useState({
    newPwd: "",
    confirmNewPwd: "",
  });
  const inputClass = "rounded-full px-4 py-1 text-black";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPwdChangeForm({ ...pwdChangeForm, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pwdChangeForm.newPwd !== pwdChangeForm.confirmNewPwd) {
      toast.error("Password and password confirm doesn't match.");
      return false;
    }
    const loading = toast.loading("Updating...");
    try {
      await ax.post(`/user/change-pwd/${userId}/${changeId}`, pwdChangeForm);
      toast.success("Password updated.");
    } catch (err) {
      console.log(err);
      toast.error("An error occured when trying to update your password.");
    }
    toast.dismiss(loading);
  }

  return (
    <div className="pb-2 flex flex-col items-center gap-4 lg:gap-12 min-h-screen px-12 justify-center bg-black text-white">
      <div className="lg:mx-[25%]">
        <h1 className="text-xl mb-2 text-center font-semibold py-2 px-4 border-b border-white">
          Change your password - CNPJ: {user.cnpj}
        </h1>
        <div className="text-sm relative lg:top-2 text-gray-400">
          * At least 8 characters, including lowercase and uppercase letters, numbers, special characters.
        </div>
      </div>
      <form
        id="pwdChangeForm"
        className="flex flex-col gap-8 lg:gap-12 items-center"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col justify-center lg:flex-row gap-2 lg:gap-2 items-center">
            <label className="text-center lg:text-left w-48">New Password</label>
            <input
              type="password"
              name="newPwd"
              id="newPwd"
              className={inputClass}
              value={pwdChangeForm.newPwd}
              onChange={handleChange}
            ></input>
          </div>
          <div className="flex flex-col justify-center lg:flex-row gap-2 lg:gap-2 items-center">
            <label className="text-center lg:text-left w-48">Confirm new Password</label>
            <input
              type="password"
              name="confirmNewPwd"
              id="confirmNewPwd"
              className={inputClass}
              value={pwdChangeForm.confirmNewPwd}
              onChange={handleChange}
            ></input>
          </div>
        </div>
        <button className="transition-all font-semibold p-1 border-b border-white duration-300 hover:scale-105 hover:text-yellow-700 hover:border-yellow-700">
          Update
        </button>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let userId = "",
    changeId = "";
  if (
    context.params &&
    typeof context.params.userId === "string" &&
    typeof context.params.changeId === "string"
  ) {
    userId = context.params.userId;
    changeId = context.params.changeId;
  }
  let user = {};
  try {
    const response = await ax.get(`/user/getById/${userId}`);
    user = response.data;
  } catch (err) {
    console.log("Error fetching the data (user):");
    console.log(err);
  }
  return {
    props: {
      userId,
      changeId,
      user,
    },
  };
};
