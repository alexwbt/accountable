import useEventListener from "./useEventListener";

const useKeyListener = (
  keys: string[],
  metaKeys: ("ctrlKey" | "shiftKey" | "altKey")[],
  callback: () => void,
  target: EventTarget | null = document.body,
) => {
  useEventListener(target, "keydown", e => {
    if (keys.includes(e.key) && metaKeys.every(m => e[m]))
      callback();
  });
};

export default useKeyListener;
