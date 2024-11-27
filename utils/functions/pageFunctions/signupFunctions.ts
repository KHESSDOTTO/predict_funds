import { HandleChangeSignUpForm, HandleSubmitSignUpParamsType } from "@/utils/types/pageTypes/signupTypes";
import toast from "react-hot-toast";

function handleChangeSignUpForm({
  e,
  setForm,
}: HandleChangeSignUpForm) {
  let newVal = e.target.value;

  switch (e.target.name) {
    case 'cnpj': {
      const cnpjNum = e.target.value.replaceAll(/[.\/-]/gm, "");
      const lenNum = cnpjNum.length;
      const len = e.target.value.length;
      const specialChars = [".", "/", "-"];

      if (! specialChars.includes(e.target.value[len - 2])) {
        switch (lenNum) {
          case 3:
            newVal =
              e.target.value.slice(0, lenNum - 1) +
              "." +
              e.target.value.slice(lenNum - 1, lenNum);
            break;
          case 6:
            newVal =
              e.target.value.slice(0, lenNum) +
              "." +
              e.target.value.slice(lenNum, lenNum + 1);
            break;
          case 9:
            newVal =
              e.target.value.slice(0, lenNum + 1) +
              "/" +
              e.target.value.slice(lenNum + 1, lenNum + 2);
            break;
          case 13:
            newVal =
              e.target.value.slice(0, lenNum + 2) +
              "-" +
              e.target.value.slice(lenNum + 2, lenNum + 3);
            break;
          case 15:
            newVal = e.target.value.slice(0, len - 1);
            break;
          default:
            break;
        }
      }
      break;
    }

    case "contactPhone": {
      const len = e.target.value.length;
      const lastChar = e.target.value[len - 1];
      
      if (len === 1 && lastChar !== "+") {
        newVal = "+" + newVal;
      }

      if (len > 14) {
        newVal = e.target.value.slice(0, len - 1);
      }
      
      break;
    }

    default:
      break;
  }

  setForm(prevForm => ({ ...prevForm, [e.target.name]: newVal }));
}

async function handleSubmitSignUpForm({
  e,
  form,
  ax,
  router,
}: HandleSubmitSignUpParamsType) {
  e.preventDefault();
  const clone = {
    ...form,
    contactPhone: form.contactPhone.replaceAll(/[+]/gm, ""),
    cnpjs: [form.cnpj],
  };
  if (clone.password !== clone.passwordConfirm) {
    console.log(
      "The 'password confirm' field does not match the 'password' field."
    );
    toast.error(
      "The 'password confirm' field does not match the 'password' field."
    );
    return;
  }
  const loading = toast.loading("Creating user...");
  try {
    await ax.post("/user/create", { ...clone });
    toast.success("User created successfully!");
    router.push("/login");
  } catch (err) {
    console.log(err);
    toast.error(
      "Error creating the user. Please, check the informations provided."
    );
  }
  toast.dismiss(loading);
}

export {
  handleSubmitSignUpForm,
  handleChangeSignUpForm,
}
