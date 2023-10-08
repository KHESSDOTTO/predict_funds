import { verifyToken } from "@/database/jwt.config";
import type { GetServerSideProps, NextApiRequest } from "next";
import type { JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LoggedInHome({ user }: any) {
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
    return;
  });
  return (
    <div>
      <h1>LoggedIn Home</h1>
      <p>Username: {user?.username}</p>
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
