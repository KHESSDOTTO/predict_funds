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
  setNameSelectedFund,
  setRegistration,
  setIsLoading,
  setHistoricData,
  setPredictionData,
  saveCenario,
}: ControlFormPropsType) {
  const selectInputClass = "px-4 py-1 border shadow-md shadow-gray-400 rounded-2xl text-black text-center w-full bg-white focus:outline-none";
  const inputRangeClass = "cursor-pointer relative top-[1.5px] rounded-2xl text-black text-center w-full bg-white focus:outline-none";
  const { user } = useUser(); 
  const { controlForm, setControlForm } = useControlForm();
  const fundOptions = arrCnpjName.map(cE => (
    {
      name: cE['DENOM_SOCIAL'],
      value: cE['CNPJ_FUNDO']
    }
  ));
  
  return (
    <form
      id="controlFormMobile"
      className="py-2 lg:hidden"
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
      <div className="flex flex-row justify-center gap-4">
        <div className="flex flex-col gap-2 font-semibold max-w-32 lg:gap-0 text-base">
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
          <label
            htmlFor="varNF"
            className="flex items-center h-8 whitespace-nowrap overflow-scroll"
          >
            N. Funding var (%)
          </label>
          <label
            htmlFor="varCotistas overflow-scroll"
            className="flex items-center h-8 whitespace-nowrap overflow-scroll"
          >
            Shareholders qnt. var (%)
          </label>
          <label
            htmlFor="varCota"
            className="flex items-center h-8 whitespace-nowrap overflow-scroll"
          >
            Quota var (%)
          </label>
        </div>
        <div className="flex flex-col items-stretch gap-2 lg:gap-0">
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
          <div className="flex items-center h-8 px-1">
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
            {/* <select
              id="buscaCnpj"
              name="buscaCnpj"
              value={controlForm.buscaCnpj}
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
              title={nameSelectedFund}
            >
              {arrCnpjName &&
                arrCnpjName.map((cE: any, cI: number) => {
                  return (
                    <option
                      key={cI}
                      value={cE["CNPJ_FUNDO"]}
                      className="text-ellipsis max-w-6 overflow-hidden"
                    >
                      {cE["DENOM_SOCIAL"]}
                    </option>
                  );
                })}
            </select> */}
          </div>
          <div className="flex items-center h-8 px-1">
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
          <div className="flex items-center h-8 px-1">
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
          <div className="flex items-center h-8 px-1 gap-4 text-sm">
            <span
              className="range-value w-12 text-sm"
              style={{
                color:
                  controlForm.varNF < 0
                    ? "darkred"
                    : controlForm.varNF == 0
                    ? ""
                    : "darkgreen",
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
              className={ inputRangeClass }
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
          <div className="flex items-center h-8 px-1 gap-4 text-sm">
            <span
              className="range-value w-12 text-sm"
              style={{
                color:
                  controlForm.varCotistas < 0
                    ? "darkred"
                    : controlForm.varCotistas == 0
                    ? ""
                    : "darkgreen",
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
              className={ inputRangeClass }
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
          <div className="flex items-center px-1 h-8 gap-4">
            <span
              className="range-value w-12 text-sm"
              style={{
                color:
                  controlForm.varCota < 0
                    ? "darkred"
                    : controlForm.varCota == 0
                    ? ""
                    : "darkgreen",
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
              className={ inputRangeClass }
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
      <div className="text-center relative mt-6 lg:mt-4 lg:shadow-md lg:shadow-black">
        <div onClick={() => track('clicked_update', { username: user?.username || null })}>
          <ButtonIndigo shadowSize="md" shadowColor="black">
            Update
          </ButtonIndigo>
        </div>
        <div
          onClick={
            (e) => {
              track("save_cenario", { username: user?.username || null });
              saveCenario(e);
            }
          }
          className="absolute right-0 bottom-1 text-xs text-indigo-800 px-1 transition-all duration-200 border-yellow-700 hover:text-yellow-600 lg:ml-8 lg:hover:border-yellow-800"
        >
          + Save Cenario
        </div>
      </div>
    </form>
  );
}
