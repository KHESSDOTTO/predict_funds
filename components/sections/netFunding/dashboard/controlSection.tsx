import ButtonIndigo from "../../../UI/buttonIndigo";
import { RawDataType } from "@/utils/types";
import { useEffect } from "react";
import { Dispatch, SetStateAction } from "react";
import type { NetFundingDashboardControlFormType } from "@/utils/types";
import toast from "react-hot-toast";
import { ax } from "@/database/axios.config";

interface ControlSectionProps {
  data: RawDataType[];
  setData: Dispatch<SetStateAction<RawDataType[]>>;
  controlForm: NetFundingDashboardControlFormType;
  setControlForm: Dispatch<SetStateAction<NetFundingDashboardControlFormType>>;
}

export default function ControlSection({
  data,
  setData,
  controlForm,
  setControlForm,
}: ControlSectionProps) {
  useEffect(() => {
    if (data[0]) {
      setControlForm({
        ...controlForm,
        buscaCnpj: data[0].CNPJ_FUNDO ? data[0].CNPJ_FUNDO : "",
      });
    }
  }, [data]);

  function handleControlFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    let newVal = e.target.value;
    if (e.target.name === "buscaCnpj") {
      const cnpjNum = e.target.value.replaceAll(/[.\/-]/gm, ""),
        lenNum = cnpjNum.length,
        len = e.target.value.length,
        specialChars = [".", "/", "-"];
      if (!specialChars.includes(e.target.value[len - 2])) {
        switch (lenNum) {
          case 3:
            newVal =
              e.target.value.slice(0, lenNum - 1) +
              "." +
              e.target.value.slice(lenNum - 1, lenNum);
            break;
          case 6:
            newVal =
              e.target.value.slice(0, lenNum) +
              "." +
              e.target.value.slice(lenNum, lenNum + 1);
            break;
          case 9:
            newVal =
              e.target.value.slice(0, lenNum + 1) +
              "/" +
              e.target.value.slice(lenNum + 1, lenNum + 2);
            break;
          case 13:
            newVal =
              e.target.value.slice(0, lenNum + 2) +
              "-" +
              e.target.value.slice(lenNum + 2, lenNum + 3);
            break;
          case 15:
            newVal = e.target.value.slice(0, len - 1);
            break;
          default:
            break;
        }
      }
    }
    setControlForm({ ...controlForm, [e.target.name]: newVal });
    return;
  }

  async function handleControlFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const loadingToast = toast.loading("Fetching data...");
    try {
      const encodedParam = encodeURIComponent(controlForm.buscaCnpj);
      const newData = await ax.get(
        `/rawData/getAllFromCnpj?cnpj=${encodedParam}`
      );
      console.log(newData);
      let finalData = newData.data.slice(controlForm.daysBack * -1, -1);
      finalData = finalData.map((cE: RawDataType) => {
        const convDate = new Date(cE.DT_COMPTC);
        return { ...cE, DT_COMPTC: convDate };
      });
      setData(finalData);
      toast.success("Done.");
      toast.dismiss(loadingToast);
    } catch (err) {
      console.log(err);
      toast.error("Sorry. We had a problem handling the request.");
      toast.dismiss(loadingToast);
    }
  }

  return (
    <div
      id="controls"
      className="col-span-5 px-4 mx-4 border border-gray-400 mt-6 py-4 rounded-sm bg-gray-100 box-shadow shadow-md shadow-black lg:mx-12 lg:mt-12 lg:mb-0 lg:px-6 lg:w-fit lg:h-fit lg:bg-gray-200"
    >
      <h2 className="font-bold text-2xl text-center underline pb-4 lg:pb-6">
        Control section
      </h2>
      <form id="controlForm" onSubmit={handleControlFormSubmit}>
        <div className="flex flex-row justify-center gap-4">
          <div className="flex flex-col gap-1 font-semibold lg:gap-0">
            <label htmlFor="buscaCnpj" className="h-8">
              CNPJ to show
            </label>
            <label htmlFor="daysBack" className="h-8">
              Days back
            </label>
            <label htmlFor="daysForward" className="h-8">
              Days forward
            </label>
            <label htmlFor="DI" className="h-8">
              DI
            </label>
            <label htmlFor="varCota" className="h-8">
              Quota variation (%)
            </label>
          </div>
          <div className="flex flex-col gap-1 lg:gap-0">
            <div className="h-8">
              <input
                type="text"
                id="buscaCnpj"
                name="buscaCnpj"
                className="rounded-md border-2 border-black px-2"
                value={controlForm.buscaCnpj}
                onChange={handleControlFormChange}
              ></input>
            </div>
            <div className="h-8">
              <input
                type="text"
                id="daysBack"
                name="daysBack"
                className="rounded-md border-2 border-black px-2"
                value={controlForm.daysBack}
                onChange={handleControlFormChange}
              ></input>
            </div>
            <div className="h-8">
              <input
                type="text"
                id="daysForward"
                name="daysForward"
                className="rounded-md border-2 border-black px-2"
                value={controlForm.daysForward}
                onChange={handleControlFormChange}
              ></input>
            </div>
            <div className="flex h-8 gap-4 text-sm">
              <span className="range-value w-12">
                {(controlForm.DI * 100).toFixed(2)}%
              </span>
              <input
                type="range"
                id="DI"
                name="DI"
                min={0.01}
                max={0.2}
                step={0.0025}
                className="indigo-500"
                value={controlForm.DI}
                onChange={handleControlFormChange}
              ></input>
            </div>
            <div className="flex h-8 gap-4">
              <span
                className="range-value w-12 text-sm"
                style={{
                  color:
                    controlForm.varCota < 0
                      ? "red"
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
                min={-0.99}
                max={1.5}
                step={0.01}
                className="indigo-500"
                value={controlForm.varCota}
                onChange={handleControlFormChange}
              ></input>
            </div>
          </div>
        </div>
        <div className="text-center mt-6 lg:mt-4">
          <ButtonIndigo>Update</ButtonIndigo>
        </div>
      </form>
    </div>
  );
}
