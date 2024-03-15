import ButtonGreen from "@/components/UI/buttonGreen";
import Header from "@/components/layout/header";
import ChartSection from "@/components/sections/dashboard/chartSection";
import { UserContext } from "@/contexts/UserContext";
import { useContext, useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import type { RawDataType } from "@/utils/types";
import ButtonRed from "@/components/UI/buttonRed";

export default function MyCenarios() {
  const { user, cenarios, setCenarios } = useContext(UserContext);
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

  function excludeCenario(e: React.MouseEvent<HTMLDivElement>) {
    const updatedCenarios = cenarios.filter((cE) => {
      return cE.id != e.currentTarget.id;
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
          const predsSubArray = Object.entries(cE).map(([cK, cV]) => [cK, cV]);
          predsArray.push(...predsSubArray);
        });
      // </Adjusting_predictions>
      const historicDataHeader: (keyof RawDataType)[] = [
        "DT_COMPTC",
        "CNPJ_FUNDO",
        "VL_TOTAL",
        "VL_PATRIM_LIQ",
        "NR_COTST",
        "VL_QUOTA",
        "CAPTC_DIA",
        "RESG_DIA",
        "CAPTC_LIQ",
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
    <div className="min-h-screen relative bg-[rgb(0,10,20)] lg:bg-gradient-to-br lg:from-[rgb(0,10,20)] lg:to-[rgba(0,30,100,0.8)] text-white/90">
      {user && <Header user={user} />}
      <div className="flex justify-center lg:hidden">
        <h1 className="text-center text-3xl font-semibold pt-6 pb-2 mb-4 lg:text-left lg:border-b lg:border-white/90 lg:mb-12 lg:px-16">
          My Cenarios
        </h1>
      </div>
      <h1 className="hidden text-3xl font-semibold pt-6 pb-2 mb-4 lg:block lg:border-b lg:border-white lg:mb-12 lg:px-4 lg:mx-16">
        My Cenarios
      </h1>
      <section
        id="cenarios"
        className="mb-8 flex flex-col gap-6 lg:justify-center lg:items-center lg:gap-0 text-black"
      >
        {cenarios?.map((cE, cI) => {
          return (
            <div
              key={cE.id.toString()}
              className="border-black rounded-3xl bg-white/90 shadow-lg shadow-indigo-500 pt-2 mx-8 pb-4 px-4 flex flex-col items-center lg:flex-row lg:flex-wrap lg:items-start lg:w-[95%] lg:mb-16"
            >
              <h2 className="text-lg font-bold my-2 indent-1 w-2/3 pl-1 border-b-2 border-black lg:indent-2 lg:w-11/12">
                Cenario {cI + 1}
              </h2>
              <div className="flex flex-col items-center w-full justify-between text-sm lg:flex-row">
                <div className="lg:flex lg:flex-wrap border-gray-400/80 lg:border-r lg:py-6 lg:pr-4">
                  <h3 className="font-bold mx-4 hidden lg:block lg:mx-0 lg:mb-2">
                    Params:
                  </h3>
                  <ul className="lg:flex gap-4 lg:flex-col lg:gap-1 lg:ml-2">
                    <li>
                      DI:<span className="font-bold"> {cE.params.DI}</span>
                    </li>
                    <li>
                      Var. Cota:
                      <span className="font-bold"> {cE.params.varCota}</span>
                    </li>
                    <li>
                      CNPJ:
                      <span className="font-bold"> {cE.params.buscaCnpj}</span>
                    </li>
                    <li>
                      Weeks back:
                      <span className="font-bold"> {cE.params.weeksBack}</span>
                    </li>
                    <li>
                      Weeks forward:
                      <span className="font-bold">
                        {" "}
                        {cE.params.weeksForward}
                      </span>{" "}
                    </li>
                  </ul>
                </div>
                <div className=" lg:block lg:w-full">
                  <ChartSection
                    data={cE.historicData}
                    smallV={true}
                    predictions={cE.predictionData}
                  />
                </div>
                <div
                  id={cE.id}
                  className="mt-6 lg:hidden"
                  onClick={excludeCenario}
                >
                  <ButtonRed shadowColor="black" shadowSize="md">
                    Delete
                  </ButtonRed>
                </div>
              </div>
              <div
                id={cE.id}
                className="hidden my-2 lg:flex lg:justify-start lg:mx-12 lg:w-full"
                onClick={excludeCenario}
              >
                <ButtonRed shadowColor="black" shadowSize="md">
                  Delete
                </ButtonRed>
              </div>
            </div>
          );
        })}
        {cenarios?.length < 1 && (
          <div className="py-2 italic text-sm text-gray-500 text-center">
            No cenarios were saved
          </div>
        )}
      </section>
      <footer
        ref={footerRef}
        className={`bg-black/90 flex justify-center items-center py-4 ${footerPosition} bottom-0 w-full`}
      >
        <div onClick={exportCenarios}>
          <ButtonGreen shadowSize="none" shadowColor="black">
            Export
          </ButtonGreen>
        </div>
      </footer>
    </div>
  );
}
