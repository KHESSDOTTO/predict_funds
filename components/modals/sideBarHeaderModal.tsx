import { SideBarPropsType } from "@/utils/types";
import { useEffect, useState } from "react";
import Link from "next/link";

function SideBar({ showSideBar, setShowSideBar }: SideBarPropsType) {
  // For the component to work properly, it should be placed inside a container that has position: relative.
  const [containerClass, setContainerClass] = useState(
    `transition-all duration-300 absolute top-0 bottom-0 backdrop-blur-sm min-h-screen w-screen opacity-0 -z-10`
  );

  useEffect(() => {
    if (showSideBar) {
      setContainerClass(
        `transition-all duration-300 absolute top-0 bottom-0 backdrop-blur-sm min-h-screen w-screen opacity-100 z-20`
      );
    } else {
      setContainerClass(
        `transition-all duration-300 absolute top-0 bottom-0 backdrop-blur-sm min-h-screen w-screen opacity-0 -z-10`
      );
    }
  }, [showSideBar]);

  function handleMouseLeave() {
    console.log("Mouse left");
    setShowSideBar(false);
  }

  return (
    <div className={containerClass}>
      <div
        className={`bg-black pointer-event-none sticky z-30 h-96 w-[80%] top-[15vh] bottom-[10vh] left-[10vw] right-[10vw] rounded-xl text-white flex flex-col px-[5vw] py-[5vh] gap-8`}
        onMouseLeave={handleMouseLeave}
      >
        <div>
          <h2 className="font-bold">My Products</h2>
          <ul className="text-sm list-disc">
            <li className="flex gap-4 items-end cursor-pointer">
              <Link href={"/loggedin/home"}>
                <h3>Future Net Funding</h3>
              </Link>
              <div className="text-xs flex gap-2 text-blue-200">
                <Link href={"/loggedin/home"}>
                  <span className="transition-all cursor-pointer hover:text-yellow-600 hover:underline">
                    Simulate
                  </span>
                </Link>
                <Link href={"/loggedin/my_cenarios"}>
                  <span className="transition-all cursor-pointer hover:text-yellow-600 hover:underline">
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
            <li className="cursor-pointer">Soon...</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
