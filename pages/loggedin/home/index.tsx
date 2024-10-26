import { verifyToken } from "@/utils/jwt.config";
import type { GetServerSideProps } from "next";
import type { JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import Dashboard from "@/components/general/dashboard";
import ButtonRed from "@/components/UI/buttonRed";
import Header from "@/components/layout/header";
import { ax } from "@/database/axios.config";
import { UserContext } from "@/contexts/UserContext";
import { UserType } from "@/utils/types";
import { consoleLog } from "@/functions/functions";
import getCachedAncoras from "@/cache/ancorasPredsCache";

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
      <div className="min-h-screen w-screen overflow-x-hidden relative bg-gradient-to-br bg-fixed from-85% from-gray-800/60 to-indigo-900/60">
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
  const token = req.cookies.loggedInUser as string; // Existence verification is made inside a middleware
  const loginUrl = "/login";
  let user: string | false | JwtPayload = false;

  if (token) {
    user = verifyToken(token);
  }

  if (!user) {
    return {
      redirect: {
        destination: loginUrl,
        permanent: false,
      },
    };
  }

  const ancoras = await getCachedAncoras();

  return {
    props: {
      user,
      ancoras,
    },
  };
};
