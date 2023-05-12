import { deferIf } from "defer-if";

export async function loader({ params }) {
  const playlistTitle = getPlaylistTitle(params.id); // we know this should be fast
  const playlist = getPlaylist(params.id);

  return deferIf({ playlist }, isNative(request));
}
