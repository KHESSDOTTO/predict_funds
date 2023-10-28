import { verifyToken } from "@/utils/jwt.config";
import type { GetServerSideProps, NextApiRequest } from "next";
import type { JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ax } from "@/database/axios.config";
import toast from "react-hot-toast";
import Dashboard from "./dashboard";

export default function LoggedInHome({ user }: any) {
  const router = useRouter(),
    btnClass =
      "mx-4 my-2 py-2 px-4 border-2 border-red-900 rounded-md bg-gradient-to-b from-red-700 to-red-500 text-white font-semibold hover:text-lg hover:transition-all hover:text-yellow-200/90 hover:underline";
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
    return;
  });
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
    <div className="min-h-screen min-w-screen">
      <h1>LoggedIn Home</h1>
      <p>Username: {user?.username}</p>
      {/* <Dashboard /> */}
      <button onClick={handleLogout} className={btnClass}>
        Log Out
      </button>
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
