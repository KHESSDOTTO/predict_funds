import { TitleComponentPropsType } from "./titleComponentPropsType";

export default function TitleComponent({
  children,
  htmlTag = "h2",
}: TitleComponentPropsType) {
  const style =
    "mb-4 text-lg w-full px-8 p-2 text-white/90 border-white font-semibold text-center border-b-2 lg:border-b lg:mx-0 lg:pb-2 lg:max-w-full lg:px-4 lg:text-left";
  const mapHtmlTags = {
    h1: <h1 className={style}>{children}</h1>,
    h2: <h2 className={style}>{children}</h2>,
    h3: <h3 className={style}>{children}</h3>,
    h4: <h4 className={style}>{children}</h4>,
    h5: <h5 className={style}>{children}</h5>,
    h6: <h6 className={style}>{children}</h6>,
  };

  return <>{mapHtmlTags[htmlTag]}</>;
}
