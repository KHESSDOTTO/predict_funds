import { verifyToken } from "@/utils/jwt.config";
import type { GetServerSideProps, NextApiRequest } from "next";
import type { JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/router";
import { SetStateAction, useEffect, useState } from "react";
import { ax } from "@/database/axios.config";
import toast from "react-hot-toast";
import Dashboard from "@/components/sections/dashboard";
import ButtonRed from "@/components/UI/buttonRed";
import Header from "@/components/layout/header";

interface DataResponse {
  DT_COMPTC: Date;
  CNPJ_FUNDO: string;
  VL_QUOTA?: number;
  VL_TOTAL?: number;
  CAPTC_DIA?: number;
  NR_COTST?: number;
  TP_FUNDO: string;
  VL_PATRIM_LIQ?: number;
  RESG_DIA?: number;
  CAPTC_LIQ?: number;
}

export default function LoggedInHome({ user }: any) {
  const [data, setData] = useState([]);
  console.log("data");
  console.log(data);

  const router = useRouter();

  useEffect(() => {
    console.log(user);
    if (!user) {
      console.log("There is no user!");
      router.push("/login");
      return;
    }
    const getData = async () => {
      try {
        let newData = await ax.get("/rawData/getAllFromCnpj");
        // newData = newData.data.slice(-90, -1);
        setData(newData.data);
        console.log("Here after setData(newData);");
        return;
      } catch (err) {
        console.log(err);
      }
    };
    getData();
    return;
  }, []);

  async function handleLogout() {
    try {
      await ax.post("/user/logout");
      toast.success("Logged out.");
      router.push("/");
    } catch (err) {
      console.log(err);
      toast.error("Error logging out.");
    }
  }

  return (
    <div className="min-h-screen min-w-screen bg-gray-300 relative min-h-screen">
      <Header user={user} />
      <Dashboard data={data} />
      {/* <div>
        <h1>Data below</h1>
        {data &&
          data.map((cE) => {
            return (
              <>
                <p>{cE.DT_COMPTC.toLocaleString()}</p>
                <p>{cE.CAPTC_LIQ}</p>
              </>
            );
          })}
      </div> */}
      <div className="flex justify-end px-4 pb-4">
        <ButtonRed onClick={handleLogout}>Log Out</ButtonRed>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.loggedInUser;
  let user: string | false | JwtPayload = false;
  if (token) {
    user = verifyToken(token);
  }
  user["formatedCnpj"] =
    user.cnpj.slice(0, 2) +
    "." +
    user.cnpj.slice(2, 5) +
    "." +
    user.cnpj.slice(5, 8) +
    "/" +
    user.cnpj.slice(8, 12) +
    "-" +
    user.cnpj.slice(12, 14);
  return {
    props: {
      user,
    },
  };
};
