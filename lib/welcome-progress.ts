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

// The logo's patterned fill: the 3D leaf logo's bare frame (video/logo-3d, build.py --welcome), lit,
// in its leaf-vein relief, laid in as the fill every piece of the drawing is clipped from
// (components/WelcomeLogo.tsx), and the scroll cue's mushroom (components/WelcomeCue.tsx). Its box is
// in the logo's units.
export const PATTERN_IMG = { href: "/img/logo-pattern.png", x: -14.1905, y: -6.4905, w: 1757.881, h: 445.881 };
