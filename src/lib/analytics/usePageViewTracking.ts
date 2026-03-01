import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

import { trackEvent } from "./track";

export function usePageViewTracking() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    trackEvent("page_view", {
      path: `${location.pathname}${location.search}${location.hash}`,
      navigationType,
    });
  }, [location.hash, location.pathname, location.search, navigationType]);
}
