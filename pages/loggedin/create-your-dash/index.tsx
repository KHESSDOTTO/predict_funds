import CreateYourDashList from "@/components/general/createYourDash";
import Header from "@/components/layout/header";
import LogoPredict from "@/components/UI/logoPredict";
import { verifyToken } from "@/utils/jwt.config";
import { UserType } from "@/utils/types/generalTypes/types";
import { JwtPayload } from "jsonwebtoken";
import { GetServerSideProps } from "next";

export default function CreateYourDash({ user }: { user: UserType }) {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-black px-6 py-16">
        <LogoPredict bold={false} />
        <CreateYourDashList user={user} />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.loggedInUser;
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

  return {
    props: {
      user,
    },
  };
};
