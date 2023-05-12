export async function loader({ params }) {
  const playlist = await getPlaylist(params.id);
  return { playlist };
}

export default function PlaylistPage() {
  const { playlist } = useLoaderData();

  return <PlaylistDetails playlist={playlist} />;
}
