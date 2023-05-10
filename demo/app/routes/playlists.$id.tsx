import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import type { DataFunctionArgs, V2_MetaFunction } from "@remix-run/node";
import { Await, useLoaderData, useNavigate } from "@remix-run/react";
import { deferIf } from "defer-if";
import { motion, useScroll, useTransform } from "framer-motion";
import { Suspense, useEffect, useRef } from "react";
import { notFound } from "remix-utils";
import { nameCache } from "~/lib/cache.server";
import { prisma } from "~/lib/db.server";
import { isNative, slowDown } from "~/util/async";
import { tailwind } from "~/util/tailwind";

export const meta: V2_MetaFunction = () => {
  return [{ name: "theme-color", content: "#fff" }];
};

export async function loader({ request, params }: DataFunctionArgs) {
  let playlist = slowDown(async () => {
    const result = await prisma.playlist.findFirst({
      where: {
        PlaylistId: Number(params.id),
      },
      include: {
        PlaylistTrack: {
          take: 50,
          include: {
            Track: {
              include: {
                Album: {
                  include: {
                    Artist: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!result) {
      throw notFound("Playlist not found");
    }
    return result;
  });

  const title = nameCache.get(Number(params.id)) ?? "Playlist";

  return deferIf({ playlist, title }, isNative(request));
}
export default function PlaylistDetails() {
  const { playlist, title } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

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
    <div className="h-[100dvh] w-full flex-1 flex flex-col relative">
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
          className="h-full grid w-full overflow-hidden text-ellipsis whitespace-nowrap min-w-0 items-center"
          style={{
            gridTemplateColumns: "1fr 4fr 1fr",
          }}
        >
          <button
            className="text-rose-500 md:invisible grow-0 flex items-center gap-0 px-1 py-1"
            onClick={() => navigate(-1)}
          >
            <ChevronLeftIcon className="h-5" />
            <span>Playlists</span>
          </button>
          <motion.h1
            className="font-medium shrink-0 overflow-hidden text-ellipsis whitespace-nowrap min-w-0 py-3 flex-1 flex justify-center "
            style={{
              opacity: useTransform(scrollY, range, [0, 0, 1]),
            }}
          >
            {title}
          </motion.h1>
        </div>
        <div></div>
      </motion.nav>

      <div className="overflow-y-auto flex-1 pb-16" ref={containerRef}>
        <motion.h1
          initial={{ opacity: 0, x: 5 }}
          animate={{ opacity: 1, x: 0 }}
          className="px-2 text-3xl font-semibold block text-ellipsis overflow-hidden whitespace-nowrap min-w-0"
        >
          {title}
        </motion.h1>
        <Suspense>
          <Await resolve={playlist}>
            {(playlist) => (
              <motion.div
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                className="px-3 py-3"
              >
                <ul className="divide-y divide-gray-100">
                  {playlist.PlaylistTrack.length === 0 && (
                    <p className="text-gray-400 -mx-1">No tracks yet.</p>
                  )}
                  {playlist.PlaylistTrack.map((track, i) => (
                    <li
                      key={track.TrackId}
                      className=" w-full py-2 flex items-start gap-1.5 overflow-hidden text-ellipsis"
                    >
                      <span className="text-gray-500">{i + 1}.</span>
                      <div className="overflow-hidden text-ellipsis ">
                        <div className="whitespace-nowrap text-ellipsis overflow-hidden min-w-0">
                          {track.Track.Name}
                        </div>
                        <div className="text-gray-500 whitespace-nowrap text-ellipsis overflow-hidden min-w-0">
                          {track.Track.Album?.Artist.Name}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
