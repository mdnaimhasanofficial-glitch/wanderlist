import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

const CTA_IMAGE =
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=2000&q=80"

export default function CallToAction() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background: gradient fallback + photo + dark overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-linear-to-br from-[#052e2b] via-[#0b4a45] to-[#03131f]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url("${CTA_IMAGE}")` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[#020617]/75"
      />

      <div className="mx-auto flex min-h-[380px] w-full max-w-3xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <h2 className="text-4xl font-medium tracking-tight text-white sm:text-5xl">
          Ready To Start Your Journey?
        </h2>
        <p className="mt-4 max-w-xl text-base text-white/80 sm:text-lg">
          Join thousands of travelers who have discovered the world with us
        </p>
        <Button
          size="lg"
          nativeButton={false}
          render={<Link href="/destinations" />}
          className="mt-8 h-12 gap-2 rounded-md bg-white px-8 text-sm font-semibold tracking-wide text-slate-900 uppercase hover:bg-white/90"
        >
          Book Your Trip Today
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </section>
  )
}
