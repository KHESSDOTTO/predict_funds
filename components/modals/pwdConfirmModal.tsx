import { useState, useEffect } from "react";
import ButtonIndigo from "../UI/buttonIndigo";
import ButtonGreen from "../UI/buttonGreen";

interface PwdConfirmModalPropsType {
  showModal: boolean;
  setShowModal: Function;
  title: string;
  textBtn: string;
  handleSubmitPwdConfirmForm: React.FormEventHandler<HTMLFormElement>;
}

export default function PwdConfirmModal({
  showModal,
  setShowModal,
  title,
  textBtn,
  handleSubmitPwdConfirmForm,
}: PwdConfirmModalPropsType) {
  // For the component to work properly, it should be placed inside a container that has position: relative.

  const [containerClass, setContainerClass] = useState(
    `transition-all duration-300 absolute top-0 bottom-0 backdrop-blur-md min-h-screen w-screen opacity-0 -z-10`
  );
  const [pwdForm, setPwdForm] = useState({ newPwd: "" });

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPwdForm({ ...pwdForm, [e.target.name]: e.target.value });
  }

  function handleClose() {
    setShowModal(false);
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
          onSubmit={handleSubmitPwdConfirmForm}
          className="flex flex-col justify-center items-center gap-8"
        >
          <div className="flex flex-col gap-2 justify-center items-center lg:gap-4 lg:flex-row">
            <label className="py-1">Password</label>
            <input
              className="rounded-md text-black px-2"
              type="password"
              name="newPwd"
              id="newPwd"
              value={pwdForm.newPwd}
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
