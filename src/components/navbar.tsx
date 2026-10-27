"use client"

import { Compass, Menu, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/my-business", label: "My Business" },
  { href: "/admin", label: "Admin" },
]

function linkClassName(isActive: boolean) {
  return cn(
    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-muted text-foreground"
      : "text-muted-foreground hover:bg-muted hover:text-foreground"
  )
}

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Left: main navigation (desktop) + menu button (mobile) */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={linkClassName(isActive)}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1.5 lg:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Open navigation menu" />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 max-w-none gap-6 sm:max-w-none">
              <SheetHeader className="border-b pb-4">
                <SheetTitle className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Compass className="size-4" />
                  </span>
                  Wanderlast
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <SheetClose
                      key={link.href}
                      nativeButton={false}
                      render={
                        <Link
                          href={link.href}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(linkClassName(isActive), "w-full justify-start")}
                        />
                      }
                    >
                      {link.label}
                    </SheetClose>
                  )
                })}
              </nav>

              <div className="mt-auto flex flex-col gap-2 border-t p-4">
                <SheetClose
                  nativeButton={false}
                  render={
                    <Link
                      href="/profile"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full justify-start gap-2"
                      )}
                    />
                  }
                >
                  <User className="size-4" />
                  Profile
                </SheetClose>
                <SheetClose
                  nativeButton={false}
                  render={
                    <Link
                      href="/login"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full justify-start"
                      )}
                    />
                  }
                >
                  Log in
                </SheetClose>
                <SheetClose
                  nativeButton={false}
                  render={
                    <Link href="/signup" className={cn(buttonVariants(), "w-full")} />
                  }
                >
                  Sign up
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Center: logo */}
        <Link
          href="/"
          className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Compass className="size-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Wanderlast</span>
        </Link>

        {/* Right: profile + auth actions */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/profile" />}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <User className="size-4" />
            <span className="hidden sm:inline">Profile</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/login" />}
            className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
          >
            Log in
          </Button>
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href="/signup" />}
            className="px-3.5"
          >
            Sign up
          </Button>
        </div>
      </div>
    </header>
  )
}
