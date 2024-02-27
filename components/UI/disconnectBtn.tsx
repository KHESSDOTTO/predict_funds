import { ax } from "@/database/axios.config";
import toast from "react-hot-toast";

export default function DisconnectBtn() {
  async function handleClick() {
    const loadingToast = toast.loading("Disconnecting...");
    try {
      ax.post("/manually-disconnect");
      toast.success("Disconnected.");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong.");
    }
    toast.dismiss(loadingToast);
  }

  return (
    <>
      {process.env.NODE_ENV == "development" && (
        <button onClick={handleClick}>Disconnect</button>
      )}
    </>
  );
}
