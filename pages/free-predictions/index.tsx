import NetFundingPredChart from "@/components/dashboardComponents/netFundingPredChart";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AggregateChartsDataType,
  FreePredictionsPropsType,
} from "./types/predictionsPageTypes";
import { fetchData } from "./freePredictionsFunction";
import getCachedAncoras from "@/cache/ancorasPredsCache";
import { GetServerSideProps } from "next";
import { consoleLog } from "@/utils/functions/genericFunctions";
import toast from "react-hot-toast";

export default function FreePredictions({ ancoras }: FreePredictionsPropsType) {
  const [chartsData, setChartsData] = useState<AggregateChartsDataType>({
    "Renda Fixa": {
      historic: [],
      prediction: [],
    },
    Multimercado: {
      historic: [],
      prediction: [],
    },
    Ações: {
      historic: [],
      prediction: [],
    },
  });
  const [loadingToast, setLoadingToast] = useState<boolean>(false);
  const [controlForm, setControlForm] = useState({
    baseDate: ancoras[ancoras.length - 1] || "",
    weeksBack: 8,
    weeksAhead: 4,
  });
  const linkClass =
    "hover:text-yellow-600 lg:hover:scale-110 transition-all duration-200";

  useEffect(() => {
    if (loadingToast) {
      return;
    }

    setLoadingToast(true);

    toast.promise(
      fetchData({
        controlForm,
        chartsData,
        setChartsData,
      }),
      {
        loading: "Fetching Data...",
        success: "Done!",
        error: "Error when fetching data...",
      }
    );

    return;
  }, []);

  return (
    <div className="bg-black">
      <header className="bg-black fixed w-full z-20 py-6 border-b-2 border-gray-500 flex justify-around">
        <Link href={"/"} className={linkClass}>
          Home
        </Link>
        <Link href={"/signup"} className={linkClass}>
          Sign up
        </Link>
        <Link href={"/login"} className={linkClass}>
          Login
        </Link>
      </header>
      <main className=" animate-fadeIn-l-r min-h-screen px-6 bg-black pt-[72px]">
        <div className="py-10">
          <div>
            <h1 className="px-2 border-b-2 text-center lg:text-start border-white text-4xl py-2 mb-6">
              <span>Free Predictions</span>
            </h1>
          </div>
          <p>
            Here are the predictions that are available without the need to log
            in:
          </p>
        </div>
        <div>
          <div className="flex flex-col gap-6">
            {Object.keys(chartsData).map((currKey) => {
              const currClass = currKey as keyof AggregateChartsDataType;

              return (
                <NetFundingPredChart
                  {...{
                    title: `Net Funding CVM Class - ${currClass}`,
                    smallV: false,
                    historic: chartsData[currClass]["historic"],
                    predictions: chartsData[currClass]["prediction"],
                    predList: false,
                    exportPosition: "bottom",
                  }}
                />
              );
            })}
          </div>
        </div>
      </main>
      <footer className="pt-10 bg-black">
        <a
          href="mailto:khess.dotto@predictfunds.com.br"
          className="block mb-4 ml-4 w-fit hover:text-blue-500 transition-all cursor-pointer"
        >
          Contact us at: khess.dotto@predictfunds.com.br
        </a>
        <Link href={"/signup"} className="hover:scale-110 transition-all">
          <div className="bg-yellow-200/20 hover:text-yellow-600 duration-200 text-2xl py-8 text-center border-t-2 hover:border-yellow-800">
            Sign Up For All Predictions!
          </div>
        </Link>
      </footer>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const ancoras = await getCachedAncoras();

  return {
    props: {
      ancoras,
    },
  };
};
