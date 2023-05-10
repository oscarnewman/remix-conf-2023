import { useNavigation } from "@remix-run/react";
import nprogress from "nprogress";
import { useEffect } from "react";

/**
 * Renders the client-side progress bar when the route is changing.
 */
export function useRouteProgressBar(enabled: boolean) {
  const navigation = useNavigation();
  useEffect(() => {
    if (!enabled) return;
    if (navigation.state === "loading" || navigation.state === "submitting") {
      nprogress.start();
    } else {
      nprogress.done();
    }
  }, [enabled, navigation.state]);
}
