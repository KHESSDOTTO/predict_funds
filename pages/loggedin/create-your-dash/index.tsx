import CreateYourDashList from "@/components/general/createYourDash";
import Header from "@/components/layout/header";

export default function CreateYourDash()
{
    return (
        <>
        <Header />
        <div className="h-screen">
            <CreateYourDashList />
        </div>
        </>
    )
}
