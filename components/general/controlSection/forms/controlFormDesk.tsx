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
  setNameSelectedFund,
  setRegistration,
  setIsLoading,
  setHistoricData,
  setPredictionData,
  saveCenario,
}: ControlFormPropsType) {
  const selectInputClass = "cursor-pointer px-4 py-1 lg:rounded-2xl lg:text-black border-black text-center w-40 bg-transparent lg:bg-white focus:outline-none";
  const sliderInputClass = "w-40";
  const userContext = useUser();
  const { controlForm, setControlForm } = useControlForm();
  const fundOptions = arrCnpjName.map(cE => (
    {
      name: cE['DENOM_SOCIAL'],
      value: cE['CNPJ_FUNDO']
    }
  ));

  return (
    <form
      id="controlFormDesk"
      className="hidden lg:block lg:border-red-500"
      onSubmit={(e) =>
        handleControlFormSubmit(
          e,
          controlForm,
          setControlForm,
          setRegistration,
          setIsLoading,
          setHistoricData,
          setPredictionData
        )
      }
    >
      <input
        type="hidden"
        name="anbimaClass"
        id="anbimaClass"
        value={controlForm.anbimaClass}
      />
      <input
        type="hidden"
        name="cvmClass"
        id="cvmClass"
        value={controlForm.cvmClass}
      />
      <div className="flex relative flex-row justify-start px-4 gap-x-32 gap-y-16 w-[95vw] border-red-500 lg:mb-4 lg:flex-wrap lg:text-sm lg:text-white/90">
        <div className="flex flex-row justify-start gap-4 border-red-500 w-fit items-start">
          <span className="mr-4">Config.: </span>
          <div className="flex flex-col justify-start gap-4 border-red-500 w-fit items-center">
            <div className="flex flex-col font-semibold items-center gap-1 border-white">
              <label htmlFor="baseDate" className="whitespace-nowrap">
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
                className={ selectInputClass }
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
            <div className="flex flex-col font-semibold items-center gap-1">
              <label htmlFor="buscaCnpj">Fund Name</label>
              <div className="w-40 text-black">
                <SelectWithFilter
                  {
                    ...{
                      options: fundOptions,
                      value: controlForm.buscaCnpj,
                      varNameForm: 'buscaCnpj',
                      setForm: setControlForm,
                    }
                  }
                />
              </div>
            </div>
            <div className="flex flex-col font-semibold items-center gap-1">
              <label htmlFor="weeksBack">Weeks back</label>
              <input
                type="text"
                id="weeksBack"
                name="weeksBack"
                className={ selectInputClass }
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
            <div className="flex flex-col font-semibold items-center gap-1">
              <label htmlFor="weeksAhead">Weeks ahead</label>
              <select
                id="weeksAhead"
                name="weeksAhead"
                className={ selectInputClass }
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
        <div className="flex flex-row justify-start gap-6 border-blue-500 items-start">
          <span className="mr-6">Params: </span>
          <div className="flex flex-col justify-start gap-4 border-red-500 w-fit items-center">
            <div className="flex flex-col font-semibold items-center gap-1">
              <label htmlFor="varNF">% Net Funding var</label>
              <div className="flex gap-4 text-sm">
                <span
                  className="range-value w-10 text-sm"
                  style={{
                    color:
                      controlForm.varNF < 0
                        ? "orange"
                        : controlForm.varNF == 0
                        ? ""
                        : "green",
                  }}
                >
                  {(controlForm.varNF * 100).toFixed(2)}%
                </span>
                <input
                  type="range"
                  id="varNF"
                  name="varNF"
                  min={-0.05}
                  max={0.05}
                  step={0.01}
                  className={ sliderInputClass }
                  value={controlForm.varNF}
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
            </div>
            <div className="flex flex-col font-semibold items-center gap-1">
              <label htmlFor="varCotistas">% Shareholders qnt. var</label>
              <div className="flex gap-4 text-sm">
                <span
                  className="range-value w-10 text-sm"
                  style={{
                    color:
                      controlForm.varCotistas < 0
                        ? "orange"
                        : controlForm.varCotistas == 0
                        ? ""
                        : "green",
                  }}
                >
                  {(controlForm.varCotistas * 100).toFixed(2)}%
                </span>
                <input
                  type="range"
                  id="varCotistas"
                  name="varCotistas"
                  min={-0.05}
                  max={0.05}
                  step={0.01}
                  className={ sliderInputClass }
                  value={controlForm.varCotistas}
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
            </div>
            <div className="flex flex-col font-semibold items-center gap-1">
              <label htmlFor="varCota">Quota variation (%)</label>
              <div className="flex gap-4">
                <span
                  className="range-value w-10 text-sm"
                  style={{
                    color:
                      controlForm.varCota < 0
                        ? "orange"
                        : controlForm.varCota == 0
                        ? ""
                        : "green",
                  }}
                >
                  {(controlForm.varCota * 100).toFixed(2)}%
                </span>
                <input
                  type="range"
                  id="varCota"
                  name="varCota"
                  min={-0.05}
                  max={0.05}
                  step={0.01}
                  className={ sliderInputClass }
                  value={controlForm.varCota}
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
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center p-0 ml-6">
          <button
            type="submit"
            className="text-base transition-all duration-300 h-[110%] border-l-2 border-white/80 text-white/80 p-auto flex justify-center items-center pl-4 hover:text-yellow-700 hover:border-yellow-700"
          >
            <div className="shadow-black relative bottom-1 hover:shadow-xl">
              Update
            </div>
          </button>
        </div>
        <div
          onClick={
            (e) => {
              track("save_cenario", { username: userContext.user?.username || null })
              saveCenario(e)
            }
          }
          className="absolute bottom-0 right-0 xl:right-24 text-white italic px-1 transition-all duration-200 border-yellow-900 hover:text-indigo-400  lg:ml-4 lg:hover:border-yellow-600 hover:cursor-pointer hover:-translate-y-px"
        >
          + Save Cenario
        </div>
      </div>
    </form>
  );
}
