"use client";

import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Plane,
  SearchX,
  Star,
  TriangleAlert,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Destination } from "@/lib/destinations";

const ALL = "all";

const PRICE_RANGES = [
  { value: "any", label: "Any price", min: 0, max: Infinity },
  { value: "under-2000", label: "Under $2,000", min: 0, max: 2000 },
  { value: "2000-3000", label: "$2,000 – $3,000", min: 2000, max: 3000 },
  { value: "over-3000", label: "Over $3,000", min: 3000, max: Infinity },
] as const;

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "name", label: "Name: A to Z" },
] as const;

const OPTIMIZED_HOSTS = new Set(["images.unsplash.com"]);

function canOptimize(url: string): boolean {
  try {
    return OPTIMIZED_HOSTS.has(new URL(url).hostname);
  } catch {
    return false;
  }
}

function applyFilters(
  destinations: Destination[],
  category: string | null,
  priceRange: string | null,
  sortBy: string | null
): Destination[] {
  const range =
    PRICE_RANGES.find((option) => option.value === (priceRange ?? "any")) ??
    PRICE_RANGES[0];

  const filtered = destinations.filter((destination) => {
    const matchesCategory =
      category === null || category === ALL
        ? true
        : destination.category === category;
    const matchesPrice =
      destination.price >= range.min && destination.price < range.max;
    return matchesCategory && matchesPrice;
  });

  switch (sortBy ?? "featured") {
    case "price-asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "name":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break;
  }

  return filtered;
}

function DestinationCard({ destination }: { destination: Destination }) {
  const [imageFailed, setImageFailed] = React.useState(false);

  const showImage = Boolean(destination.imageUrl) && !imageFailed;
  const imageAlt = `${destination.name}, ${destination.country}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card transition-shadow duration-300 hover:shadow-md">
      <div className="relative aspect-[2/1] overflow-hidden bg-muted">
        {showImage ? (
          <Image
            src={destination.imageUrl}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            unoptimized={!canOptimize(destination.imageUrl)}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-linear-to-br from-sky-100 via-cyan-50 to-sky-200 text-cyan-700">
            <Plane className="size-8" aria-hidden="true" />
            <span className="sr-only">{imageAlt}</span>
          </div>
        )}

        <span className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-semibold text-slate-900 shadow-sm tabular-nums">
          {destination.rating.toFixed(1)}
          <Star className="size-3 fill-current text-slate-900" aria-hidden="true" />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
          {destination.country}
        </p>

        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-xl font-medium tracking-tight">{destination.name}</h3>
          <p className="shrink-0 whitespace-nowrap tabular-nums">
            <span className="text-base font-semibold">${destination.price}</span>
            <span className="text-xs text-muted-foreground">/Person</span>
          </p>
        </div>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
          {destination.duration}
        </p>

        <Link
          href={`/destinations/${destination.id}`}
          className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-semibold tracking-wide text-cyan-600 uppercase transition-colors hover:text-cyan-700"
        >
          Book Now
          <ArrowUpRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}

const filterTriggerClassName =
  "h-8 w-full justify-between rounded-md border-0 bg-transparent px-2 text-xs font-medium tracking-wider uppercase shadow-none hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring/50 data-placeholder:text-muted-foreground";

type DestinationsExplorerProps = {
  destinations: Destination[];
  usingSampleData: boolean;
};

export default function DestinationsExplorer({
  destinations,
  usingSampleData,
}: DestinationsExplorerProps) {
  const [category, setCategory] = React.useState<string | null>(null);
  const [priceRange, setPriceRange] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState<string | null>(null);

  const categoryOptions = [...new Set(destinations.map((item) => item.category))].sort();
  const visible = applyFilters(destinations, category, priceRange, sortBy);

  function clearFilters() {
    setCategory(null);
    setPriceRange(null);
    setSortBy(null);
  }

  return (
    <div className="mt-8">
      {usingSampleData && (
        <Alert className="mb-5 border-amber-300 bg-amber-50 text-amber-900 [&_svg]:text-amber-600">
          <TriangleAlert />
          <AlertDescription className="text-amber-900">
            The destination API at <code>localhost:5000</code> could not be
            reached, so these are sample destinations.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <div className="overflow-hidden rounded-lg border border-border/70 bg-card">
        <div className="grid grid-cols-1 divide-y divide-border/70 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="flex items-center px-4 py-3">
            <Select
              value={category}
              onValueChange={(value) => setCategory(value)}
            >
              <SelectTrigger className={filterTriggerClassName}>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent align="start">
                <SelectItem value={ALL}>All Categories</SelectItem>
                {categoryOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center px-4 py-3">
            <Select
              value={priceRange}
              onValueChange={(value) => setPriceRange(value)}
            >
              <SelectTrigger className={filterTriggerClassName}>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent align="start">
                {PRICE_RANGES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center px-4 py-3">
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value)}
            >
              <SelectTrigger className={filterTriggerClassName}>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent align="start">
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Result count */}
      <p className="mt-4 text-sm text-muted-foreground">
        Showing {visible.length}{" "}
        {visible.length === 1 ? "destination" : "destinations"}
      </p>

      {destinations.length === 0 ? (
        <Empty className="mt-6">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MapPin />
            </EmptyMedia>
            <EmptyTitle>No destinations yet</EmptyTitle>
            <EmptyDescription>
              Publish your first travel package and it will show up here for
              everyone to explore.
            </EmptyDescription>
          </EmptyHeader>
          <Button
            nativeButton={false}
            render={<Link href="/add-destination" />}
            className="h-9 gap-2 bg-cyan-600 px-4 text-white hover:bg-cyan-700"
          >
            Add Travel Package
          </Button>
        </Empty>
      ) : visible.length === 0 ? (
        <Empty className="mt-6">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchX />
            </EmptyMedia>
            <EmptyTitle>No destinations match your filters</EmptyTitle>
            <EmptyDescription>
              Try another category or a wider price range.
            </EmptyDescription>
          </EmptyHeader>
          <Button variant="outline" onClick={clearFilters} className="h-9 px-4">
            Clear filters
          </Button>
        </Empty>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      )}
    </div>
  );
}
