import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Stethoscope, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselSlide } from "@/components/site/carousel";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { legacyAsset } from "@/lib/assets";
import { ANONYMOUS_CATEGORIES } from "@/content/anonymous-categories";
import { TestimonialQuoteCard } from "@/components/site/testimonial-quote-card";
import {
  getAllDoctors,
  getApprovedTestimonials,
  getConditionsGroupedByCategory,
  getFaqs,
  getMediaByCategory,
} from "@/lib/queries";

export default async function Home() {
  const [conditionGroups, doctors, faqs, testimonialImages, featuredQuotes] = await Promise.all([
    getConditionsGroupedByCategory(),
    getAllDoctors(),
    getFaqs("homepage"),
    getMediaByCategory("TESTIMONIAL"),
    getApprovedTestimonials({ featuredOnly: true, limit: 3 }),
  ]);

  const proctology = conditionGroups.find((g) => g.category === "PROCTOLOGY");
  const featuredImages = testimonialImages.filter((m) => m.type === "IMAGE").slice(0, 8);

  return (
    <>
      {/* Hero — kept free of scroll animation so it never delays LCP/CLS */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,var(--brand-forest-900),var(--brand-forest-700))] text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:28px_28px]"
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-white/75">
              Chandkheda, Ahmedabad
            </span>
            <h1 className="mt-4 text-balance font-heading text-4xl font-semibold sm:text-5xl">
              Dedicated Proctology &amp; Colorectal Care
            </h1>
            <p className="mt-5 max-w-lg text-white/85">
              Piles, fissure, fistula, and pilonidal sinus treated with modern
              laser and minimally-invasive techniques — under Dr. Deep
              Prajapati and Dr. Dipti Prajapati.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="xl"
                render={<Link href="/book" />}
                className="bg-white text-forest-800 hover:bg-white/90"
              >
                Book an Appointment
              </Button>
              <Button
                size="xl"
                variant="outline"
                render={<Link href="/symptom-checker" />}
                className="border-white/40 bg-transparent text-white hover:bg-white/10"
              >
                Check My Symptoms
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="font-heading text-3xl font-semibold">1000+</p>
              <p className="mt-1 text-xs text-white/75">Successful Surgeries</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="font-heading text-3xl font-semibold">21</p>
              <p className="mt-1 text-xs text-white/75">Conditions Treated</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="font-heading text-3xl font-semibold">5+ yrs</p>
              <p className="mt-1 text-xs text-white/75">Clinical Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border bg-forest-50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-6 text-sm text-forest-800 sm:px-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-terracotta-600" /> Day-care laser procedures
          </div>
          <div className="flex items-center gap-2">
            <Stethoscope className="size-4 text-terracotta-600" /> Doctor-reviewed care plans
          </div>
          <div className="flex items-center gap-2">
            <Users className="size-4 text-terracotta-600" /> Female doctor available
          </div>
        </div>
      </section>

      {/* Condition quick links */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-heading text-3xl font-semibold">
            Anorectal Conditions We Treat
          </h2>
          <p className="mt-3 text-muted-foreground">
            Non-surgical management through to laser and surgical treatment —
            matched to what your condition actually needs.
          </p>
        </Reveal>
        <RevealGroup className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {proctology?.conditions.map((c) => (
            <RevealItem key={c.slug}>
              <Link
                href={`/conditions/${c.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card pb-5 text-center shadow-soft-sm transition-all hover:-translate-y-0.5 hover:border-forest-300 hover:shadow-soft-md"
              >
                <div className="relative mb-4 aspect-[4/3] bg-forest-50">
                  {legacyAsset(c.heroImageUrl) && (
                    <Image
                      src={legacyAsset(c.heroImageUrl)!}
                      alt={c.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                      className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <p className="px-4 font-heading font-medium text-card-foreground">{c.name}</p>
                <span className="mt-2 inline-flex items-center justify-center gap-1 text-xs text-terracotta-700 opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ArrowRight className="size-3" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
        <div className="mt-8 text-center">
          <Button variant="outline" render={<Link href="/conditions" />}>
            View All Conditions &amp; Treatments
          </Button>
        </div>
      </section>

      {/* Anonymous consultation teaser */}
      <section className="bg-sage-100 py-16 sm:py-20">
        <Reveal className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <h2 className="text-balance font-heading text-3xl font-semibold text-sage-900">
            Find Care That Understands Your Lifestyle
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sage-800/80">
            A fully anonymous video consultation — no full name required, camera
            optional, and a female doctor available on request.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {ANONYMOUS_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/anonymous-consultation/${category.slug}`}
                className="rounded-full border border-sage-300 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-terracotta-500 hover:text-terracotta-700"
              >
                {category.label}
              </Link>
            ))}
          </div>
          <Button
            size="xl"
            render={<Link href="/anonymous-consultation" />}
            className="mt-8 bg-brand text-brand-foreground hover:bg-terracotta-700"
          >
            Start an Anonymous Consultation
          </Button>
        </Reveal>
      </section>

      {/* Doctors */}
      {doctors.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <Reveal className="text-center">
            <h2 className="text-balance font-heading text-3xl font-semibold">
              Meet Your Doctors
            </h2>
          </Reveal>
          <Carousel
            ariaLabel="Our doctors"
            className="mt-10"
            slideCount={doctors.length > 1 ? doctors.length : undefined}
          >
            {doctors.map((doctor) => (
              <CarouselSlide key={doctor.slug} className="w-[calc(100%-1rem)] sm:w-[calc(50%-0.5rem)]">
                <Link
                  href={`/doctors/${doctor.slug}`}
                  className="flex h-full min-h-[19rem] flex-col items-center justify-center gap-5 rounded-2xl border border-border bg-card p-8 text-center shadow-soft-sm transition-all hover:-translate-y-0.5 hover:border-forest-300 hover:shadow-soft-md"
                >
                  {legacyAsset(doctor.photoUrl) && (
                    <div className="relative size-32 shrink-0 overflow-hidden rounded-full bg-muted sm:size-36">
                      <Image
                        src={legacyAsset(doctor.photoUrl)!}
                        alt={doctor.name}
                        fill
                        sizes="144px"
                        className="object-cover object-top"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-heading text-2xl font-semibold">{doctor.name}</p>
                    <p className="mt-1.5 text-base text-terracotta-700">{doctor.qualifications}</p>
                    <p className="mt-1 text-base text-muted-foreground">{doctor.designation}</p>
                    {doctor.specializations.length > 0 && (
                      <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                        {doctor.specializations.map((s) => (
                          <span
                            key={s}
                            className="rounded-full bg-sage-100 px-4 py-1.5 text-sm font-medium text-sage-800"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </CarouselSlide>
            ))}
          </Carousel>
        </section>
      )}

      {/* Testimonials preview */}
      {(featuredImages.length > 0 || featuredQuotes.length > 0) && (
        <section className="border-y border-border bg-forest-50 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal className="text-center">
              <h2 className="text-balance font-heading text-3xl font-semibold">
                Patient Stories
              </h2>
            </Reveal>
            {featuredQuotes.length > 0 && (
              <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredQuotes.map((t) => (
                  <RevealItem key={t.id}>
                    <TestimonialQuoteCard testimonial={t} />
                  </RevealItem>
                ))}
              </RevealGroup>
            )}
            {featuredImages.length > 0 && (
            <Carousel ariaLabel="Patient stories" autoplayMs={4500} className="mt-10">
              {featuredImages.map((item) => (
                <CarouselSlide
                  key={item.id}
                  className="relative aspect-3/4 w-[45vw] overflow-hidden rounded-xl bg-muted shadow-soft-sm sm:w-[30vw] lg:w-[15vw]"
                >
                  {legacyAsset(item.url) && (
                    <Image
                      src={legacyAsset(item.url)!}
                      alt="Patient testimonial"
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
                      className="object-cover"
                    />
                  )}
                </CarouselSlide>
              ))}
            </Carousel>
            )}
            <div className="mt-8 text-center">
              <Button variant="outline" render={<Link href="/testimonials" />}>
                See All Testimonials
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Cost transparency teaser */}
      <Reveal as="section" className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <h2 className="text-balance font-heading text-3xl font-semibold">
          Know Your Treatment Cost Upfront
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Transparent pricing, cashless insurance support, and EMI options —
          no surprises before your procedure.
        </p>
        <Button variant="outline" render={<Link href="/cost" />} className="mt-6">
          Estimate My Cost
        </Button>
      </Reveal>

      {/* FAQ preview */}
      {faqs.length > 0 && (
        <section className="border-t border-border bg-forest-50 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Reveal className="text-center">
              <h2 className="text-balance font-heading text-3xl font-semibold">
                Frequently Asked Questions
              </h2>
            </Reveal>
            <RevealGroup className="mt-8 flex flex-col gap-3">
              {faqs.slice(0, 4).map((faq) => (
                <RevealItem key={faq.id}>
                  <div className="rounded-xl border border-border bg-card p-5 shadow-soft-sm">
                    <p className="font-medium text-card-foreground">{faq.question}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
            <div className="mt-8 text-center">
              <Button variant="outline" render={<Link href="/faqs" />}>
                View All FAQs
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
