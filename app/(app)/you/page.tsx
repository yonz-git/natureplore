import type { Metadata } from "next";

// You: the fourth tab. Until its screens are designed it holds one centred button, which does
// nothing yet: there are no accounts in v1.

export const metadata: Metadata = { title: "You" };

export default function You() {
  return (
    <section className="you" aria-label="You">
      <button type="button" className="btn btn-primary">
        Login or Signup
      </button>
    </section>
  );
}
