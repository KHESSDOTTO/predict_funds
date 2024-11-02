import { ax } from "@/database/axios.config";
import toast from "react-hot-toast";
import type {
  HandleSubmitOutsideArgsType,
  HandleSubmitNoEmailArgsType,
  DoSubmitEmailChangeArgsType,
  HandleChangePwdArgsType,
} from "./profileTypes";

function handleSubmitOutside({
  formRef,
  handleSubmitNoEmail,
  user,
  form,
  setShowModal,
}: HandleSubmitOutsideArgsType) {
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
}: DoSubmitEmailChangeArgsType) {
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

async function handleChangePwd({ user }: HandleChangePwdArgsType) {
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
}: HandleSubmitNoEmailArgsType) {
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
