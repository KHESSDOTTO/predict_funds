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
      <h1>My Cenarios</h1>
      {cenarios?.map((cE, cI, arr) => {
        return (
          <div className="border-2 border-black rounded-lg shadow-md shadow-black py-2 px-4 flex flex-col justify-around items-center lg:flex-row">
            <p>DI: {cE.params.DI}</p>
            <p>CNPJ: {cE.params.buscaCnpj}</p>
            <p>weeksBack: {cE.params.weeksBack}</p>
            <p>weeksForward: {cE.params.weeksForward}</p>
            <p>varCota: {cE.params.varCota}</p>
            <p>DT_COMPTC1: {cE.data[0].DT_COMPTC.toString()}</p>
            <p>CAPTC_LIQ1: R$ {cE.data[0].CAPTC_LIQ}</p>
            <p>VL_QUOTA1: R$ {cE.data[0].VL_QUOTA}</p>
            <button
              id={cE.id}
              className="bg-red-700 text-white rounded-md border-black border py-1 px-2"
              onClick={excludeCenario}
            >
              X
            </button>
          </div>
        );
      })}
      <div>End</div>;
    </div>
  );
}
