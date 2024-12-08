import type { ProfileFormPropsType } from "@/utils/types/pageTypes/profileTypes";

export default function ProfileForm({
  user,
  form,
  setForm,
  formRef,
  handleSubmitNoEmail,
  setShowModal,
}: ProfileFormPropsType) {
  const inputClass =
    "rounded-full px-4 py-1 shadow-sm shadow-gray-600 text-black lg:w-[60vw]";
  const labelClass = 
    "w-24";

  return (
    <form
      ref={formRef}
      className="flex py-8 gap-4 lg:gap-12"
      onSubmit={(e) => handleSubmitNoEmail({ e, user, form, setShowModal })}
    >
      <div className="flex flex-col gap-8 lg:gap-12">
        <div className="flex items-center">
          <label className={labelClass} htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            className={inputClass}
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
          />
        </div>
        <div className="flex italic">
          <label className={labelClass} htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            className={inputClass}
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
          />
        </div>
        <div className="flex">
          <label className={labelClass} htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            className={inputClass}
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
          />
        </div>
        <div className="flex">
          <label className={labelClass} htmlFor="cnpj">CNPJ:</label>
          <input
            type="text"
            id="cnpj"
            name="cnpj"
            className={inputClass + " bg-gray-400 italic"}
            value={form.cnpj}
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
            disabled
          />
        </div>
        <div className="flex">
          <label className={labelClass} htmlFor="contactPhone">Phone:</label>
          <input
            type="text"
            id="contactPhone"
            name="contactPhone"
            className={inputClass}
            value={form.contactPhone}
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
          />
        </div>
      </div>
      <div className="hidden text-gray-100 lg:flex text-lg justify-center mb-4 underline font-semibold transition-all duration-300 hover:text-yellow-700 hover:border-yellow-700 hover:cursor-pointer lg:absolute lg:py-32 lg:border-l-2 lg:border-gray-100 lg:no-underline lg:pl-4 lg:right-[-45px] lg:bottom-[50%] lg:translate-y-[50%] lg:text-base lg:mb-0">
        <button type="submit">Save</button>
      </div>
    </form>
  );
}
