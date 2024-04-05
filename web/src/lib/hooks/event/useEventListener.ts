import { useCallback, useEffect } from "react";

// only supports html element events for now
type EventMap = HTMLElementEventMap;

const useEventListener = <EventName extends keyof EventMap>(
  target: EventTarget | null,
  event: EventName,
  callback: (event: EventMap[EventName]) => void
) => {
  const update = useCallback((event: Event) => {
    callback(event as EventMap[EventName]);
  }, [callback]);
  useEffect(() => {
    target?.addEventListener(event, update);
    return () => {
      target?.removeEventListener(event, update);
    };
  }, [target, event, update]);
};

export default useEventListener;
