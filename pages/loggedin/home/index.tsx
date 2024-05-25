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

interface LoggedInHomePropsType {
  user: UserType;
}

export default function LoggedInHome({ user }: LoggedInHomePropsType) {
  const router = useRouter();
  const userContext = useContext(UserContext);

  useEffect(() => {
    console.log(user);
    if (!user) {
      console.log("There is no user!");
      router.push("/login");
      return;
    } else {
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
      <div className="min-h-screen min-w-screen relative min-h-screen bg-fixed bg-gradient-to-br from-black from-25% to-indigo-900/90 lg:to-indigo-900/90">
        <Header user={user} />
        <Dashboard user={user} />
        <div className="flex justify-center px-4 pb-4 lg:justify-center">
          <div onClick={handleLogout} className="mt-8 w-fit">
            <ButtonRed shadowColor="white" shadowSize="md">
              Log Out
            </ButtonRed>
          </div>
        </div>
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
  return {
    props: {
      user,
    },
  };
};
