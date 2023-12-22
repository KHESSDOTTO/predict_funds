import { verifyToken } from "@/utils/jwt.config";
import type { GetServerSideProps } from "next";
import type { JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import Dashboard from "@/components/sections/netFunding/dashboard/dashboard";
import ButtonRed from "@/components/UI/buttonRed";
import Header from "@/components/layout/header";
import { ax } from "@/database/axios.config";
import { UserContext } from "@/contexts/UserContext";

export default function LoggedInHome({ user }: any) {
  const router = useRouter();
  const userContext = useContext(UserContext);

  useEffect(() => {
    console.log(user);
    if (!user) {
      console.log("There is no user!");
      router.push("/login");
      return;
    }
    userContext.setUser(user);
    return;
  }, []);

  async function handleLogout() {
    try {
      await ax.post("/user/logout");
      userContext.setUser(null);
      toast.success("Logged out.");
      router.push("/");
    } catch (err) {
      console.log(err);
      toast.error("Error logging out.");
    }
  }

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-t relative min-h-screen md:bg-gradient-to-l">
      <Header user={user} />
      <Dashboard user={user} />
      <div className="flex justify-center px-4 pb-4 lg:justify-end">
        <div onClick={handleLogout} className="w-fit">
          <ButtonRed>Log Out</ButtonRed>
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
