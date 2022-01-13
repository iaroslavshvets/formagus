import {useRef} from 'react';

export const useRunOnce = (callback: Function) => {
  const wasCalledRef = useRef<boolean>(false);
  if (!wasCalledRef.current) {
    callback();
    wasCalledRef.current = true;
  }
};
