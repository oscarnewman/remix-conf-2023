import { deferIf } from "defer-if";

export function isNative(request) {
  const userAgent = request.headers.get("User-Agent");
  return !!userAgent?.match(/my-native-app/i);
}

export async function loader({ params }) {
  let playlist = getPlaylist(params.id);

  return deferIf({ playlist }, isNative(request));
}
