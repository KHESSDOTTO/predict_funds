import type { ProfileFormPropsType } from "../profileTypes";

export default function ProfileForm({
  user,
  form,
  setForm,
  formRef,
  handleSubmitNoEmail,
  setShowModal,
}: ProfileFormPropsType) {
  const inputClass =
    "rounded-sm px-2 shadow-sm shadow-gray-600 text-black lg:w-[60vw]";

  return (
    <form
      ref={formRef}
      className="flex py-8 gap-4 lg:gap-12"
      onSubmit={(e) => handleSubmitNoEmail({ e, user, form, setShowModal })}
    >
      <div className="flex flex-col gap-8 lg:gap-12 lg:items-end">
        <label htmlFor="username">Username:</label>
        <label htmlFor="email">Email:</label>
        <label htmlFor="address">Address:</label>
        <label htmlFor="cnpj">CNPJ:</label>
        <label htmlFor="contactPhone">Phone:</label>
      </div>
      <div className="flex flex-col gap-8 lg:gap-12">
        <div className="flex gap-2">
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
        <div className="flex gap-2 italic">
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
        <div className="flex gap-2">
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
        <div className="flex gap-2">
          <input
            type="text"
            id="cnpj"
            name="cnpj"
            className={inputClass + " bg-gray-400 italic w-full"}
            value={form.cnpj}
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
            disabled
          />
        </div>
        <div className="flex gap-2">
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
