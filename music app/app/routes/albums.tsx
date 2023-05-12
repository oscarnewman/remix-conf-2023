import { faker } from "@faker-js/faker";
import type { DataFunctionArgs } from "@remix-run/node";
import { Await, useLoaderData, useNavigate } from "@remix-run/react";
import { deferIf } from "defer-if";
import { motion, useScroll, useTransform } from "framer-motion";
import { Suspense, useEffect, useRef } from "react";
import { prisma } from "~/lib/db.server";
import { deferNative, isNative, slowDown } from "~/util/async";
import { tailwind } from "~/util/tailwind";

export async function loader({ request, params }: DataFunctionArgs) {
  const albums = slowDown(async () => {
    const result = await prisma.album.findMany({
      include: {
        Artist: true,
        Track: true,
      },
    });
    return result;
  });

  return deferIf({ albums }, isNative(request));
}

export default function Albums() {
  const { albums } = useLoaderData<typeof loader>();
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
          <div></div>
          <motion.h1
            className="font-medium shrink-0 overflow-hidden text-ellipsis whitespace-nowrap min-w-0 py-3 flex-1 flex justify-center "
            style={{
              opacity: useTransform(scrollY, range, [0, 0, 1]),
            }}
          >
            Albums
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
          Albums
        </motion.h1>

        <Suspense>
          <Await resolve={albums}>
            {(albums) => (
              <motion.div
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 px-2 py-4"
              >
                {albums.map((album) => (
                  <div
                    key={album.AlbumId}
                    className="flex flex-col items-stretch gap-1"
                  >
                    <img
                      alt="Album"
                      src={faker.image.abstract(300, 300, true)}
                      className=" rounded-lg aspect-square w-full bg-gray-100"
                    ></img>
                    <div className="text-left">
                      <h3 className="text-sm font-semibold">{album.Title}</h3>
                      <h3 className="text-sm">{album.Artist.Name}</h3>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
