import ButtonIndigo from "../../UI/buttonIndigo";
import { RawDataType } from "@/utils/types";
import { useEffect } from "react";
import { Dispatch, SetStateAction } from "react";
import type { DashboardControlFormType } from "@/utils/types";
import toast from "react-hot-toast";
import { ax } from "@/database/axios.config";

interface ControlSectionProps {
  data: RawDataType[];
  setData: Dispatch<SetStateAction<RawDataType[]>>;
  controlForm: DashboardControlFormType;
  setControlForm: Dispatch<SetStateAction<DashboardControlFormType>>;
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
      let finalData = newData.data.slice(controlForm.weeksBack * -7, -1);
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
    <>
      <div className="w-screen hidden lg:block">
        <h1 className="my-4 font-semibold text-2xl text-center border-b-2 border-black mx-[32vw] lg:indent-6 lg:mx-8 lg:text-left">
          Control Section
        </h1>
      </div>
      <div
        id="controls"
        className="px-4 mx-4 border border-gray-400 mt-6 py-4 rounded-sm bg-gray-100 box-shadow shadow-md shadow-black lg:w-fit lg:h-fit lg:mt-2"
      >
        <h1 className="font-bold text-2xl text-center underline pb-4 lg:pb-6 lg:hidden">
          Control section
        </h1>
        <form
          id="controlFormMobile"
          className="lg:hidden"
          onSubmit={handleControlFormSubmit}
        >
          <div className="flex flex-row justify-center gap-4 lg:gap-16">
            <div className="flex flex-col gap-1 font-semibold lg:gap-0">
              <label htmlFor="buscaCnpj" className="h-8">
                CNPJ to show
              </label>
              <label htmlFor="weeksBack" className="h-8">
                Weeks back
              </label>
              <label htmlFor="weeksForward" className="h-8">
                Weeks forward
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
                  id="weeksBack"
                  name="weeksBack"
                  className="rounded-md border-2 border-black px-2"
                  value={controlForm.weeksBack}
                  onChange={handleControlFormChange}
                ></input>
              </div>
              <div className="h-8">
                <input
                  type="text"
                  id="weeksForward"
                  name="weeksForward"
                  className="rounded-md border-2 border-black px-2"
                  value={controlForm.weeksForward}
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
        <form
          id="controlFormDesk"
          className="hidden lg:block"
          onSubmit={handleControlFormSubmit}
        >
          <div className="flex flex-row justify-center lg:gap-8 lg:flex-wrap">
            <div className="flex flex-col gap-1 font-semibold items-center w-1/6">
              <label htmlFor="buscaCnpj">CNPJ to show</label>
              <input
                type="text"
                id="buscaCnpj"
                name="buscaCnpj"
                className="border-b-2 rounded-t-sm border-black px-2 text-center w-40 bg-transparent focus:outline-none"
                value={controlForm.buscaCnpj}
                onChange={handleControlFormChange}
              ></input>
            </div>
            <div className="flex flex-col gap-1 font-semibold items-center w-1/6">
              <label htmlFor="weeksBack">Weeks back</label>
              <input
                type="text"
                id="weeksBack"
                name="weeksBack"
                className="border-b-2 rounded-t-sm border-black px-2 text-center w-28 bg-transparent focus:outline-none"
                value={controlForm.weeksBack}
                onChange={handleControlFormChange}
              ></input>
            </div>
            <div className="flex flex-col gap-1 font-semibold items-center w-1/6">
              <label htmlFor="weeksForward">Weeks forward</label>
              <input
                type="text"
                id="weeksForward"
                name="weeksForward"
                className="border-b-2 rounded-t-sm border-black text-center w-28 bg-transparent focus:outline-none"
                value={controlForm.weeksForward}
                onChange={handleControlFormChange}
              ></input>
            </div>
            <div className="flex flex-col gap-1 font-semibold items-center w-1/6">
              <label htmlFor="DI">DI</label>
              <div className="flex gap-4 text-sm">
                <span className="range-value w-8">
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
            </div>
            <div className="flex flex-col gap-1 font-semibold items-center w-1/6">
              <label htmlFor="varCota">Quota variation (%)</label>
              <div className="flex gap-4">
                <span
                  className="range-value w-10 text-sm"
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
            <div className="flex justify-center items-center mt-[-15px]">
              <ButtonIndigo>Update</ButtonIndigo>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
