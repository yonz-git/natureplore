"use client";

// C4 · Registered: am I signed up? A sheet over the clean-up with the details, Add to calendar,
// and where the registration is kept. Nothing was sent anywhere, so nothing says it was emailed.
// Back to the claim goes to the claim the clean-up answers; close returns to the clean-up (C3);
// Cancel registration takes it off the device and returns there too. Opened without a
// registration (from an old link, or after cancelling), it says so and offers the clean-up.
// Boards: C4, phone, tablet and desktop.

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Dialog, Facts } from "@/components/CParts";
import { CalendarIcon, CheckIcon, CloseIcon } from "@/components/Icons";
import type { CleanUp } from "@/lib/actions";
import { useSaved } from "@/lib/saved";

/** A calendar file for the clean-up, made here: nothing is fetched and nothing is sent. */
function addToCalendar(a: CleanUp) {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Natureplore prototype//EN",
    "BEGIN:VEVENT",
    `UID:${a.id}-2026@natureplore.prototype`,
    `DTSTART;TZID=Europe/Berlin:${a.calendar.start}`,
    `DTEND;TZID=Europe/Berlin:${a.calendar.end}`,
    `SUMMARY:${a.title} ${a.close}`,
    `LOCATION:${a.calendar.location}`,
    "DESCRIPTION:Bring sturdy shoes and water. Organiser: local nature group.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "september-clean-up.ics";
  link.click();
  URL.revokeObjectURL(url);
}

export default function RegisteredDialog({ action: a }: { action: CleanUp }) {
  const router = useRouter();
  const { isSaved, toggle } = useSaved();
  const key = `action:${a.id}`;
  const registered = isSaved(key);
  const actionHref = `/learn/action/${a.id}`;

  return (
    <Dialog labelledBy="c4-title" close={actionHref}>
      <div className="cp-dialog-head">
        <span className="cp-done-mark" aria-hidden="true">
          <CheckIcon size={30} />
        </span>
        <Link href={actionHref} replace className="round cp-close" aria-label="Close">
          <CloseIcon size={20} />
        </Link>
      </div>

      {registered ? (
        <>
          <h1 id="c4-title" tabIndex={-1} className="cp-dialog-title">
            You are registered for the <em>September clean-up</em>
          </h1>
          <div className="org-box cp-reg">
            <Facts items={a.registered} />
            <hr />
            <button type="button" className="btn btn-secondary" onClick={() => addToCalendar(a)}>
              <CalendarIcon size={19} />
              Add to calendar
            </button>
          </div>
          <p className="org-small">Kept on this device, in Saved under Actions</p>
          <div className="cp-out">
            <Link href={`/learn/claim/${a.claimId}`} className="btn btn-primary">
              Back to the claim
            </Link>
            <button
              type="button"
              className="cp-link cp-cancel"
              onClick={() => {
                toggle(key);
                router.replace(`${actionHref}#register`);
              }}
            >
              Cancel registration
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 id="c4-title" tabIndex={-1} className="cp-dialog-title">
            You are not registered for the <em>September clean-up</em>
          </h1>
          <p className="org-body">Registering asks for nothing and is kept on this device.</p>
          <div className="cp-out">
            <Link href={actionHref} replace className="btn btn-primary">
              Go to the clean-up
            </Link>
          </div>
        </>
      )}
    </Dialog>
  );
}
