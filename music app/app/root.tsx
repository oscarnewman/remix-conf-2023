import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import styles from "./tailwind.css";
import nprogressCss from "./nprogress.css";

import type { DataFunctionArgs } from "@remix-run/node";
import Layout from "~/components/Layout";
import { useRouteProgressBar } from "~/util/useRouteProgressBar";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: nprogressCss },
];

// export const meta: V2_MetaFunction = () => [
//   {
//     name: "viewport",
//     content: "initial-scale=1, viewport-fit=cover",
//     "viewport-fit": "cover",
//   },
// ];

export async function loader({ request, params }: DataFunctionArgs) {
  const userAgent = request.headers.get("User-Agent");
  const isMobile = userAgent?.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
  );

  return { isMobile };
}

export default function App() {
  const { isMobile } = useLoaderData<typeof loader>();
  useRouteProgressBar(!isMobile);

  return (
    <html
      lang="en"
      className="flex flex-col min-h-full overflow-x-hidden relative"
    >
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="initial-scale=1, viewport-fit=cover, width=device-width"
          viewport-fit="cover"
        />
        <Meta />
        <Links />
      </head>
      <body className="h-[100dvh] relative">
        <Layout />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <div className="absolute text-white text-xs top-[-500px]">
          {"A".repeat(2048)}
        </div>
      </body>
    </html>
  );
}
