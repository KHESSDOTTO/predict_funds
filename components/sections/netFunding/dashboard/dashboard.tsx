import { ax } from "@/database/axios.config";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RawDataType, UserType } from "@/utils/types";
import ControlSection from "./controlSection";
import ChartSection from "./chartSection";
import PredictCardsSection from "./predictCardsSection";

interface DashboardProps {
  user: UserType;
}

export default function Dashboard({ user }: DashboardProps) {
  console.log("this is the user:");
  console.log(user);
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

  return (
    <section className="flex flex-col gap-4 min-w-full text-sm lg:grid lg:grid-cols-12 lg:gap-0">
      <ControlSection
        data={data}
        setData={setData}
        controlForm={controlForm}
        setControlForm={setControlForm}
      />
      <ChartSection data={data} />
      <PredictCardsSection data={data} />
    </section>
  );
}
