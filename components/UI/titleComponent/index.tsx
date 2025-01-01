import { TitleComponentPropsType } from "./titleComponentPropsType";

export default function TitleComponent({ children }: TitleComponentPropsType) {
  return (
    <h2
        className="
            mb-4 mx-2 text-lg w-full px-8 p-2 text-white/90 border-white font-semibold text-center border-b-2
            lg:border-b lg:mx-0 lg:pb-2 lg:max-w-full lg:px-4 lg:text-left">
      {children}
    </h2>
  );
}
