import { ax } from "@/database/axios.config";
import toast from "react-hot-toast";
import type {
  HandleSubmitOutsideParamsType,
  HandleSubmitNoEmailParamsType,
  DoSubmitEmailChangeParamsType,
  HandleChangePwdParamsType,
} from "./profileTypes";

function handleSubmitOutside({
  formRef,
  handleSubmitNoEmail,
  user,
  form,
  setShowModal,
}: HandleSubmitOutsideParamsType) {
  const fakeSubmitEvent: React.FormEvent<HTMLFormElement> = {
    ...new Event("submit", { bubbles: true, cancelable: true }),
    currentTarget: formRef.current,
    target: formRef.current,
    preventDefault: () => {},
  } as unknown as React.FormEvent<HTMLFormElement>;

  handleSubmitNoEmail({ e: fakeSubmitEvent, user, form, setShowModal });
}

async function doSubmitEmailChange({
  e,
  setShowModal,
  form,
  user,
}: DoSubmitEmailChangeParamsType) {
  e.preventDefault();
  setShowModal(false);

  const confirmFormData = new FormData(e.currentTarget);
  const confirmFormValues = Object.fromEntries(confirmFormData.entries());
  const formData = { ...form, ...confirmFormValues };

  if (!confirmFormValues.pwd) {
    toast.error("Insert a password.");
    return;
  }

  const loading = toast.loading("Updating...");

  try {
    await ax.post(`/user/edit/${user._id}`, formData);
    toast.success("Informations updated!");
  } catch (err) {
    console.log(err);
    toast.error("An error occurred when trying to update the information.");
  }

  toast.dismiss(loading);
}

async function handleChangePwd({ user }: HandleChangePwdParamsType) {
  const loading = toast.loading("Sending e-mail...");

  try {
    await ax.post("/user/change-pwd-email", { _id: user._id });
    toast.success(`Sent e-mail for changing password to ${user.email}.`);
  } catch (err) {
    console.log(err);
    toast.error("An error occured when trying to update the informations.");
  }

  toast.dismiss(loading);
}

async function handleSubmitNoEmail({
  e,
  user,
  form,
  setShowModal,
}: HandleSubmitNoEmailParamsType) {
  e.preventDefault();

  if (user.email != form.email) {
    setShowModal(true);

    return;
  }

  const loading = toast.loading("Updating...");

  try {
    await ax.post(`/user/edit/${user._id}`, form);
    toast.success("Informations updated!");
  } catch (err) {
    console.log(err);
    toast.error("An error occured when trying to update the informations.");
  }

  toast.dismiss(loading);
}

export {
  handleSubmitOutside,
  handleSubmitNoEmail,
  handleChangePwd,
  doSubmitEmailChange,
};
