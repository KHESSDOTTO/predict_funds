import format from "date-fns/format";
import { ControlFormPropsType } from "./controlFormType";
import { predictionWeeks } from "@/utils/globalVars";
import {
  handleControlFormSubmit,
  handleControlFormChange,
} from "./controlFormHandlers";
import SelectWithFilter from "@/components/UI/selectInputWithFilter";
import { useControlForm } from "@/contexts/controlFormContext";
import { track } from "@vercel/analytics";
import { useUser } from "@/contexts/userContext";

export default function ControlFormDesk({
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
    "px-4 cursor-pointer py-1 lg:rounded-2xl lg:text-black border-black flex-1 bg-transparent lg:bg-white focus:outline-none";
  const labelClass = "whitespace-nowrap w-40";
  const { user } = useUser();
  const { controlForm, setControlForm } = useControlForm();
  const fundOptions = arrCnpjName.map((cE) => ({
    name: cE["Denominacao_Social_F"],
    value: cE["CNPJ_Fundo"],
  }));

  return (
    <form
      id="controlFormDesk"
      className="hidden lg:block lg:border-red-500"
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
      <div className="flex relative flex-row justify-start gap-x-32 gap-y-16 w-[95vw] border-red-500 lg:flex-wrap lg:text-white/90">
        <div className="flex flex-row justify-start gap-x-6 gap-y-12 border-red-500 w-[45%] items-start">
          <div className="flex flex-col justify-start gap-6 border-red-500 w-full">
            <div className="flex font-semibold border-white">
              <label htmlFor="baseDate" className={labelClass}>
                Base Date
              </label>
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
            <div className="flex font-semibold">
              <label htmlFor="buscaCnpj" className={labelClass}>
                Fund Name
              </label>
              <div className="flex-1 text-black">
                <SelectWithFilter
                  {...{
                    options: fundOptions,
                    value: controlForm.buscaCnpj,
                    varNameForm: "buscaCnpj",
                    setForm: setControlForm,
                  }}
                />
              </div>
            </div>
            <div className="flex font-semibold">
              <label htmlFor="weeksBack" className={labelClass}>
                Weeks back
              </label>
              <input
                type="text"
                id="weeksBack"
                name="weeksBack"
                className={`${selectInputClass} lg:cursor-text`}
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
            <div className="flex font-semibold">
              <label htmlFor="weeksAhead" className={labelClass}>
                Weeks ahead
              </label>
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
          <button
            type="submit"
            onClick={() =>
              track("clicked_update", { username: user?.username || null })
            }
            className="text-base border-l-2 border-white transition-all h-full duration-300 text-white/80 p-auto flex justify-center items-center mx-6 hover:border-yellow-700 hover:text-yellow-700"
          >
            <div className="px-4">Update</div>
          </button>
        </div>
        <div
          onClick={(e) => {
            track("save_cenario", { username: user?.username || null });
            saveCenario(e);
          }}
          className="absolute bottom-0 right-12 xl:right-24 text-white italic px-1 transition-all duration-200 border-yellow-900 hover:text-indigo-400  lg:ml-4 lg:hover:border-yellow-600 hover:cursor-pointer hover:-translate-y-px"
        >
          + Save Cenario
        </div>
      </div>
    </form>
  );
}
