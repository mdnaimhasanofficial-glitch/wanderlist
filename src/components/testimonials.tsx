"use client"

import Image from "next/image"
import * as React from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

type Testimonial = {
  id: string
  quote: string
  name: string
  location: string
  avatar: string
}

const testimonials: Testimonial[] = [
  {
    id: "michael-chen",
    quote:
      "The Bali trip was absolutely magical! Every detail was perfect, from the luxury resorts to the cultural experiences. Truly unforgettable.",
    name: "Michael Chen",
    location: "Bangkok",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "sarah-johnson",
    quote:
      "Swiss Alps adventure exceeded all expectations. The mountain views were breathtaking and our guide was incredibly knowledgeable.",
    name: "Sarah Johnson",
    location: "New York, USA",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "amelia-rossi",
    quote:
      "Seamless planning from start to finish. The team handled every single detail of our Santorini honeymoon while we simply relaxed.",
    name: "Amelia Rossi",
    location: "Milan, Italy",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "david-miller",
    quote:
      "A once-in-a-lifetime experience in Kyoto — temples, food and the warmest locals. Everything ran exactly on time.",
    name: "David Miller",
    location: "London, UK",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  },
]

/** Current slide index as an external store (no setState-in-effect). */
function useCarouselIndex(api: CarouselApi) {
  return React.useSyncExternalStore(
    React.useCallback(
      (onStoreChange) => {
        if (!api) return () => {}
        api.on("select", onStoreChange)
        api.on("reInit", onStoreChange)
        return () => {
          api.off("select", onStoreChange)
          api.off("reInit", onStoreChange)
        }
      },
      [api]
    ),
    React.useCallback(() => (api ? api.selectedScrollSnap() : 0), [api]),
    () => 0
  )
}

export default function Testimonials() {
  const [api, setApi] = React.useState<CarouselApi>(undefined)
  const current = useCarouselIndex(api)

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
      <Carousel setApi={setApi} opts={{ align: "start", loop: false }}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
              What Travelers Say
            </h2>
            <p className="mt-3 text-muted-foreground">
              Real experiences from our happy travelers
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CarouselPrevious className="static size-10 rounded-full" />
            <CarouselNext className="static size-10 rounded-full" />
          </div>
        </div>

        <CarouselContent className="mt-10 -ml-4">
          {testimonials.map((testimonial) => (
            <CarouselItem
              key={testimonial.id}
              className="basis-[86%] pl-4 sm:basis-[62%] lg:basis-[48%]"
            >
              <figure className="grid h-full grid-cols-[1fr_auto] items-center gap-5 rounded-2xl border border-border/60 bg-white p-6">
                <div className="flex h-full flex-col justify-between gap-6">
                  <blockquote className="text-sm leading-relaxed text-foreground sm:text-base">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <figcaption className="pl-4">
                    <p className="text-sm font-medium text-cyan-600">
                      &mdash; {testimonial.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </figcaption>
                </div>
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={160}
                  height={160}
                  className="size-32 rounded-xl object-cover sm:size-40"
                />
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>

        <p className="sr-only" aria-live="polite">
          Testimonial {current + 1} of {testimonials.length}
        </p>
      </Carousel>
    </section>
  )
}
