import { PropsWithChildren } from "react";

type CommonProps<T = {}> = PropsWithChildren<T & {
  className?: string;
}>;

export default CommonProps;
