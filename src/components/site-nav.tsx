"use client";

import Link from "next/link";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Wordmark } from "@/components/wordmark";

type ConditionGroup = {
  category: string;
  label: string;
  conditions: { slug: string; name: string }[];
};

type Doctor = { slug: string; name: string };

/** Top-level links after the Treatments menu, shared by the desktop and mobile navs. */
const LINKS = [
  { href: "/treatments", label: "Surgical Techniques" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Health Library" },
  { href: "/faqs", label: "FAQs" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav({
  conditionGroups,
  doctors,
  phone,
}: {
  conditionGroups: ConditionGroup[];
  doctors: Doctor[];
  phone: string;
}) {
  return (
    <>
      {/* Desktop nav */}
      <NavigationMenu className="hidden xl:flex">
        <NavigationMenuList className="gap-1">
          <NavigationMenuItem>
            <NavigationMenuLink
              render={<Link href="/about" />}
              className="text-[0.95rem] font-medium text-foreground/85 hover:text-forest-800"
            >
              About Us
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-[0.95rem] font-medium text-foreground/85 hover:text-forest-800">
              Treatments
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[860px] grid-cols-4 gap-6 p-5">
                {conditionGroups.map((group) => (
                  <div key={group.category}>
                    <p className="mb-2 font-heading text-xs font-semibold uppercase tracking-wide text-terracotta-700">
                      {group.label}
                    </p>
                    <ul className="flex flex-col gap-1">
                      {group.conditions.map((c) => (
                        <li key={c.slug}>
                          <NavigationMenuLink
                            render={<Link href={`/conditions/${c.slug}`} />}
                            className="!p-1.5 text-sm text-foreground/80 hover:bg-forest-50 hover:text-forest-800"
                          >
                            {c.name}
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {LINKS.map((link) => (
            <NavigationMenuItem key={link.href}>
              <NavigationMenuLink
                render={<Link href={link.href} />}
                className="whitespace-nowrap text-[0.95rem] font-medium text-foreground/85 hover:text-forest-800"
              >
                {link.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile nav */}
      <Sheet>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="text-forest-800 hover:bg-forest-50 xl:hidden"
            />
          }
        >
          <Menu />
          <span className="sr-only">Open menu</span>
        </SheetTrigger>
        <SheetContent side="right" className="flex w-[85vw] flex-col overflow-y-auto p-0 sm:max-w-sm">
          <SheetHeader className="border-b border-border">
            <SheetTitle>
              <Wordmark className="h-8" />
              <span className="sr-only">Aaravya Hospital menu</span>
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-1 flex-col gap-1 p-4 text-sm">
            <Link href="/about" className="rounded-lg p-2.5 font-medium hover:bg-forest-50">
              About Us
            </Link>
            <p className="mt-3 px-2.5 font-heading text-xs font-semibold uppercase tracking-wide text-terracotta-700">
              Treatments
            </p>
            {conditionGroups.map((group) => (
              <div key={group.category} className="mb-1">
                <p className="px-2.5 pt-2 text-xs font-medium text-muted-foreground">
                  {group.label}
                </p>
                {group.conditions.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/conditions/${c.slug}`}
                    className="block rounded-lg p-2.5 hover:bg-forest-50"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            ))}
            {LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg p-2.5 font-medium hover:bg-forest-50 ${i === 0 ? "mt-2" : ""}`}
              >
                {link.label}
              </Link>
            ))}
            {doctors.length > 0 && (
              <>
                <p className="mt-3 px-2.5 font-heading text-xs font-semibold uppercase tracking-wide text-terracotta-700">
                  Our Doctors
                </p>
                {doctors.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/doctors/${d.slug}`}
                    className="block rounded-lg p-2.5 hover:bg-forest-50"
                  >
                    {d.name}
                  </Link>
                ))}
              </>
            )}
          </nav>
          <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
            <Button
              nativeButton={false}
              render={<Link href="/book" />}
              className="w-full bg-brand text-brand-foreground hover:bg-terracotta-700"
            >
              Book an Appointment
            </Button>
            <Button
              variant="outline"
              render={<a href={`tel:${phone}`} />}
              className="w-full border-forest-300 text-forest-800 hover:bg-forest-50"
            >
              <Phone className="mr-1.5" /> Call {phone}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
