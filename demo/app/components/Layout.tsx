import {
  MusicalNoteIcon,
  QueueListIcon,
  Square2StackIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { NavLink, Outlet } from "@remix-run/react";
import clsx from "clsx";

const navigation = [
  { name: "Playlists", href: "/playlists", icon: QueueListIcon },
  { name: "Albums", href: "/albums", icon: Square2StackIcon },
];

export default function Layout() {
  return (
    <div
      className="flex h-[100dvh] overflow-hidden max-w-screen"
      style={{
        paddingBottom: `calc(env(safe-area-inset-bottom) + 64px))`,
      }}
    >
      {/* Static sidebar for desktop */}
      <div className="hidden flex-shrink-0 lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <div className="flex h-16 shrink-0 items-center">
            <MusicalNoteIcon className="w-10 h-10 text-rose-700 bg-rose-50 rounded-full p-2" />
            <p className="text-rose-700 font-bold pl-2">
              remix.
              <span className="font-bold">tunes</span>
            </p>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          clsx(
                            isActive
                              ? "bg-gray-50 text-rose-600"
                              : "text-gray-700 hover:text-rose-600 hover:bg-gray-50",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <item.icon
                              className={clsx(
                                isActive
                                  ? "text-rose-600"
                                  : "text-gray-400 group-hover:text-rose-600",
                                "h-6 w-6 shrink-0"
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>

              <li className="-mx-6 mt-auto">
                <NavLink
                  to="/profile"
                  className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                >
                  <img
                    className="h-8 w-8 rounded-full bg-gray-50"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                  <span className="sr-only">Your profile</span>
                  <span aria-hidden="true">Tom Cook</span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
          Playlists
        </div>
      </div> */}

      <Outlet />
      <nav
        className="fixed bottom-0 border-t border-gray-200 grid md:hidden grid-cols-2 bg-gray-50/80 backdrop-blur-2xl inset-x-0 items-center pb-safe"
        style={{
          height: `calc(env(safe-area-inset-bottom) + 64px))`,
        }}
      >
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              clsx(
                isActive ? "text-rose-600" : "text-gray-700 ",
                "group flex flex-col items-center text-center rounded-md p-2 text-sm leading-6 font-semibold",
                "touch-manipulation"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={clsx(
                    isActive ? "text-rose-600" : "text-gray-400 ",
                    "h-5 w-5 shrink-0"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
