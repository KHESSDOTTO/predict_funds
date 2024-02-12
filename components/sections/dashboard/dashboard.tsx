import { ax } from "@/database/axios.config";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DashboardControlFormType, RawDataType, UserType } from "@/utils/types";
import ControlSection from "./controlSection";
import ChartSection from "./chartSection";
import Link from "next/link";
import { UserContext } from "@/contexts/UserContext";

interface DashboardProps {
  user: UserType;
}

export default function Dashboard({ user }: DashboardProps) {
  console.log("this is the user:");
  console.log(user);
  const userContext = useContext(UserContext);
  const [data, setData] = useState<RawDataType[]>([]),
    [controlForm, setControlForm] = useState<DashboardControlFormType>({
      buscaCnpj: "",
      DI: 0.1,
      varCota: 0,
      weeksBack: 8,
      weeksForward: 0,
    });

  useEffect(() => {
    const getData = async () => {
      const loadingToast = toast.loading("Fetching data...");
      try {
        const encodedParam = encodeURIComponent(user.cnpj);
        const historicData = await ax.get(
          `/rawData/getAllFromCnpj?cnpj=${encodedParam}`
        );
        const predictions = await ax.get(
          `/prediction/getFromCnpj?cnpj=${encodedParam}`
        );
        console.log("Complete historic data:");
        console.log(historicData);
        console.log("Predictions:");
        console.log(predictions);
        let finalData = historicData.data.slice(
          controlForm.weeksBack * -7,
          historicData.data.length
        );
        console.log("Length of sliced data:");
        console.log(finalData.length);
        console.log("Sliced data:");
        console.log(finalData);
        finalData = finalData.map((cE: RawDataType) => {
          const convDate = new Date(cE.DT_COMPTC);
          return { ...cE, DT_COMPTC: convDate };
        });
        console.log("Final data after mapping to convert date:");
        console.log(finalData);
        setData(finalData);
        toast.success("Done.");
        console.log("Here after setData(historicData);");
        console.log("user from context");
        console.log(userContext.user);
      } catch (err) {
        console.log(err);
        toast.error("Sorry. We had a problem handling the request.");
      }
      toast.dismiss(loadingToast);
    };
    if (!data[0]) {
      getData();
    }
    return;
  }, []);

  function saveCenario() {
    userContext.setCenarios([
      ...userContext.cenarios,
      { id: Math.random().toString(), params: controlForm, data: data },
    ]);
    toast.success("Saved cenario!");
    return;
  }

  return (
    <section className="flex flex-col items-center gap-4 min-w-full text-sm lg:gap-0">
      <ControlSection
        data={data}
        setData={setData}
        controlForm={controlForm}
        setControlForm={setControlForm}
      />
      <ChartSection data={data} smallV={false} />
      <div
        id="cenariosBtnSection"
        className="flex gap-4 mt-[-5px] justify-center items-center border-gray-500 lg:border-t-2 lg:w-10/12 lg:pt-2 lg:mt-4"
      >
        <button
          onClick={saveCenario}
          className="text-indigo-800 px-1 transition-all duration-200 hover:text-indigo-500 lg:ml-8"
        >
          + Save Cenario
        </button>
        <Link href={"/loggedin/my_cenarios"} className="lg:right-2">
          <button className="text-red-700 px-1 transition-all duration-100 hover:text-red-500">
            Go to Cenarios
          </button>
        </Link>
      </div>
    </section>
  );
}
