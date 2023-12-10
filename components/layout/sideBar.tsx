import { SideBarProps } from "@/utils/types";
import { useEffect } from "react";

function SideBar({ showSideBar, setShowSideBar }: SideBarProps) {
  // useEffect(() => {
  //   if (showSideBar) {
  //     opacity = "opacity-100";
  //   } else {
  //     opacity = "opacity-0";
  //   }
  // }, [showSideBar]);

  function handleMouseLeave() {
    console.log("Mouse left");
    setShowSideBar(false);
  }

  return (
    <>
      <div
        className={`absolute top-0 bottom-0 z-20 backdrop-blur-sm min-h-screen w-screen`}
      >
        <div
          className={`bg-black/90 transition-all duration-300 sticky h-96 w-[90%] top-[15vh] bottom-[10vh] left-[10vw] right-[10vw] rounded-xl text-white lg:left-2`}
          onMouseLeave={handleMouseLeave}
        >
          <p>Side bar</p>
        </div>
      </div>
    </>
  );
}

export default SideBar;
