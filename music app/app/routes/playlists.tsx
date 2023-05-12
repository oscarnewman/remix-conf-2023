import { ChevronRightIcon, PlusIcon } from "@heroicons/react/24/outline";
import type { Playlist } from "@prisma/client";
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { defer } from "@remix-run/node";
import {
  Await,
  NavLink,
  Outlet,
  useLoaderData,
  useMatches,
} from "@remix-run/react";
import clsx from "clsx";
import { motion, useScroll, useTransform } from "framer-motion";
import { Suspense, useEffect, useRef } from "react";
import { nameCache } from "~/lib/cache.server";
import { prisma } from "~/lib/db.server";
import { isNative, slowDown } from "~/util/async";
import { deferIf } from "defer-if";
import { tailwind } from "~/util/tailwind";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};
function hydrateNames(playlists: Playlist[]) {
  for (const playlist of playlists) {
    if (playlist.Name) {
      nameCache.set(playlist.PlaylistId, playlist.Name);
    }
  }
}

export async function loader({ request, params }: LoaderArgs) {
  let playlists = slowDown(prisma.playlist.findMany);
  playlists.then(hydrateNames);

  if (!isNative(request)) {
    await playlists;
  }

  return defer({ playlists });
}

export default function Index() {
  const { playlists } = useLoaderData<typeof loader>();

  const matches = useMatches();
  const isPlaylistDetails = matches.some(
    (match) => match.id === "routes/playlists.$id"
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: containerRef });
  const range = [0, 30, 60];
  const navBackgroundColor = useTransform(scrollY, range, [
    tailwind.theme.colors.white,
    tailwind.theme.colors.white,
    tailwind.theme.colors.gray[50],
  ]);
  useEffect(() => {
    return navBackgroundColor.onChange((color) => {
      // change meta theme color
      document
        .querySelector("meta[name=theme-color]")
        ?.setAttribute("content", color);
    });
  }, [navBackgroundColor]);

  return (
    <>
      <div
        className={clsx(
          "md:w-96 flex-grow-0 flex-shrink-0 h-[100dvh] w-full flex flex-col relative md:border-r border-gray-100",
          {
            "hidden md:flex": isPlaylistDetails,
          }
        )}
      >
        <motion.nav
          className="pt-safe bg-white border-b bg-opacity-50  border-gray-200 top-0 flex justify-center"
          style={{
            height: "calc(env(safe-area-inset-top) + 64px)",
            paddingTop: "env(safe-area-inset-top)",
            backgroundColor: useTransform(scrollY, range, [
              tailwind.theme.colors.white,
              tailwind.theme.colors.white,
              tailwind.theme.colors.gray[50],
            ]),
            borderColor: useTransform(scrollY, range, [
              tailwind.theme.colors.white,
              tailwind.theme.colors.white,
              tailwind.theme.colors.gray[200],
            ]),
          }}
        >
          <div
            className="h-full grid w-full overflow-hidden text-ellipsis whitespace-nowrap min-w-0 items-center justify-center"
            style={{
              gridTemplateColumns: "1fr 4fr 1fr",
            }}
          >
            <div />
            <motion.h1
              className="font-medium shrink-0 overflow-hidden text-ellipsis whitespace-nowrap min-w-0 py-3 flex-1 flex justify-center "
              style={{
                opacity: useTransform(scrollY, range, [0, 0, 1]),
              }}
            >
              Playlists
            </motion.h1>
            <button className="text-rose-600 flex items-center gap-1">
              <span>New</span>
              <PlusIcon className="h-6 text-rose-600" />
            </button>
          </div>
        </motion.nav>

        <section className="overflow-y-auto flex-1 pb-16" ref={containerRef}>
          <motion.h1
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-2 text-3xl font-semibold block text-ellipsis overflow-hidden whitespace-nowrap min-w-0"
          >
            Playlists
          </motion.h1>

          <Suspense>
            <Await resolve={playlists}>
              {(playlists) => (
                <motion.ul
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="divide-y divide-gray-100"
                >
                  {playlists.map((playlist) => (
                    <li key={playlist.PlaylistId}>
                      <NavLink
                        className={({ isActive }) =>
                          clsx(
                            "px-4 py-2  hover:bg-gray-50 active:bg-gray-100 flex items-center justify-between",
                            { "bg-gray-50": isActive }
                          )
                        }
                        to={`/playlists/${playlist.PlaylistId}`}
                      >
                        <span>{playlist.Name}</span>
                        <ChevronRightIcon className="w-3 text-gray-400" />
                      </NavLink>
                    </li>
                  ))}
                </motion.ul>
              )}
            </Await>
          </Suspense>
        </section>
      </div>

      <Outlet />
    </>
  );
}
