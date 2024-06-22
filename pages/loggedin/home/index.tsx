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
import Card from "@/components/UI/card";

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
      <div className="min-h-screen min-w-screen relative bg-fixed bg-gradient-to-br from-black from-25% to-indigo-900/90 lg:to-indigo-900/90">
        <Header user={user} />
        <div className="flex gap-8 m-8">
          <Card
            title="IBOV"
            imgSrc="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8c3ZnIGhlaWdodD0iODVweCIgd2lkdGg9Ijg1cHgiIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIAoJIHZpZXdCb3g9IjAgMCAzMTAuNjc5IDMxMC42NzkiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxwYXRoIHN0eWxlPSJmaWxsOiMwMDk2Mzg7IiBkPSJNMTkzLjIwOCwyMjAuOTNsMzkuODExLDY4Ljk1NmM0Ni40MjQtMjYuODYxLDc3LjY2LTc3LjA1NCw3Ny42Ni0xMzQuNTQ2aC03OS42MTIKCQlDMjMxLjA2NiwxODMuMzY3LDIxNS44NCwyMDcuODM2LDE5My4yMDgsMjIwLjkzeiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGNkQ2ODsiIGQ9Ik0xNTUuMzM5LDc5LjYxNGMxMy43OTcsMCwyNi43MjgsMy42OTEsMzcuODY5LDEwLjEzNmwzOS44MTEtNjguOTU2CgkJQzIxMC4xNjgsNy41NzMsMTgzLjYzOCwwLjAwMSwxNTUuMzM4LDAuMDAxYy0yOC4yOTksMC01NC44MjgsNy41NzEtNzcuNjc5LDIwLjc5MmwzOS44MTIsNjguOTU2CgkJQzEyOC42MTEsODMuMzA1LDE0MS41NDQsNzkuNjE0LDE1NS4zMzksNzkuNjE0eiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGQzg0MzsiIGQ9Ik0yMzMuMDE5LDIwLjc5NEwxOTMuMjA4LDg5Ljc1YzIyLjYzMSwxMy4wOTUsMzcuODU4LDM3LjU2MywzNy44NTgsNjUuNTkxaDc5LjYxMgoJCUMzMTAuNjc5LDk3Ljg0OCwyNzkuNDQyLDQ3LjY1NSwyMzMuMDE5LDIwLjc5NHoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNCRjUzNEY7IiBkPSJNMTE3LjQ3MSw4OS43NUw3Ny42NTksMjAuNzk0QzMxLjIzNSw0Ny42NTUsMCw5Ny44NDgsMCwxNTUuMzRoNzkuNjEyCgkJQzc5LjYxMiwxMjcuMzEzLDk0Ljg0LDEwMi44NDQsMTE3LjQ3MSw4OS43NXoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiMwMDcxQ0U7IiBkPSJNNzkuNjEyLDE1NS4zNEgwYzAsNTcuNDkyLDMxLjIzNSwxMDcuNjg1LDc3LjY1OCwxMzQuNTQ1bDM5LjgxMi02OC45NTYKCQlDOTQuODM5LDIwNy44MzUsNzkuNjEyLDE4My4zNjcsNzkuNjEyLDE1NS4zNHoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiM1RTk2REM7IiBkPSJNMTU1LjMzOSwyMzEuMDY2Yy0xMy43OTYsMC0yNi43MjktMy42OTEtMzcuODY5LTEwLjEzN2wtMzkuODEyLDY4Ljk1NgoJCWMyMi44NTIsMTMuMjIyLDQ5LjM4MSwyMC43OTMsNzcuNjgsMjAuNzkzYzI4LjMsMCw1NC44MzEtNy41NzEsNzcuNjgtMjAuNzkzbC0zOS44MTEtNjguOTU2CgkJQzE4Mi4wNjgsMjI3LjM3NiwxNjkuMTM2LDIzMS4wNjYsMTU1LjMzOSwyMzEuMDY2eiIvPgo8L2c+Cjwvc3ZnPg=="
            nameValsArr={[
              { name: "Correl.", value: 0.35 },
              // { name: "Correl.", value: 0.35 },
            ]}
          />
          <Card
            title="IBOV"
            imgSrc="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8c3ZnIGhlaWdodD0iODVweCIgd2lkdGg9Ijg1cHgiIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIAoJIHZpZXdCb3g9IjAgMCAzMTAuNjc5IDMxMC42NzkiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxwYXRoIHN0eWxlPSJmaWxsOiMwMDk2Mzg7IiBkPSJNMTkzLjIwOCwyMjAuOTNsMzkuODExLDY4Ljk1NmM0Ni40MjQtMjYuODYxLDc3LjY2LTc3LjA1NCw3Ny42Ni0xMzQuNTQ2aC03OS42MTIKCQlDMjMxLjA2NiwxODMuMzY3LDIxNS44NCwyMDcuODM2LDE5My4yMDgsMjIwLjkzeiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGNkQ2ODsiIGQ9Ik0xNTUuMzM5LDc5LjYxNGMxMy43OTcsMCwyNi43MjgsMy42OTEsMzcuODY5LDEwLjEzNmwzOS44MTEtNjguOTU2CgkJQzIxMC4xNjgsNy41NzMsMTgzLjYzOCwwLjAwMSwxNTUuMzM4LDAuMDAxYy0yOC4yOTksMC01NC44MjgsNy41NzEtNzcuNjc5LDIwLjc5MmwzOS44MTIsNjguOTU2CgkJQzEyOC42MTEsODMuMzA1LDE0MS41NDQsNzkuNjE0LDE1NS4zMzksNzkuNjE0eiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGQzg0MzsiIGQ9Ik0yMzMuMDE5LDIwLjc5NEwxOTMuMjA4LDg5Ljc1YzIyLjYzMSwxMy4wOTUsMzcuODU4LDM3LjU2MywzNy44NTgsNjUuNTkxaDc5LjYxMgoJCUMzMTAuNjc5LDk3Ljg0OCwyNzkuNDQyLDQ3LjY1NSwyMzMuMDE5LDIwLjc5NHoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNCRjUzNEY7IiBkPSJNMTE3LjQ3MSw4OS43NUw3Ny42NTksMjAuNzk0QzMxLjIzNSw0Ny42NTUsMCw5Ny44NDgsMCwxNTUuMzRoNzkuNjEyCgkJQzc5LjYxMiwxMjcuMzEzLDk0Ljg0LDEwMi44NDQsMTE3LjQ3MSw4OS43NXoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiMwMDcxQ0U7IiBkPSJNNzkuNjEyLDE1NS4zNEgwYzAsNTcuNDkyLDMxLjIzNSwxMDcuNjg1LDc3LjY1OCwxMzQuNTQ1bDM5LjgxMi02OC45NTYKCQlDOTQuODM5LDIwNy44MzUsNzkuNjEyLDE4My4zNjcsNzkuNjEyLDE1NS4zNHoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiM1RTk2REM7IiBkPSJNMTU1LjMzOSwyMzEuMDY2Yy0xMy43OTYsMC0yNi43MjktMy42OTEtMzcuODY5LTEwLjEzN2wtMzkuODEyLDY4Ljk1NgoJCWMyMi44NTIsMTMuMjIyLDQ5LjM4MSwyMC43OTMsNzcuNjgsMjAuNzkzYzI4LjMsMCw1NC44MzEtNy41NzEsNzcuNjgtMjAuNzkzbC0zOS44MTEtNjguOTU2CgkJQzE4Mi4wNjgsMjI3LjM3NiwxNjkuMTM2LDIzMS4wNjYsMTU1LjMzOSwyMzEuMDY2eiIvPgo8L2c+Cjwvc3ZnPg=="
            nameValsArr={[
              { name: "Correl.", value: 0.35 },
              { name: "Correl.", value: 0.35 },
            ]}
          />
        </div>
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
