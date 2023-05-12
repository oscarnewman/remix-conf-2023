export function isNative(request) {
  const userAgent = request.headers.get("User-Agent");
  return !!userAgent?.match(/my-native-app/i);
}

export async function loader({ params }) {
  let playlist = getPlaylist(params.id);

  if (!isNative(request)) {
    playlist = await playlist;
  }

  return defer({ playlist });
}
