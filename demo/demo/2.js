export async function loader({ params }) {
  const playlist = getPlaylist(params.id);
  return defer({ playlist });
}

export default function PlaylistPage() {
  const { playlist } = useLoaderData();

  return <PlaylistDetails playlist={playlist} />;
}
