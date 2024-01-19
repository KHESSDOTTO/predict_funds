import Header from "@/components/layout/header";
import { UserContext } from "@/contexts/UserContext";
import { useContext } from "react";

export default function MyCenarios() {
  const { user, cenarios, setCenarios } = useContext(UserContext);

  function excludeCenario(e: React.MouseEvent<HTMLButtonElement>) {
    const updatedCenarios = cenarios.filter((cE) => {
      return cE.id != e.currentTarget.id;
    });
    setCenarios(updatedCenarios);
  }

  return (
    <div className="min-h-screen">
      {user && <Header user={user} />}
      <h1 className="text-center text-2xl font-semibold underline py-6">
        My Cenarios
      </h1>
      <section id="cenarios" className="mb-8 flex flex-col gap-6">
        {cenarios?.map((cE, cI) => {
          return (
            <div className="border-2 border-black rounded-lg shadow-md shadow-black pt-2 mx-8 pb-4 px-4 flex flex-col items-center lg:items-start">
              <h2 className="text-lg font-semibold my-2 indent-1 w-2/3 pl-1 border-b border-black lg:indent-2 lg:mb-4 lg:w-11/12">
                Cenario {cI + 1}
              </h2>
              <div className="flex flex-col items-center w-full justify-between gap-2 lg:flex-row">
                <ul className="lg:flex gap-4">
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
                  {/* <li>DT_COMPTC1: {cE.data[0].DT_COMPTC.toString()}</li>
                <li>CAPTC_LIQ1: R$ {cE.data[0].CAPTC_LIQ}</li>
                  <li>VL_QUOTA1: R$ {cE.data[0].VL_QUOTA}</li> */}
                </ul>
                <button
                  id={cE.id}
                  className="transition-all bg-gradient-to-b from-red-700 to-red-500 text-white rounded-md border-black border py-1 px-2 hover:from-red-800 hover:to-red-500 hover:text-yellow-500"
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
    </div>
  );
}
