import { useState, useEffect } from "react";
import ButtonGreen from "../UI/buttonGreen";
import toast from "react-hot-toast";
import { ax } from "@/database/axios.config";

interface SendEmailModalProsType {
  showModal: boolean;
  setShowModal: Function;
  title: string;
  textBtn: string;
}

interface ChangePwdFormType {
  field?: "username" | "email";
  username: string;
  email: string;
}

export default function SendEmailModal({
  showModal,
  setShowModal,
  title,
  textBtn,
}: SendEmailModalProsType) {
  const [containerClass, setContainerClass] = useState(
    `transition-all duration-300 absolute top-0 bottom-0 backdrop-blur-md min-h-screen w-screen opacity-0 -z-10`
  );
  const [changePwdForm, setChangePwdForm] = useState<ChangePwdFormType>({
    field: "username",
    username: "",
    email: "",
  });

  useEffect(() => {
    if (showModal) {
      setContainerClass(
        `transition-all duration-300 absolute top-0 bottom-0 backdrop-blur-md min-h-screen w-screen opacity-100 z-20`
      );
    } else {
      setContainerClass(
        `transition-all duration-300 absolute top-0 bottom-0 backdrop-blur-md min-h-screen w-screen opacity-0 -z-10`
      );
    }
  }, [showModal]);

  function handleChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    setChangePwdForm({ ...changePwdForm, [e.target.name]: e.target.value });
  }

  function handleClose() {
    setShowModal(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const loading = toast.loading("Loading...");
      setTimeout(() => {
        toast.dismiss(loading);
      }, 4000);
      const { field } = changePwdForm;
      const arrToFindUser = Object.entries(changePwdForm).filter(([cK, cV]) => {
        return cK != field && cK != "field";
      });
      const infoToFindUser = Object.fromEntries(arrToFindUser);
      console.log("infoToFindUser");
      console.log(infoToFindUser);
      setShowModal(false);
      await ax.post("/user/change-pwd-email", infoToFindUser);
      toast.success("An e-mail was sent with a link to change the password.");
    } catch (err) {
      console.log(err);
      toast.error("An error occured while handling your request.");
    }
  }

  return (
    <div className={containerClass}>
      <div
        className={`bg-black pointer-event-none sticky z-30 min-h-96 w-[80%] top-[20vh] bottom-[20vh] left-[10vw] right-[10vw] rounded-xl text-white flex flex-col justify-center items-center px-[5vw] py-[5vh] lg:top-[30vh] lg:left-[25vw] lg:min-h-[50vh] lg:w-[50vw] gap-8`}
      >
        <div className="flex justify-center items-center">
          <h1 className="text-xl font-semibold text-center">{title}</h1>
          <div
            id="closeBtn"
            className="absolute top-2 right-2"
            onClick={handleClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentcolor"
              className="transition-all w-6 h-6 hover:text-yellow-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-8"
        >
          <div className="flex flex-col gap-2 justify-center items-center lg:gap-4 lg:flex-row">
            <select
              className="text-center bg-white border border-gray-500 w-fit rounded-md my-1"
              name="field"
              id="field"
              value={changePwdForm.field}
              onChange={handleChange}
            >
              <option></option>
              {Object.keys(changePwdForm).map((cE) => {
                if (cE === "field") {
                  return <></>;
                }
                return <option value={cE}>{cE}</option>;
              })}
            </select>
          </div>
          <div className="flex flex-col gap-2 justify-center items-center lg:gap-4 lg:flex-row">
            <label className="py-1">Username</label>
            <input
              className="rounded-md text-black px-2"
              type="text"
              name="username"
              id="username"
              value={changePwdForm.username}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2 justify-center items-center lg:gap-4 lg:flex-row">
            <label className="py-1">E-mail</label>
            <input
              className="rounded-md text-black px-2"
              type="text"
              name="email"
              id="email"
              value={changePwdForm.email}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4 lg:mt-0">
            <ButtonGreen>{textBtn}</ButtonGreen>
          </div>
        </form>
      </div>
    </div>
  );
}
