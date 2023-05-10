export async function loader({ params }) {
  const playlist = getPlaylist(params.id);
  return defer({ playlist });
}

export default function PlaylistPage() {
  const { playlist } = useLoaderData();

  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={playlist}>
        {(playlist) => <PlaylistDetails playlist={playlist} />}
      </Await>
    </Suspense>
  );
}
