import { SideBarPropsType } from "@/utils/types/generalTypes/types";
import { useEffect, useState } from "react";
import Link from "next/link";

function SideBar({ showSideBar, setShowSideBar }: SideBarPropsType) {
  // For the component to work properly, it should be placed inside a container that has position: relative.
  const [containerClass, setContainerClass] = useState(
    `transition-all duration-300 absolute top-0 bottom-0 backdrop-blur-sm min-h-screen w-full opacity-0 -z-10`
  );

  useEffect(() => {
    if (showSideBar) {
      setContainerClass(
        `transition-all duration-500 absolute top-0 bottom-0 backdrop-blur-sm min-h-screen w-full opacity-100 z-20`
      );
    } else {
      setContainerClass(
        `transition-all duration-500 absolute top-0 bottom-0 backdrop-blur-sm min-h-screen w-full opacity-0 -z-10`
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
      <div
        className={`bg-black transition-all pointer-event-none sticky z-30 h-[70vh] w-[80%] top-[15vh] bottom-[10vh] left-[10vw] right-[10vw] rounded-xl text-white flex flex-col px-[5vw] py-[5vh] gap-8`}
        style={{boxShadow: '0 0 15px rgba(255,255,255,0.5)'}}
      >
        <div>
          <h2 className="font-bold">My Products</h2>
          <ul className="text-sm list-disc">
            <li className="flex gap-4 items-end">
              <h3>Future Net Funding</h3>
              <div className="text-xs flex gap-2 text-blue-200">
                <Link href={"/loggedin/home"}
          className="cursor-pointer">
                  <span className="transition-all hover:text-yellow-600">
                    Simulate
                  </span>
                </Link>
                <Link href={"/loggedin/my_cenarios"}
          className="cursor-pointer">
                  <span className="transition-all cursor-pointer hover:text-yellow-600">
                    Cenarios
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
