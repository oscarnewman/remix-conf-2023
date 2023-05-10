export async function loader({ params }) {
  const playlist = getPlaylist(params.id);
  return defer({ playlist });
}
