import { ax } from "@/database/axios.config";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RawDataType, UserType } from "@/utils/types";
import ControlSection from "./controlSection";
import ChartSection from "./chartSection";
import PredictCardsSection from "./predictCardsSection";
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
    [controlForm, setControlForm] = useState({
      buscaCnpj: "",
      DI: 0.1,
      varCota: 0,
      daysBack: 60,
      daysForward: 0,
    });

  useEffect(() => {
    const getData = async () => {
      const loadingToast = toast.loading("Fetching data...");
      try {
        const encodedParam = encodeURIComponent(user.cnpj);
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
        console.log("Here after setData(newData);");
        console.log("user from context");
        console.log(userContext.user);
        return;
      } catch (err) {
        console.log(err);
        toast.error("Sorry. We had a problem handling the request.");
        toast.dismiss(loadingToast);
      }
    };
    if (!data[0]) {
      getData();
    }
    return;
  }, []);

  function saveCenario() {
    userContext.setCenarios([
      ...userContext.cenarios,
      { params: controlForm, data: data },
    ]);
    toast.success("Saved cenario!");
    return;
  }

  return (
    <section className="flex flex-col gap-4 min-w-full text-sm lg:grid lg:grid-cols-12 lg:gap-0">
      <ControlSection
        data={data}
        setData={setData}
        controlForm={controlForm}
        setControlForm={setControlForm}
      />
      <ChartSection data={data} />
      <div
        id="cenariosBtnSection"
        className="flex justify-center items-center col-span-12 gap-4 mt-[-5px] lg:col-start-6 lg:mt-2"
      >
        <button
          onClick={saveCenario}
          className="text-indigo-800 drop-shadow-md border-indigo-500 px-1 transition-all duration-200 hover:text-indigo-500 hover:border-b-2 hover:drop-shadow-xl lg:ml-8"
        >
          + Save Cenario
        </button>
        <Link href={"/loggedin/my_cenarios"} className="lg:absolute lg:right-2">
          <button className="text-red-600 px-1 transition-all duration-100 hover:text-red-400">
            Go to Cenarios
          </button>
        </Link>
      </div>
      <PredictCardsSection data={data} />
    </section>
  );
}
