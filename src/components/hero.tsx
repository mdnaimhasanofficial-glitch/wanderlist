import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Search,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { cn } from "@/lib/utils";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2000&q=80";

function SearchField({
  icon: Icon,
  label,
  className,
  children,
}: {
  icon: LucideIcon;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label
      className={cn(
        "flex min-w-0 flex-col justify-center gap-1.5 rounded-xl border border-transparent bg-slate-100 px-3.5 py-2.5 text-left transition-colors focus-within:border-slate-300 focus-within:bg-white",
        className,
      )}
    >
      <span className="flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-slate-500 uppercase">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </span>
      {children}
    </label>
  );
}

const selectClassName =
  "w-full text-slate-900 [&_select]:h-6 [&_select]:w-full [&_select]:border-0 [&_select]:bg-transparent [&_select]:px-0 [&_select]:pr-6 [&_select]:text-sm [&_select]:font-medium [&_select]:text-slate-900 [&_select]:focus-visible:border-0 [&_select]:focus-visible:ring-0 [&_[data-slot=native-select-icon]]:right-0 [&_[data-slot=native-select-icon]]:text-slate-400";

const inputClassName =
  "h-6 border-0 bg-transparent px-0 text-sm font-medium text-slate-900 shadow-none focus-visible:border-0 focus-visible:ring-0";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background: gradient fallback + photo + dark overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-linear-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url("${HERO_IMAGE}")` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-[#020617]/70 via-[#020617]/55 to-[#020617]/90"
      />

      <div className="mx-auto flex min-h-160 w-full max-w-6xl flex-col items-center justify-center px-4 pt-16 pb-20 text-center sm:px-6 lg:pt-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
          <Sparkles className="size-3.5 text-amber-300" aria-hidden="true" />
          Trusted by 12,000+ travellers across Bangladesh
        </span>

        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Discover Your Next{" "}
          <span className="bg-linear-to-r from-emerald-300 via-teal-200 to-sky-300 bg-clip-text text-transparent">
            Adventure
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
          From the tea gardens of Sylhet to the shores of Cox&apos;s Bazar —
          handpicked destinations, trusted local guides and honest prices, all
          planned in one place.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="#trip-search" />}
            className="group h-11 gap-2 rounded-full bg-white px-7 text-base text-slate-900 hover:bg-white/90"
          >
            Explore Now
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Button>
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            render={<Link href="/destinations" />}
            className="h-11 gap-2 rounded-full border-white/30 bg-white/10 px-7 text-base text-white backdrop-blur hover:bg-white/20 hover:text-white"
          >
            <MapPin className="size-4" aria-hidden="true" />
            View Destinations
          </Button>
        </div>

        {/* Trip search */}
        <form
          id="trip-search"
          className="mt-12 w-full max-w-4xl scroll-mt-24 rounded-2xl border border-white/15 bg-white/95 p-3 text-left shadow-2xl shadow-black/30 backdrop-blur sm:p-4"
        >
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_0.75fr_auto]">
            <SearchField icon={MapPin} label="Location">
              <NativeSelect className={selectClassName} defaultValue="Dhaka">
                <NativeSelectOption value="Dhaka">Dhaka</NativeSelectOption>
                <NativeSelectOption value="Cox's Bazar">
                  Cox&apos;s Bazar
                </NativeSelectOption>
                <NativeSelectOption value="Sylhet">Sylhet</NativeSelectOption>
                <NativeSelectOption value="Bandarban">
                  Bandarban
                </NativeSelectOption>
                <NativeSelectOption value="Sundarbans">
                  Sundarbans
                </NativeSelectOption>
                <NativeSelectOption value="Santorini">
                  Santorini
                </NativeSelectOption>
                <NativeSelectOption value="Bali">Bali</NativeSelectOption>
              </NativeSelect>
            </SearchField>

            <SearchField icon={CalendarDays} label="Duration">
              <NativeSelect className={selectClassName} defaultValue="any">
                <NativeSelectOption value="any">Any length</NativeSelectOption>
                <NativeSelectOption value="weekend">
                  Weekend (2–3 days)
                </NativeSelectOption>
                <NativeSelectOption value="4-6">4–6 days</NativeSelectOption>
                <NativeSelectOption value="week">1 week</NativeSelectOption>
                <NativeSelectOption value="2-weeks">
                  2 weeks or more
                </NativeSelectOption>
              </NativeSelect>
            </SearchField>

            <SearchField icon={Wallet} label="Budget">
              <NativeSelect className={selectClassName} defaultValue="any">
                <NativeSelectOption value="any">Any budget</NativeSelectOption>
                <NativeSelectOption value="20k">
                  Under ৳20,000
                </NativeSelectOption>
                <NativeSelectOption value="20k-50k">
                  ৳20,000 – ৳50,000
                </NativeSelectOption>
                <NativeSelectOption value="50k-100k">
                  ৳50,000 – ৳100,000
                </NativeSelectOption>
                <NativeSelectOption value="100k">৳100,000+</NativeSelectOption>
              </NativeSelect>
            </SearchField>

            <SearchField icon={Users} label="People">
              <Input
                type="number"
                name="people"
                min={1}
                max={30}
                defaultValue={2}
                aria-label="Number of people"
                className={inputClassName}
              />
            </SearchField>

            <Button
              type="submit"
              size="lg"
              className="h-12 gap-2 rounded-xl bg-slate-900 px-6 text-base text-white hover:bg-slate-800 sm:col-span-2 lg:col-span-1 lg:h-auto lg:self-stretch"
            >
              <Search className="size-4" aria-hidden="true" />
              Search
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
