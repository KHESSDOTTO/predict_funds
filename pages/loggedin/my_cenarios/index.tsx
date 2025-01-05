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
} from "@/utils/functions/pageFunctions/loggedInMyCenariosFunctions";
import type { GetServerSideProps } from "next";
import type { JwtPayload } from "jsonwebtoken";
import type { MyCenariosPagePropsType } from "@/utils/types/pageTypes/myCenariosTypes";

export default function MyCenarios({ userFromToken }: MyCenariosPagePropsType) {
  const { cenarios, setCenarios } = useContext(UserContext);
  const [footerPosition, setFooterPosition] = useState<string>("absolute");

  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  return (
    <div className="bg-black/90 h-full">
      <div className="min-h-screen relative text-white/90 pb-16">

        {userFromToken && <Header user={userFromToken} />}

        <div className="px-4 lg:px-8">
          <div className="mt-12 lg:mt-14 mb-8 lg:mb-8">
            <LogoPredict bold={false} />
          </div>
          <div className="flex justify-center lg:hidden">
            <h1 className="text-center text-2xl border-b px-8 border-white font-semibold pb-2 mb-8 lg:text-left lg:border-b lg:border-white/90 lg:mb-12 lg:px-16">
              My Cenarios
            </h1>
          </div>
          <h1 className="hidden text-xl px-8 font-bold pt-6 pb-2 mb-4 lg:block lg:border-b lg:border-white lg:mb-12 lg:w-full">
            My Cenarios
          </h1>
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
          <div onClick={() => exportCenarios({ cenarios })}>
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
