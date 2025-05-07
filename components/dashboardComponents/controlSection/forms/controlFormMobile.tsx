import format from "date-fns/format";
import { ControlFormPropsType } from "./controlFormType";
import { predictionWeeks } from "@/utils/globalVars";
import ButtonIndigo from "@/components/UI/buttonIndigo";
import {
  handleControlFormSubmit,
  handleControlFormChange,
} from "./controlFormHandlers";
import SelectWithFilter from "@/components/UI/selectInputWithFilter";
import { useControlForm } from "@/contexts/controlFormContext";
import { useUser } from "@/contexts/userContext";
import { track } from "@vercel/analytics";

export default function ControlFormMobile({
  ancoras,
  arrCnpjName,
  currSubmitToast,
  setNameSelectedFund,
  setRegistration,
  setIsLoading,
  setHistoricData,
  setHistoricAcoesData,
  setHistoricMultimercadoData,
  setHistoricRendaFixaData,
  setPredictionData,
  setPredictionAcoesData,
  setPredictionMultimercadoData,
  setPredictionRendaFixaData,
  saveCenario,
  setCurrSubmitToast,
}: ControlFormPropsType) {
  const selectInputClass =
    "py-1 border shadow-md shadow-gray-400 rounded-2xl text-black text-center w-full bg-white focus:outline-none";
  const { user } = useUser();
  const { controlForm, setControlForm } = useControlForm();
  const fundOptions = arrCnpjName.map((cE) => ({
    name: cE["Denominacao_Social_F"],
    value: cE["CNPJ_Fundo"],
  }));

  return (
    <form
      id="controlFormMobile"
      className="py-2 lg:hidden"
      onSubmit={(e) =>
        handleControlFormSubmit(
          user,
          e,
          controlForm,
          currSubmitToast,
          setControlForm,
          setRegistration,
          setIsLoading,
          setHistoricData,
          setHistoricAcoesData,
          setHistoricMultimercadoData,
          setHistoricRendaFixaData,
          setPredictionData,
          setPredictionAcoesData,
          setPredictionMultimercadoData,
          setPredictionRendaFixaData,
          setCurrSubmitToast
        )
      }
    >
      <input
        type="hidden"
        name="Classificacao"
        id="Classificacao"
        value={controlForm.Classificacao}
      />
      <div className="flex flex-row justify-center gap-4">
        <div className="flex flex-col gap-4 font-semibold max-w-32 lg:gap-0 text-base">
          <label htmlFor="baseDate" className="flex items-center h-8">
            Base Date
          </label>
          <label htmlFor="buscaCnpj" className="flex items-center h-8">
            Fund Name
          </label>
          <label htmlFor="weeksBack" className="flex items-center h-8">
            Weeks back
          </label>
          <label htmlFor="weeksAhead" className="flex items-center h-8">
            Weeks ahead
          </label>
        </div>
        <div className="flex flex-col items-stretch gap-4">
          <div className="flex items-center h-8 px-1">
            <select
              id="baseDate"
              name="baseDate"
              value={controlForm.baseDate}
              onChange={(e) =>
                handleControlFormChange(
                  e,
                  arrCnpjName,
                  controlForm,
                  setControlForm,
                  setNameSelectedFund
                )
              }
              className={selectInputClass}
            >
              {ancoras?.map((cE, cI) => {
                const ancora = new Date(cE);
                return (
                  <option key={cI} value={cE}>
                    {format(ancora, "dd/MM/yyyy")}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex items-center h-8 px-1">
            <SelectWithFilter
              {...{
                options: fundOptions,
                value: controlForm.buscaCnpj,
                varNameForm: "buscaCnpj",
                setForm: setControlForm,
              }}
            />
          </div>
          <div className="flex items-center h-8 px-1">
            <input
              type="text"
              id="weeksBack"
              name="weeksBack"
              className={selectInputClass}
              value={controlForm.weeksBack}
              onChange={(e) =>
                handleControlFormChange(
                  e,
                  arrCnpjName,
                  controlForm,
                  setControlForm,
                  setNameSelectedFund
                )
              }
            ></input>
          </div>
          <div className="flex items-center h-8 px-1">
            <select
              id="weeksAhead"
              name="weeksAhead"
              className={selectInputClass}
              value={controlForm.weeksAhead}
              onChange={(e) =>
                handleControlFormChange(
                  e,
                  arrCnpjName,
                  controlForm,
                  setControlForm,
                  setNameSelectedFund
                )
              }
            >
              {predictionWeeks.map((cE, cI) => {
                return (
                  <option key={cI} value={cE}>
                    {cE + " weeks"}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
      <div className="text-center relative mt-8">
        <div
          onClick={() =>
            track("clicked_update", { username: user?.username || null })
          }
        >
          <ButtonIndigo shadowSize="md" shadowColor="black">
            Update
          </ButtonIndigo>
        </div>
        <div
          onClick={(e) => {
            track("save_cenario", { username: user?.username || null });
            saveCenario(e);
          }}
          className="absolute right-0 bottom-1 text-xs text-indigo-800 px-1 transition-all duration-200 border-yellow-700 hover:text-yellow-600 lg:ml-8 lg:hover:border-yellow-800"
        >
          + Save Cenario
        </div>
      </div>
    </form>
  );
}
