import { verifyToken } from "@/utils/jwt.config";
import type { GetServerSideProps } from "next";
import type { JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import Dashboard from "@/components/sections/dashboard/dashboard";
import ButtonRed from "@/components/UI/buttonRed";
import Header from "@/components/layout/header";
import { ax } from "@/database/axios.config";
import { UserContext } from "@/contexts/UserContext";
import { UserType } from "@/utils/types";
import { consoleLog } from "@/functions/functions";

interface LoggedInHomePropsType {
  user: UserType;
  ancoras: string[] | null;
}

export default function LoggedInHome({ user, ancoras }: LoggedInHomePropsType) {
  const router = useRouter();
  const userContext = useContext(UserContext);
  const dashboardProps = {
    user: user,
    ancoras: ancoras,
  };

  useEffect(() => {
    if (!user) {
      console.log("There is no user!");
      router.push("/login");
      return;
    }

    const noUserInContext = userContext.user === null;

    if (noUserInContext) {
      userContext.setUser(user);
    }

    return;
  }, []);

  async function handleLogout() {
    try {
      userContext.setUser(null);
      userContext.setCenarios([]);
      await ax.post("/user/logout");
      toast.success("Logged out.");
      router.push("/");
    } catch (err) {
      console.log(err);
      toast.error("Error logging out.");
    }
  }

  return (
    <div className="bg-black">
      <div className="min-h-screen w-screen overflow-x-hidden relative bg-gray-800/70">
        <Header user={user} />
        <Dashboard {...dashboardProps} />
        <div className="flex justify-center px-4 pb-4 lg:justify-center">
          <div onClick={handleLogout} className="mt-8 w-fit">
            <ButtonRed shadowColor="white/30" shadowSize="md">
              Log Out
            </ButtonRed>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const ancorasResponse: any = await ax.get("/prediction/getAncoras");
  const ancoras = ancorasResponse.data;

  const token = req.cookies.loggedInUser;
  let user: string | false | JwtPayload = false;

  if (token) {
    user = verifyToken(token);
  }

  return {
    props: {
      user,
      ancoras,
    },
  };
};
