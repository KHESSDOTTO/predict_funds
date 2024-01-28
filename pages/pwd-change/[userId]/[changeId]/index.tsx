import type { GetServerSideProps } from "next";
import { getUserCnpjById } from "@/database/functions/userFunctions";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface PwdChangePagePropsType {
  userId: string;
  changeId: string;
}

export default function PwdChangePage({
  userId,
  changeId,
}: PwdChangePagePropsType) {
  const [pwdChangeForm, setPwdChangeForm] = useState({
    newPwd: "",
    confirmNewPwd: "",
  });
  const [cnpj, setCnpj] = useState("");
  const inputClass = "rounded-lg border border-black";

  useEffect(() => {
    async function getCnpj() {
      try {
        const cnpj = await getUserCnpjById(userId);
        if (!cnpj) {
          return;
        }
        setCnpj(cnpj);
      } catch (err) {
        console.log(err);
        return;
      }
    }
    getCnpj();
    return;
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPwdChangeForm({ ...pwdChangeForm, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pwdChangeForm.newPwd !== pwdChangeForm.confirmNewPwd) {
      toast.error("Password and password confirm doesn't match.");
      return false;
    }
    toast.success("Password updated.");
    return;
  }

  return (
    <div className="flex flex-col items-center gap-8 min-h-screen justify-center">
      <h1 className="text-xl font-semibold py-2 border-b mx-[25%] border-black">
        Change your password - CNPJ: {cnpj && <span>cnpj</span>}
      </h1>
      <form
        id="pwdChangeForm"
        className="flex flex-col gap-4 items-center"
        onSubmit={handleSubmit}
      >
        <div className="flex gap-2">
          <label className="w-36">New Password</label>
          <input
            type="password"
            name="newPwd"
            id="newPwd"
            className={inputClass}
            value={pwdChangeForm.newPwd}
            onChange={handleChange}
          ></input>
        </div>
        <div className="flex gap-2">
          <label className="w-44">Confirm new Password</label>
          <input
            type="password"
            name="confirmNewPwd"
            id="confirmNewPwd"
            className={inputClass}
            value={pwdChangeForm.confirmNewPwd}
            onChange={handleChange}
          ></input>
        </div>
        <button
          type="submit"
          className="transition-all duration-300 font-semibold text-indigo-700 border-b-2 border-indigo-700 px-2 hover:text-yellow-700 hover:border-yellow-700"
        >
          Save
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
  return {
    props: {
      userId,
      changeId,
    },
  };
};
