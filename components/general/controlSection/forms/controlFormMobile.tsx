import format from "date-fns/format";
import { ControlFormPropsType } from "./controlFormType";
import { predictionWeeks } from "@/utils/globalVars";
import ButtonIndigo from "@/components/UI/buttonIndigo";
import {
  handleControlFormSubmit,
  handleControlFormChange,
} from "./controlFormHandlers";

export default function ControlFormMobile({
  controlForm,
  ancoras,
  arrCnpjName,
  nameSelectedFund,
  setNameSelectedFund,
  setControlForm,
  setRegistration,
  setIsLoading,
  setHistoricData,
  setPredictionData,
  saveCenario,
}: ControlFormPropsType) {
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
      <div className="flex flex-row justify-center gap-4 lg:gap-16">
        <div className="flex flex-col gap-1 font-semibold max-w-24 lg:gap-0 text-sm">
          <label htmlFor="baseDate" className="h-8">
            Base Date
          </label>
          <label htmlFor="buscaCnpj" className="h-8">
            Fund Name
          </label>
          <label htmlFor="weeksBack" className="h-8">
            Weeks back
          </label>
          <label htmlFor="weeksAhead" className="h-8">
            Weeks ahead
          </label>
          <label
            htmlFor="varNF"
            className="h-8 whitespace-nowrap overflow-scroll"
          >
            N. Funding var (%)
          </label>
          <label
            htmlFor="varCotistas overflow-scroll"
            className="h-8 whitespace-nowrap overflow-scroll"
          >
            Shareholders qnt. var (%)
          </label>
          <label
            htmlFor="varCota"
            className="h-8 whitespace-nowrap overflow-scroll"
          >
            Quota var (%)
          </label>
        </div>
        <div className="flex flex-col items-stretch gap-1 lg:gap-0 overflow-hidden">
          <div className="h-8">
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
              className="rounded-md shadow-md shadow-gray-500 px-1 bg-white w-full"
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
          <div className="h-8">
            <select
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
              className="rounded-md shadow-md shadow-gray-500 px-1 bg-white w-full"
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
            </select>
          </div>
          <div className="h-8">
            <input
              type="text"
              id="weeksBack"
              name="weeksBack"
              className="rounded-md shadow-md shadow-gray-500 px-2 w-full"
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
          <div className="h-8">
            <select
              id="weeksAhead"
              name="weeksAhead"
              className="rounded-md shadow-md shadow-gray-500 px-1 w-full"
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
                    {cE}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex h-8 gap-4 text-sm">
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
              className="indigo-500"
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
          <div className="flex h-8 gap-4 text-sm">
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
              className="indigo-500"
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
          <div className="flex h-8 gap-4">
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
              className="indigo-500"
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
        <ButtonIndigo shadowSize="md" shadowColor="black">
          Update
        </ButtonIndigo>
        <div
          onClick={saveCenario}
          className="absolute right-0 bottom-1 text-xs text-indigo-800 px-1 transition-all duration-200 border-yellow-700 hover:text-yellow-600 lg:ml-8 lg:hover:border-yellow-800"
        >
          + Save Cenario
        </div>
      </div>
    </form>
  );
}
