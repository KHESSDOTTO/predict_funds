import ButtonGreen from "@/components/UI/buttonGreen";
import Header from "@/components/layout/header";
import { UserContext } from "@/contexts/UserContext";
import { useContext, useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import type { HistoricType, UserType } from "@/utils/types";
import type { GetServerSideProps } from "next";
import type { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "@/utils/jwt.config";
import LogoPredict from "@/components/UI/logoPredict";
import CenarioCard from "@/components/cenarioCard";

interface MyCenariosPagePropsType {
  userFromToken: UserType;
}

export default function MyCenarios({ userFromToken }: MyCenariosPagePropsType) {
  const { cenarios, setCenarios } = useContext(UserContext);
  const [footerPosition, setFooterPosition] = useState("absolute");
  const footerRef = useRef<HTMLDivElement>(null);

  function updateFooterPosition() {
    if (footerRef.current) {
      const footerHeight = footerRef.current.clientHeight;
      const atBottom =
        window.scrollY + window.innerHeight - 20 >=
        document.documentElement.scrollHeight;
      const contentTooShort =
        window.innerHeight >= document.body.offsetHeight - footerHeight;

      if (atBottom) {
        setFooterPosition("absolute");
      } else if (contentTooShort) {
        setFooterPosition("absolute");
      } else {
        setFooterPosition("sticky");
      }
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      updateFooterPosition();
    };
    window.addEventListener("scroll", handleScroll);
    const resizeObserver = new ResizeObserver(() => {
      updateFooterPosition();
    });
    resizeObserver.observe(document.body);
    updateFooterPosition();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  function excludeCenario(cenarioId: string) {
    const updatedCenarios = cenarios.filter((cE) => {
      return cE.id != cenarioId;
    });
    setCenarios(updatedCenarios);
    toast.success("Removed cenario.");
  }

  function exportCenarios() {
    if (cenarios.length === 0) {
      toast.error("No cenarios were saved to export.");
      return;
    }
    const workbook = XLSX.utils.book_new();
    cenarios.forEach((cenario, i) => {
      const ws_name = "Cenario " + (i + 1);
      const colsToHide = ["TP_FUNDO", "_id"];
      const paramsArray = Object.entries(cenario.params).map(([cK, cV]) => [
        cK,
        cV,
      ]);

      // <Adjusting_predictions>
      const predsArray: any = [];
      cenario.predictionData
        .slice(cenario.predictionData.length - 1)
        .forEach((cE) => {
          const predsSubArray = Object.entries(cE).map(([cK, cV]) => {
            if (Array.isArray(cV)) {
              return [cK, ...cV];
            }
            return [cK, cV];
          });
          predsArray.push(...predsSubArray);
        });
      // </Adjusting_predictions>
      const historicDataHeader: (keyof HistoricType)[] = [
        "DT_COMPTC",
        "CNPJ_FUNDO",
        "VL_TOTAL_ms",
        "VL_PATRIM_LIQ_ms",
        "NR_COTST_ms",
        "VL_QUOTA_ms",
        "CAPTC_DIA_ms",
        "RESG_DIA_ms",
        "CAPTC_LIQ_ms",
      ];
      const historicDataArray = cenario.historicData.map((dataRow) => {
        const orderedDataRow = historicDataHeader.map((key) => {
          return [key, dataRow[key]];
        });
        const result = orderedDataRow.map(([cK, cV]) => {
          if (typeof cK == "string" && !colsToHide.includes(cK)) {
            return cV;
          }
          return false;
        });

        return result.filter((cE) => cE !== false);
      });
      const data = [
        ["Params"],
        ...paramsArray,
        [],
        ["Prediction"],
        ...predsArray,
        [],
        ["Historic"],
        historicDataHeader,
        ...historicDataArray,
      ];
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, ws_name);
    });
    XLSX.writeFile(workbook, "export-cenarios.xlsx");
  }

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
          <div onClick={exportCenarios}>
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
