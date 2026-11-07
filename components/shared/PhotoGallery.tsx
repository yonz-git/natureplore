"use client";

import { type RefObject, useEffect, useState } from "react";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

export type Photo = { src: string; alt: string };

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
        onCloseAutoFocus={(e) => {
          if (!opener?.current) return;
          e.preventDefault();
          opener.current.focus();
        }}
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
