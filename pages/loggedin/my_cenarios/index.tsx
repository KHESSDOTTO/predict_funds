import ButtonGreen from "@/components/UI/buttonGreen";
import Header from "@/components/layout/header";
import ChartSection from "@/components/sections/dashboard/chartSection";
import { UserContext } from "@/contexts/UserContext";
import { useContext } from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

export default function MyCenarios() {
  const { user, cenarios, setCenarios } = useContext(UserContext);

  function excludeCenario(e: React.MouseEvent<HTMLButtonElement>) {
    const updatedCenarios = cenarios.filter((cE) => {
      return cE.id != e.currentTarget.id;
    });
    setCenarios(updatedCenarios);
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
      const dataKeys = Object.keys(cenario.data[0]);
      const dataHeader = dataKeys.filter((cE) => {
        return !colsToHide.includes(cE);
      });
      const dataArray = cenario.data.map((dataRow) => {
        const result = Object.entries(dataRow).map(([cK, cV]) => {
          if (!colsToHide.includes(cK)) {
            return cV;
          }
          return false;
        });
        return result.filter((cE) => cE !== false);
      });
      const data = [...paramsArray, [], dataHeader, ...dataArray];
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, ws_name);
    });
    XLSX.writeFile(workbook, "export-cenarios.xlsx");
  }

  return (
    <div className="min-h-screen">
      {user && <Header user={user} />}
      <h1 className="text-center text-2xl font-semibold underline py-6">
        My Cenarios
      </h1>
      <section
        id="cenarios"
        className="mb-8 flex flex-col gap-6 lg:justify-center lg:items-center lg:gap-0"
      >
        {cenarios?.map((cE, cI) => {
          return (
            <div
              key={cE.id.toString()}
              className="border-2 border-black rounded-lg bg-white/90 shadow-md shadow-gray-400 pt-2 mx-8 pb-4 px-4 flex flex-col items-center lg:items-start lg:w-[60%] lg:mb-6"
            >
              <h2 className="text-lg font-semibold my-2 indent-1 w-2/3 pl-1 border-b border-black lg:indent-2 lg:w-11/12">
                Cenario {cI + 1}
              </h2>
              <div className="flex flex-col items-center w-full justify-between text-sm">
                <div className="lg:flex lg:flex-row">
                  <h3 className="font-bold mx-4 hidden lg:block">Params:</h3>
                  <ul className="lg:flex gap-4 lg:flex-wrap">
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
                <div className="hidden lg:block lg:w-full">
                  <ChartSection data={cE.data} wPredList={false} />
                </div>
                <button
                  id={cE.id}
                  className="mt-4 transition-all bg-gradient-to-b from-red-700 to-red-500 text-white rounded-md border-black border py-1 px-2 shadow-sm shadow-black hover:from-red-800 hover:to-red-500 hover:text-yellow-500"
                  onClick={excludeCenario}
                >
                  Delete
                </button>
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
      <footer className="bg-black flex justify-center items-center py-4 sticky bottom-0 w-full">
        <div onClick={exportCenarios}>
          <ButtonGreen>Export</ButtonGreen>
        </div>
      </footer>
    </div>
  );
}
