import { SideBarPropsType } from "@/utils/types/generalTypes/types";
import { useEffect, useState } from "react";
import Link from "next/link";

function SideBar({ showSideBar, setShowSideBar }: SideBarPropsType) {
  // For the component to work properly, it should be placed inside a container that has position: relative.
  const [containerClass, setContainerClass] = useState(
    `transition-all duration-200 fixed top-0 bottom-0 backdrop-blur-sm min-h-screen w-full opacity-0 -z-10`
  );

  useEffect(() => {
    if (showSideBar) {
      setContainerClass(
        `transition-all duration-500 fixed top-0 bottom-0 backdrop-blur-sm min-h-screen w-full opacity-100 z-30`
      );
    } else {
      setContainerClass(
        `transition-all duration-500 fixed top-0 bottom-0 backdrop-blur-sm min-h-screen w-full opacity-0 -z-10`
      );
    }
  }, [showSideBar]);

  function handleClickOutside(e: React.MouseEvent) {
    // console.log("Mouse left");
    if (e.target === e.currentTarget) {
      setShowSideBar(false);
    }
  }

  return (
    <div className={containerClass} onClick={handleClickOutside}>
      <div className="hidden z-30 lg:-z-10">
        {/* Div para forçar inclusão de classes tailwind */}
      </div>
      <div
        className={`bg-black transition-all pointer-event-none absolute h-[70vh] w-[80%] top-[15vh] left-[10vw] rounded-xl text-white flex flex-col px-[5vw] lg:px-10 py-[5vh] gap-8`}
        style={{ boxShadow: "0 0 15px rgba(255,255,255,0.5)" }}
      >
        <div>
          <h2 className="font-bold text-xl mb-4">My Products</h2>
          <ul className="text-sm list-disc">
            <li className="flex gap-x-16 gap-y-2 mt-2 flex-wrap items-end">
              <h3 className="w-full lg:w-fit">Net Funding</h3>
              <div className="text-xs flex gap-2 lg:gap-6 text-blue-200">
                <Link href={"/loggedin/home"} className="cursor-pointer">
                  <span className="pb-1 px-1 lg:px-2 border-b border-blue-200/50 transition-all hover:text-yellow-600 hover:border-yellow-600/40">
                    Simulate
                  </span>
                </Link>
                <Link href={"/loggedin/my_cenarios"} className="cursor-pointer">
                  <span className="pb-1 px-1 lg:px-2 border-b border-blue-200/50 transition-all hover:text-yellow-600 hover:border-yellow-600/40">
                    Cenarios
                  </span>
                </Link>
                <Link
                  href={"/loggedin/create-your-dash"}
                  className="cursor-pointer"
                >
                  <span className="pb-1 px-1 lg:px-2 border-b border-blue-200/50 transition-all hover:text-yellow-600 hover:border-yellow-600/40">
                    Build your dash
                  </span>
                </Link>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-bold">Other Products</h2>
          <ul className="text-sm">
            <li>Soon...</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
