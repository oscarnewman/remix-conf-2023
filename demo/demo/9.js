import { cachified } from "cachified";

// routes/playlists.$id.js
export async function loader({ params }) {
  const { id } = params;
  const playlist = cachified(`playlist-${id}`, getPlaylist(id), {
    ttl: 30,
    staleWhileRevalidate: 3600,
  });

  return deferIf({ playlist }, isNative(request));
}

// routes/playlists.js
export async function loader() {
  const playlists = await getPlaylists();

  return defer({ playlists });
}

// routes/playlists.js
export async function loader() {
  const playlists = await getPlaylists();

  // async function we don't await
  fetchAndHydratePlaylistCache(playlists);

  return defer({ playlists });
}

const wait = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loader() {
  const playlists = getPlaylists();

  await Promise.race([
    new Promise((resolve) => setTimeout(resolve, 50)),
    playlists,
  ]);

  return defer({ playlists });
}
