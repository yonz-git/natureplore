import type { Metadata } from "next";

// You: the fourth tab. A placeholder in the Saved sheet's frame until its screens are designed.

export const metadata: Metadata = { title: "You" };

export default function You() {
  return (
    <section className="saved" aria-labelledby="you-title">
      <div className="saved-sheet glass">
        <h1 id="you-title">
          <em>You</em>
        </h1>
        <p>Coming soon</p>
      </div>
    </section>
  );
}
