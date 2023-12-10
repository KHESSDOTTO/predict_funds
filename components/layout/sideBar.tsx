import { SideBarProps } from "@/utils/types";
import { useEffect, useState } from "react";

function SideBar({ showSideBar, setShowSideBar }: SideBarProps) {
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

  function doNothing() {}

  return (
    <>
      <div className={containerClass}>
        <div
          className={`bg-black/90 pointer-event-none sticky z-30 h-96 w-[80%] top-[15vh] bottom-[10vh] left-[10vw] right-[10vw] rounded-xl text-white`}
          onMouseLeave={handleMouseLeave}
        >
          <p>Side bar</p>
        </div>
      </div>
    </>
  );
}

export default SideBar;
