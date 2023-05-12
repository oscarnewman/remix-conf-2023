// create a function that randomly introduces latency between 150 and 750ms to an async function

// and calls that function immediately
export function slowDown<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  maxLatency = 500,
  minLatency = 750
) {
  const latency = Math.random() * (maxLatency - minLatency) + minLatency;
  return new Promise((resolve) => {
    setTimeout(() => resolve(fn()), latency);
  }) as ReturnType<T>;
}

export function isNative(request: Request) {
  return false;
  // const userAgent = request.headers.get("User-Agent");
  // return !!userAgent?.match(
  //   /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
  // );
}
