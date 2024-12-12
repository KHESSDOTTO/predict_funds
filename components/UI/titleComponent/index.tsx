import { TitleComponentPropsType } from "./titleComponentPropsType";

export default function TitleComponent({ children }: TitleComponentPropsType) {
  return (
    <h2 className="mb-4 text-lg max-w-fit px-8 p-2 text-white/90 border-white/90 font-semibold text-center border-b lg:pb-2 lg:max-w-full lg:px-4 lg:text-left">
      {children}
    </h2>
  );
}
