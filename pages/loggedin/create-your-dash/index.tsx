import CreateYourDashList from "@/components/general/createYourDash";
import Header from "@/components/layout/header";
import LogoPredict from "@/components/UI/logoPredict";

export default function CreateYourDash()
{
    return (
        <>
        <Header />
        <div className="min-h-screen bg-black px-6 py-16">
            <LogoPredict bold={false} />
            <CreateYourDashList />
        </div>
        </>
    )
}
