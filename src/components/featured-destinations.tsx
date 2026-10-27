"use client"

import { ArrowRight, ArrowUpRight, CalendarDays, MapPin, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import * as React from "react"

import { buttonVariants } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

type Destination = {
  id: string
  title: string
  country: string
  image: string
  rating: number
  price: number
  duration: string
}

const destinations: Destination[] = [
  {
    id: "bali-paradise",
    title: "Bali Paradise",
    country: "Indonesia",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    rating: 4.5,
    price: 2700,
    duration: "7 Days/6 Nights",
  },
  {
    id: "maldives-escape",
    title: "Maldives Escape",
    country: "Maldives",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    price: 3200,
    duration: "5 Days/4 Nights",
  },
  {
    id: "santorini-sunsets",
    title: "Santorini Sunsets",
    country: "Greece",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    price: 2400,
    duration: "6 Days/5 Nights",
  },
  {
    id: "alps-explorer",
    title: "Alps Explorer",
    country: "Switzerland",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    price: 3500,
    duration: "8 Days/7 Nights",
  },
  {
    id: "kyoto-blossoms",
    title: "Kyoto Blossoms",
    country: "Japan",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    rating: 4.6,
    price: 2900,
    duration: "7 Days/6 Nights",
  },
]

/**
 * Tracks the currently visible slide via an external store, so no
 * setState-in-effect is needed (react-compiler lint friendly).
 */
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

function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <article className="group flex h-full flex-col">
      <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-muted">
        <Image
          src={destination.image}
          alt={`${destination.title}, ${destination.country}`}
          fill
          sizes="(min-width: 1280px) 44vw, (min-width: 1024px) 45vw, (min-width: 640px) 48vw, 86vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-sm font-medium text-slate-900 shadow-md">
          {destination.rating.toFixed(1)}
          <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="size-4" aria-hidden="true" />
        {destination.country}
      </div>

      <div className="mt-1 flex items-baseline justify-between gap-3">
        <h3 className="text-xl font-medium tracking-tight">{destination.title}</h3>
        <p className="whitespace-nowrap">
          <span className="text-lg font-semibold">${destination.price}</span>
          <span className="text-xs text-muted-foreground">/Person</span>
        </p>
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
        <CalendarDays className="size-4" aria-hidden="true" />
        {destination.duration}
      </div>

      <Link
        href={`/destinations/${destination.id}`}
        className="mt-4 inline-flex items-center gap-1 self-start text-sm font-semibold tracking-wide text-cyan-600 uppercase transition-colors hover:text-cyan-700"
      >
        Book Now
        <ArrowUpRight
          className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </Link>
    </article>
  )
}

export default function FeaturedDestinations() {
  const [api, setApi] = React.useState<CarouselApi>(undefined)
  const current = useCarouselIndex(api)
  const count = destinations.length

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-medium tracking-tight sm:text-5xl">
            Featured Destinations
          </h2>
          <p className="mt-3 text-muted-foreground">
            Handpicked travel experiences for the adventure seekers
          </p>
        </div>
        <Link
          href="/destinations"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-11 gap-3 rounded-md border-cyan-500 bg-transparent px-5 text-sm font-semibold tracking-wide text-cyan-600 uppercase hover:border-cyan-600 hover:bg-cyan-50 hover:text-cyan-700"
          )}
        >
          All Destinations
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: false }}
        className="mt-10 w-full"
      >
        <CarouselContent className="-ml-4">
          {destinations.map((destination) => (
            <CarouselItem
              key={destination.id}
              className="basis-[86%] pl-4 sm:basis-[48%] lg:basis-[45%]"
            >
              <DestinationCard destination={destination} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="mt-8 flex items-center gap-5">
          <p className="text-sm text-muted-foreground tabular-nums">
            <span className="text-lg text-foreground">{current + 1}</span>/{count}
          </p>
          <div
            role="presentation"
            className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-muted"
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-cyan-500 transition-[width] duration-300"
              style={{ width: `${((current + 1) / count) * 100}%` }}
            />
          </div>
          <div className="flex items-center gap-2">
            <CarouselPrevious className="static size-10 rounded-full" />
            <CarouselNext className="static size-10 rounded-full" />
          </div>
        </div>
      </Carousel>
    </section>
  )
}
