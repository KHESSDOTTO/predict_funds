import Header from "@/components/layout/header";
import { UserContext } from "@/contexts/UserContext";
import { useContext } from "react";

export default function MyCenarios() {
  const { user, cenarios, setCenarios } = useContext(UserContext);
  return (
    <div className="min-h-screen">
      {user && <Header user={user} />}
      <h1>My Cenarios</h1>
      {cenarios?.map((cE, cI, arr) => {
        return (
          <div className="border-2 border-black rounded-lg shadow-md shadow-black py-2 px-4 flex flex-col justify-around items-center lg:flex-row">
            <p>{cE.params.DI}</p>
            <p>{cE.params.buscaCnpj}</p>
            <p>{cE.params.daysBack}</p>
            <p>{cE.params.daysForward}</p>
            <p>{cE.params.varCota}</p>
            <p>{cE.data[0].DT_COMPTC.toString()}</p>
            <button
              id={`excluir-${cI}`}
              className="bg-red-700 text-white rounded-md border-black border py-1 px-2"
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
