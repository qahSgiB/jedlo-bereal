import { useEffect, useRef } from "react";



function useDocumentTitle(title: string, restoreOnUnmount = true) {
  const originalTitle = useRef(document.title);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => (() => {
    if (restoreOnUnmount) {
      document.title = originalTitle.current;
    }
  }), [restoreOnUnmount]);
}



export default useDocumentTitle;