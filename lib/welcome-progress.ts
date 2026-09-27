// The welcome page's scroll progress, shared. components/WelcomeScroll.tsx works it out once, eased,
// and publishes it here; anything else that has to follow the same scroll reads it from here rather
// than listening to the scroll itself, so the page has one number and one chase.

type Follower = (progress: number) => void;

const followers = new Set<Follower>();
let latest = 0;

export function followProgress(fn: Follower) {
  followers.add(fn);
  fn(latest);
  return () => {
    followers.delete(fn);
  };
}

export function publishProgress(progress: number) {
  latest = progress;
  for (const fn of followers) fn(progress);
}
