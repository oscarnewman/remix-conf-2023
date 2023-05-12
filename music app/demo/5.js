export function isNative(request) {
  const userAgent = request.headers.get("User-Agent");
  return !!userAgent?.match(/my-native-app/i);
}

export async function loader({ params }) {
  const playlist = getPlaylist(params.id);
  return defer({ playlist });
}
