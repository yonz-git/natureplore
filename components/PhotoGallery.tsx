"use client";

// B1's photographs, opened large: the shadcn Dialog holding the shadcn Carousel (components/ui), one photo at a
// time, whole and uncropped, with previous, "2 of 3" and next under it. It opens on the photo that was tapped,
// loops at the ends, and steps with a swipe, the buttons or the arrow keys. Layout and motion: app/ui.css.

import { type RefObject, useEffect, useState } from "react";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

export type Photo = { src: string; alt: string };

/** `at` is the photo to open on, or null while the gallery is closed; `opener` gets the focus back on close */
export function PhotoGallery({
  photos,
  title,
  at,
  onClose,
  opener,
}: {
  photos: Photo[];
  title: string;
  at: number | null;
  onClose: () => void;
  opener?: RefObject<HTMLElement | null>;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [shown, setShown] = useState(0);
  // the open photo, kept while the gallery fades out so it does not jump back to the first
  const [start, setStart] = useState(0);
  if (at !== null && at !== start) setStart(at);

  useEffect(() => {
    if (!api) return;
    const pick = () => setShown(api.selectedScrollSnap());
    pick();
    api.on("select", pick);
    return () => {
      api.off("select", pick);
    };
  }, [api]);

  const many = photos.length > 1;
  return (
    <Dialog open={at !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="gallery"
        // the photos open from plain buttons, not a DialogTrigger, so the focus goes back to the one tapped by hand
        onCloseAutoFocus={(e) => {
          if (!opener?.current) return;
          e.preventDefault();
          opener.current.focus();
        }}
        // the arrow keys step wherever the focus is in the gallery, not only on the photo
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") api?.scrollPrev();
          else if (e.key === "ArrowRight") api?.scrollNext();
        }}
      >
        <DialogTitle className="sr-only">Photos of {title}</DialogTitle>
        <DialogDescription className="sr-only">
          {many ? "Swipe, or use the previous and next buttons or the arrow keys, to see the other photos." : "One photo."}
        </DialogDescription>
        <Carousel setApi={setApi} opts={{ startIndex: start, loop: many, duration: 32 }} className="gallery-track">
          <CarouselContent className="gallery-strip">
            {photos.map((p, i) => (
              <CarouselItem key={p.src} aria-label={`${i + 1} of ${photos.length}`} className="gallery-slide">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.alt} className="gallery-photo" draggable={false} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {many && (
            <div className="gallery-bar">
              <CarouselPrevious />
              <p className="gallery-count" aria-live="polite">
                {shown + 1} of {photos.length}
              </p>
              <CarouselNext />
            </div>
          )}
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
