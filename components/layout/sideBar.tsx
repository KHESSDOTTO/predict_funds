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

  return (
    <>
      <div className={containerClass}>
        <div
          className={`bg-black/90 pointer-event-none sticky z-30 h-96 w-[80%] top-[15vh] bottom-[10vh] left-[10vw] right-[10vw] rounded-xl text-white flex flex-col items-center justify-around`}
          onMouseLeave={handleMouseLeave}
        >
          <div>
            <h2 className="font-semibold">My Products</h2>
            <ul>
              <li>
                <h3>Future Net Funding</h3>
                <div>
                  <span>Simulate</span>
                  <span>Cenarios</span>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold">Other Products</h2>
            <ul>
              <li>Optimize Fixed Income Portfolio</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideBar;
