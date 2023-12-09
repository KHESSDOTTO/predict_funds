import { verifyToken } from "@/utils/jwt.config";
import type { GetServerSideProps } from "next";
import type { JwtPayload } from "jsonwebtoken";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { UserType } from "@/utils/types";
import Header from "@/components/layout/header";

export default function ProfilePage({ user }: any) {
  const router = useRouter();

  useEffect(() => {
    console.log(user);
    if (!user) {
      console.log("There is no user!");
      router.push("/login");
      return;
    }
    return;
  }, []);

  console.log("user");
  console.log(user);

  return (
    <div className="min-h-screen">
      <Header user={user}></Header>
      <main className="flex flex-col items-center py-8">
        <h1 className="text-2xl font-bold">Profile</h1>
        <section id="userInfos" className="flex flex-col py-8 gap-2 text-lg">
          <div className="flex gap-2">
            <span>Username:</span>
            <span>{user.username}</span>
          </div>
          <div className="flex gap-2">
            <span>Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="flex gap-2">
            <span>Address:</span>
            <span>{user.address}</span>
          </div>
          <div className="flex gap-2">
            <span>CNPJ:</span>
            <span>{user.cnpj}</span>
          </div>
          <div className="flex gap-2">
            <span>Phone:</span>
            <span>{user.contactPhone}</span>
          </div>
        </section>
      </main>
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
