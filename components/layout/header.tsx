import Link from "next/link";
import { HeaderPropsType } from "@/utils/types";
import { useState } from "react";
import SideBar from "./sideBar";

function Header({ user }: HeaderPropsType) {
  // For the sideBar component to work properly, it should be placed inside a container that has position: relative.

  const [showSideBar, setShowSideBar] = useState(false);
  let { username, cnpj } = user;
  if (!user) {
    (username = ""), (cnpj = "");
  }

  function handleSideBar() {
    setShowSideBar(true);
  }

  return (
    <>
      <SideBar showSideBar={showSideBar} setShowSideBar={setShowSideBar} />

      <header className="grid grid-cols-12 text-xs bg-black/80 items-center text-white h-16 px-4 sticky top-0 z-10 md:text-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 md:w-6 md:h-6 md:gap-2 hover:text-base transition-all hover:text-yellow-600 hover:cursor-pointer"
          onMouseEnter={handleSideBar}
        >
          <path
            fillRule="evenodd"
            d="M3 9a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 9zm0 6.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
            clipRule="evenodd"
          />
        </svg>
        <div className="cursor-pointer">
          <Link
            href={"/loggedin/home"}
            className="flex items-center justify-end md:gap-2 hover:text-base transition-all hover:text-yellow-600 md:justify-start"
          >
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 md:w-6 md:h-6"
            >
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 md:w-6 md:h-6"
            >
              <path
                fillRule="evenodd"
                d="M2.25 2.25a.75.75 0 0 0 0 1.5H3v10.5a3 3 0 0 0 3 3h1.21l-1.172 3.513a.75.75 0 0 0 1.424.474l.329-.987h8.418l.33.987a.75.75 0 0 0 1.422-.474l-1.17-3.513H18a3 3 0 0 0 3-3V3.75h.75a.75.75 0 0 0 0-1.5H2.25Zm6.54 15h6.42l.5 1.5H8.29l.5-1.5Zm8.085-8.995a.75.75 0 1 0-.75-1.299 12.81 12.81 0 0 0-3.558 3.05L11.03 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l2.47-2.47 1.617 1.618a.75.75 0 0 0 1.146-.102 11.312 11.312 0 0 1 3.612-3.321Z"
                clipRule="evenodd"
              />
            </svg>

            <p className="hidden lg:block">Dash</p>
          </Link>
        </div>
        <div className="flex items-center justify-end md:gap-2 cursor-pointer hover:text-base transition-all hover:text-yellow-600 md:justify-start">
          <Link
            href={"/loggedin/profile"}
            className="flex items-center justify-end md:gap-2 hover:text-base transition-all hover:text-yellow-600 md:justify-start"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 md:w-6 md:h-6"
            >
              <path
                fillRule="evenodd"
                d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-3.873 8.703a4.126 4.126 0 017.746 0 .75.75 0 01-.351.92 7.47 7.47 0 01-3.522.877 7.47 7.47 0 01-3.522-.877.75.75 0 01-.351-.92zM15 8.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15zM14.25 12a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H15a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15z"
                clipRule="evenodd"
              />
            </svg>
            <p className="hidden lg:block">Profile</p>
          </Link>
        </div>
        <div className="col-start-8 col-span-6 flex flex-col gap-2 md:flex-row md:gap-4 md:justify-around">
          <div className="flex col-start-6 col-span-2 items-center gap-1 md:gap-2 md:flex-row md:col-start-9">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 md:w-6 md:h-6"
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                clipRule="evenodd"
              />
            </svg>
            <p>
              <span className="hidden md:inline">Username: </span>
              {username}
            </p>
          </div>
          <div className="col-span-5 flex items-center gap-1 md:gap-2 md:flex-row">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 md:w-6 md:h-6"
            >
              <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
            </svg>
            <p>
              <span className="hidden md:inline">CNPJ: </span>
              {cnpj}
            </p>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
