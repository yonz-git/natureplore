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

// The descent: once the opening has played and the logo is built, the page goes on down through the
// forest by itself (the film behind it, components/WelcomeZoom.tsx), the logo turning to leaves and
// its symbol flying to the corner, and ends on A0. Its progress, 0 to 1, runs over DESCENT_SECONDS,
// published by components/WelcomeLogo.tsx. false: the page stops at A0 as before.
export const DESCENT = true;
export const DESCENT_SECONDS = 6;
// The whole welcome is one flow: the first touch of the scroll sets it going, and the opening (the
// circle, the line leaving, the logo starting) glides through on its own over OPEN_SECONDS instead of
// following the wheel, straight into the logo and the descent.
export const OPEN_SECONDS = 3;
// The film behind runs on its own clock from the end of the opening, so it is already gliding while
// the logo finishes building, and comes to rest on the forest as the symbol lands.
export const FILM_SECONDS = 7.5;
// screens of scroll the opening takes (the page was 350vh tall, one screen of it on view)
export const OPEN_SCREENS = 2.5;
const descentFollowers = new Set<Follower>();
let descent = 0;
export function followDescent(fn: Follower) {
  descentFollowers.add(fn);
  fn(descent);
  return () => {
    descentFollowers.delete(fn);
  };
}
export function publishDescent(d: number) {
  descent = d;
  for (const fn of descentFollowers) fn(d);
}

export function publishProgress(progress: number) {
  latest = progress;
  for (const fn of followers) fn(progress);
}
