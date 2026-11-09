/** Settle cached, successful, and failed resources without an artificial delay. */
export function waitForEvent(
  target: EventTarget,
  events: string[],
  alreadyReady: boolean,
  signal: AbortSignal,
): Promise<void> {
  if (alreadyReady || signal.aborted) return Promise.resolve();
  return new Promise((resolve) => {
    const finish = () => {
      events.forEach((event) => target.removeEventListener(event, finish));
      signal.removeEventListener("abort", finish);
      resolve();
    };
    events.forEach((event) => target.addEventListener(event, finish, { once: true }));
    signal.addEventListener("abort", finish, { once: true });
  });
}

export async function waitForPageReady(
  imageSrc: string,
  signal: AbortSignal,
  onProgress: (completed: number) => void,
) {
  let completed = 0;
  const track = async (task: Promise<unknown>) => {
    await task.catch(() => undefined);
    if (!signal.aborted) onProgress(++completed);
  };
  const image = new Image();
  // Listen before starting the request, including cache hits.
  const imageLoaded = waitForEvent(image, ["load", "error"], false, signal);
  image.src = imageSrc;
  const imageReady = (async () => {
    if (!image.complete) await imageLoaded;
    if (!signal.aborted && image.naturalWidth > 0) await image.decode?.();
  })();
  await Promise.all([
    track(waitForEvent(window, ["load"], document.readyState === "complete", signal)),
    track(document.fonts?.ready ?? Promise.resolve()),
    track(imageReady),
  ]);
}
