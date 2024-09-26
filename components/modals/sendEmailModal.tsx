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
  field?: "username" | "email" | "";
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
    field: "",
    username: "",
    email: "",
  });
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const labelClass = "text-white lg:py-1";
  const arrOptions = ["username", "email"];

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
    if (e.target.name === "field" && e.target.value === "username") {
      setShowUsernameInput(true);
      setShowEmailInput(false);
    }
    if (e.target.name === "field" && e.target.value === "email") {
      setShowEmailInput(true);
      setShowUsernameInput(false);
    }
  }

  function handleClose() {
    setShowModal(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const loading = toast.loading("Loading...");
    try {
      const { field } = changePwdForm;
      const arrToFindUser = Object.entries(changePwdForm).filter(([cK, cV]) => {
        return cK == field;
      });
      const infoToFindUser = Object.fromEntries(arrToFindUser);
      setShowModal(false);
      await ax.post("/user/change-pwd-email", infoToFindUser);
      toast.success("An e-mail was sent with a link to change the password.");
    } catch (err) {
      console.log(err);
      toast.error("An error occured while handling your request.");
    }
    toast.dismiss(loading);
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
          className="flex flex-col justify-center items-center gap-8 text-black"
        >
          <div className="flex flex-col gap-2 justify-center items-center lg:gap-4 lg:flex-row">
            <label htmlFor="field" className={labelClass}>
              Information to send e-mail
            </label>
            <select
              className="text-center bg-white border border-gray-500 w-fit rounded-md my-1"
              name="field"
              id="field"
              value={changePwdForm.field}
              onChange={handleChange}
            >
              <option value=""></option>
              {arrOptions.map((cE) => {
                return (
                  <option key={cE} value={cE}>
                    {cE}
                  </option>
                );
              })}
            </select>
          </div>
          {showUsernameInput && (
            <div className="animate-fadeIn flex flex-col gap-2 justify-center items-center lg:gap-4 lg:flex-row">
              <label className={labelClass}>Username</label>
              <input
                className="rounded-md text-black px-2"
                type="text"
                name="username"
                id="username"
                value={changePwdForm.username}
                onChange={handleChange}
              />
            </div>
          )}
          {showEmailInput && (
            <div className="animate-fadeIn flex flex-col gap-2 justify-center items-center lg:gap-4 lg:flex-row">
              <label className={labelClass}>E-mail</label>
              <input
                className="rounded-md text-black px-2"
                type="text"
                name="email"
                id="email"
                value={changePwdForm.email}
                onChange={handleChange}
              />
            </div>
          )}
          <div className="mt-4 lg:mt-0">
            <ButtonGreen shadowSize="md" shadowColor="none">
              {textBtn}
            </ButtonGreen>
          </div>
        </form>
      </div>
    </div>
  );
}
