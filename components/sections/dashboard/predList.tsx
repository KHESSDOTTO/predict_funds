import ButtonIndigo from "@/components/UI/buttonIndigo";

interface PredListPropsType {
  title: string;
}

export default function PredList({ title }: PredListPropsType) {
  return (
    <div className="h-full w-full bg-white/90 p-2 border-b-2 border-black lg:rounded-md lg:border-2 relative">
      {title && (
        <h2 className="font-bold border-t border-b mb-1 text-center border-black text-base py-1">
          {title}
        </h2>
      )}
      <table className="w-full border-b border-gray-300">
        <thead className="border-b-2 border-black">
          <tr>
            <th>Period</th>
            <th>Number of periods</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center border-b border-gray-300">
            <td className="p-0">Week</td>
            <td className="p-0">1</td>
            <td className="p-0">500000</td>
            <td className="text-red-800 p-1 text-base align-middle p-0">
              <button className="hover:text-red-600">x</button>
            </td>
          </tr>
          <tr className="text-center border-b border-gray-300">
            <td className="p-0">Month</td>
            <td className="p-0">3</td>
            <td className="p-0">-3000</td>
            <td className="text-red-800 p-0 text-base">
              <button className="p-0 hover:text-red-600">x</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-center items-center mt-2">
        <button className="text-indigo-800 text-xs font-semibold hover:underline">
          + Add Prediction
        </button>
      </div>
      <div className="absolute bottom-2 w-full text-center">
        <ButtonIndigo>Save</ButtonIndigo>
      </div>
    </div>
  );
}
