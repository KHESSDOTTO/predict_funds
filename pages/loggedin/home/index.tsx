import { verifyToken } from "@/utils/jwt.config";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useUser } from "@/contexts/userContext";
import { consoleLog, doLogout } from "@/utils/functions/genericFunctions";
import toast from "react-hot-toast";
import Dashboard from "@/components/dashboardComponents";
import ButtonRed from "@/components/UI/buttonRed";
import Header from "@/components/layout/header";
import getCachedAncoras from "@/cache/ancorasPredsCache";
import type { GetServerSideProps } from "next";
import type { JwtPayload } from "jsonwebtoken";
import type { LoggedInHomePropsType } from "@/utils/types/pageTypes/homeType";
import type { DoLogoutParamsType } from "@/utils/types/generalTypes/types";

export default function LoggedInHome({ user, ancoras }: LoggedInHomePropsType) {
  const router = useRouter();
  const userContext = useUser();
  const dashboardProps = {
    user: user,
    ancoras: ancoras,
  };
  const doLogoutArgs: DoLogoutParamsType = { userContext, router };

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

    return () => {
      toast.dismiss();
    };
  }, []);

  return (
    <div className="bg-black/90">
      <div className="min-h-screen w-full overflow-x-hidden relative">
        <Header />
        <div className="px-4 lg:px-8">
          <Dashboard {...dashboardProps} />
        </div>
        <div className="flex justify-center px-4 py-8 lg:justify-center lg:mt-4">
          <div onClick={() => doLogout(doLogoutArgs)} className="w-fit">
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
