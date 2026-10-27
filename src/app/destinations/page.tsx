import DestinationsExplorer from "@/components/destinations-explorer";
import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import { getDestinations } from "@/lib/destinations";

export default async function DestinationsPage() {
  const { destinations, usingSampleData } = await getDestinations();

  return (
    <>
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-20 sm:px-6 sm:pt-12">
          <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">
            Explore All Destinations
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Find your perfect travel experience from our curated collection
          </p>

          <DestinationsExplorer
            destinations={destinations}
            usingSampleData={usingSampleData}
          />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
