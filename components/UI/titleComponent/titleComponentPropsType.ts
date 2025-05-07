import { ReactNode } from "react";

interface TitleComponentPropsType {
  children: ReactNode;
  htmlTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export type { TitleComponentPropsType };
