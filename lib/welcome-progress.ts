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

export const PATTERN_IMG = { href: "/img/logo-pattern.png", x: -14.1905, y: -6.4905, w: 1757.881, h: 445.881 };
