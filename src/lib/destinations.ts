export type Destination = {
  id: string;
  name: string;
  country: string;
  category: string;
  price: number;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
  rating: number;
};

export type DestinationsResult = {
  destinations: Destination[];
  usingSampleData: boolean;
};

const DESTINATIONS_API = "http://localhost:5000/destinations";

/**
 * Used only when the API cannot be reached, so the page still renders a
 * populated grid instead of an error. Records created through
 * `/add-destination` always take precedence.
 */
const SAMPLE_DESTINATIONS: Destination[] = [
  {
    id: "bali-paradise",
    name: "Bali Paradise",
    country: "Indonesia",
    category: "Beach",
    price: 2700,
    duration: "7 Days/6 Nights",
    departureDate: "2026-12-05",
    imageUrl:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    description:
      "Turquoise water, terraced rice fields and temple sunsets on the island of the gods.",
    rating: 4.5,
  },
  {
    id: "maldives-escape",
    name: "Maldives Escape",
    country: "Maldives",
    category: "Luxury",
    price: 3200,
    duration: "5 Days/4 Nights",
    departureDate: "2026-11-20",
    imageUrl:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
    description:
      "Overwater villas, glass-floor lagoons and slow mornings in the Indian Ocean.",
    rating: 4.8,
  },
  {
    id: "santorini-sunsets",
    name: "Santorini Sunsets",
    country: "Greece",
    category: "Cultural",
    price: 2400,
    duration: "6 Days/5 Nights",
    departureDate: "2026-10-30",
    imageUrl:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
    description:
      "Whitewashed villages, caldera views and dinner above the Aegean Sea.",
    rating: 4.7,
  },
  {
    id: "alps-explorer",
    name: "Alps Explorer",
    country: "Switzerland",
    category: "Adventure",
    price: 3500,
    duration: "8 Days/7 Nights",
    departureDate: "2027-01-12",
    imageUrl:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    description:
      "Panoramic rail journeys, glacier trails and chalet nights in the high Alps.",
    rating: 4.9,
  },
  {
    id: "kyoto-blossoms",
    name: "Kyoto Blossoms",
    country: "Japan",
    category: "Cultural",
    price: 2900,
    duration: "7 Days/6 Nights",
    departureDate: "2027-03-28",
    imageUrl:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    description:
      "Lantern-lit alleys, bamboo groves and pink petals along the Philosopher's Path.",
    rating: 4.6,
  },
];

function readString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Ratings are not part of the API payload yet, so derive a stable value from
 * the id — the same destination always shows the same badge.
 */
function stableRating(id: string): number {
  let hash = 0;
  for (const char of id) {
    hash = (hash * 31 + char.charCodeAt(0)) % 997;
  }
  return 4 + ((hash % 9) + 1) / 10;
}

function formatDuration(value: unknown): string {
  const raw = readString(value);
  if (!raw) return "Flexible itinerary";
  if (/^\d+$/.test(raw)) {
    const days = Number(raw);
    const nights = Math.max(days - 1, 0);
    return `${days} Day${days === 1 ? "" : "s"}/${nights} Night${nights === 1 ? "" : "s"}`;
  }
  return raw;
}

export function normalizeDestination(
  entry: unknown,
  index: number
): Destination | null {
  if (typeof entry !== "object" || entry === null) return null;

  const raw = entry as Record<string, unknown>;

  const name =
    readString(raw.destinationName) || readString(raw.title) || readString(raw.name);
  if (!name) return null;

  const id = readString(raw._id) || readString(raw.id) || `${slugify(name)}-${index}`;

  const parsedPrice = Number(readString(raw.price).replace(/[^0-9.]/g, ""));
  const parsedRating = Number(raw.rating);

  return {
    id,
    name,
    country: readString(raw.country) || "Unknown",
    category: readString(raw.category) || "Uncategorized",
    price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
    duration: formatDuration(raw.duration),
    departureDate: readString(raw.departureDate),
    imageUrl: readString(raw.imageUrl),
    description: readString(raw.description),
    rating:
      Number.isFinite(parsedRating) && parsedRating > 0
        ? Math.round(parsedRating * 10) / 10
        : stableRating(id),
  };
}

/**
 * Next.js throws this digest while trying to prerender a route that opted
 * into request-time rendering (our `no-store` fetch). It must reach Next, so
 * only genuine API failures fall through to the sample data.
 */
function isDynamicRenderBailout(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("digest" in error)) {
    return false;
  }
  return (error as { digest?: unknown }).digest === "DYNAMIC_SERVER_USAGE";
}

/**
 * Loads destinations from the Express backend. If the API is unreachable the
 * sample collection is returned instead, flagged so the UI can say so.
 */
export async function getDestinations(): Promise<DestinationsResult> {
  try {
    const response = await fetch(DESTINATIONS_API, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`${DESTINATIONS_API} responded with ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) {
      throw new Error("Expected an array of destinations from the API");
    }

    const destinations = payload
      .map((entry, index) => normalizeDestination(entry, index))
      .filter((entry): entry is Destination => entry !== null);

    return { destinations, usingSampleData: false };
  } catch (error) {
    if (isDynamicRenderBailout(error)) throw error;

    console.warn("Falling back to sample destinations:", error);
    return { destinations: SAMPLE_DESTINATIONS, usingSampleData: true };
  }
}
