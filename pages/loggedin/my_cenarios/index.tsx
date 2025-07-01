import ButtonGreen from "@/components/UI/buttonGreen";
import Header from "@/components/layout/header";
import { useUser } from "@/contexts/userContext";
import { useEffect } from "react";
import { verifyToken } from "@/utils/jwt.config";
import toast from "react-hot-toast";
import LogoPredict from "@/components/UI/logoPredict";
import CenarioCard from "@/components/cenarioPageComponents/cenarioCard";
import {
  excludeCenario,
  exportCenarios,
} from "@/utils/functions/pageFunctions/loggedInMyCenariosFunctions";
import type { GetServerSideProps } from "next";
import type { JwtPayload } from "jsonwebtoken";
import type { MyCenariosPagePropsType } from "@/utils/types/pageTypes/myCenariosTypes";
import { consoleLog } from "@/utils/functions/genericFunctions";
import { track } from "@vercel/analytics";
import TitleComponent from "@/components/UI/titleComponent";

export default function MyCenarios({ userFromToken }: MyCenariosPagePropsType) {
  const { user, cenarios, setCenarios } = useUser();

  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  return (
    <div className="bg-black/90 h-full">
      <div className="min-h-screen relative text-white/90 pb-16">
        <Header />
        <div className="px-4 lg:px-8">
          <div className="mt-12 lg:mt-14 mb-8 lg:mb-8">
            <LogoPredict bold={false} />
          </div>
          <div className="flex justify-center lg:hidden">
            <TitleComponent htmlTag="h2">My Cenarios</TitleComponent>
          </div>
          <div className="hidden lg:block">
            <TitleComponent htmlTag="h2">My Cenarios</TitleComponent>
          </div>
          <section
            id="cenarios"
            className="mb-8 lg:mb-0 flex flex-col gap-8 lg:justify-center lg:items-center lg:gap-0 lg:px-2 text-black"
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
          className={`
            bg-gradient-to-b from-black/60 via-black/90 to-black/90
            flex justify-center items-center py-4 fixed bottom-0 w-full
          `}
        >
          <div
            onClick={() => {
              track("export_cenarios", { username: user?.username || null });
              exportCenarios({ cenarios });
            }}
          >
            <ButtonGreen shadowSize="none" shadowColor="">
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
