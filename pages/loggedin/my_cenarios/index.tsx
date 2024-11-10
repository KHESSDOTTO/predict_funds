import ButtonGreen from "@/components/UI/buttonGreen";
import Header from "@/components/layout/header";
import { UserContext } from "@/contexts/UserContext";
import { useContext, useEffect, useState, useRef } from "react";
import { verifyToken } from "@/utils/jwt.config";
import toast from "react-hot-toast";
import LogoPredict from "@/components/UI/logoPredict";
import CenarioCard from "@/components/general/cenarioCard";
import {
  excludeCenario,
  exportCenarios,
  updateFooterPosition,
} from "@/utils/functions/pageFunctions/loggedInMyCenariosFunctions";
import type { GetServerSideProps } from "next";
import type { JwtPayload } from "jsonwebtoken";
import type { MyCenariosPagePropsType } from "@/utils/types/pageTypes/myCenariosTypes";

export default function MyCenarios({ userFromToken }: MyCenariosPagePropsType) {
  const { cenarios, setCenarios } = useContext(UserContext);
  const [footerPosition, setFooterPosition] = useState<string>("absolute");
  const footerRef = useRef<HTMLDivElement>(null);
  const updateFooterPositionArgs = {
    footerRef,
    setFooterPosition,
  };

  useEffect(() => {
    const handleScroll = () => {
      updateFooterPosition(updateFooterPositionArgs);
    };
    window.addEventListener("scroll", handleScroll);
    const resizeObserver = new ResizeObserver(() => {
      updateFooterPosition(updateFooterPositionArgs);
    });
    resizeObserver.observe(document.body);
    updateFooterPosition(updateFooterPositionArgs);
    return () => {
      toast.dismiss();
      window.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="bg-black">
      <div className="min-h-screen relative bg-gradient-to-br bg-fixed from-gray-800/60 from-85% to-blue-900/60 text-white/90">
        {userFromToken && <Header user={userFromToken} />}
        <div className="px-4">
          <div className="mt-12 lg:mt-16 mb-8 lg:mb-12">
            <LogoPredict bold={false} />
          </div>
          <div className="flex justify-center lg:hidden">
            <h1 className="text-center text-3xl font-semibold pt-6 pb-2 mb-4 lg:text-left lg:border-b lg:border-white/90 lg:mb-12 lg:px-16">
              My Cenarios
            </h1>
          </div>
          <h1 className="hidden text-3xl px-2 font-bold pt-6 pb-2 mb-4 lg:block lg:border-b lg:border-white lg:mb-12 lg:w-full">
            My Cenarios
          </h1>
          <section
            id="cenarios"
            className="mb-8 flex flex-col gap-12 lg:justify-center lg:items-center lg:gap-0 lg:px-2 text-black"
          >
            {cenarios?.map((cE, cI) => {
              return (
                <CenarioCard
                  key={cE.id.toString()}
                  cenarios={cenarios}
                  setCenarios={setCenarios}
                  cenarioData={cE}
                  index={cI}
                  excludeCenarioFunction={excludeCenario}
                />
              );
            })}
            {cenarios?.length < 1 && (
              <div className="py-2 italic text-sm text-gray-500 text-center">
                No cenarios were saved
              </div>
            )}
          </section>
        </div>
        <footer
          ref={footerRef}
          className={`bg-gradient-to-b from-black/30 via-black/80 to-black flex justify-center items-center py-4 ${footerPosition} bottom-0 w-full`}
        >
          <div onClick={() => exportCenarios({ cenarios })}>
            <ButtonGreen shadowSize="none" shadowColor="black">
              Export
            </ButtonGreen>
          </div>
        </footer>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.loggedInUser;
  const loginUrl = "/login";
  let userFromToken: string | false | JwtPayload = false;

  if (token) {
    userFromToken = verifyToken(token);
  }

  if (!userFromToken) {
    return {
      redirect: {
        destination: loginUrl,
        permanent: false,
      },
    };
  }

  return {
    props: {
      userFromToken,
    },
  };
};
