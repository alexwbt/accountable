import { useReducer } from "react";

const useForceUpdate = () =>
    useReducer(x => x + 1, 0)[1];

export default useForceUpdate;
