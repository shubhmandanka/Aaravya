import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : undefined;

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: supabaseHostname
      ? [{ protocol: "https", hostname: supabaseHostname, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
  // Permanent (308) redirects from every page of the old static site, which
  // Google still has indexed (some as sitelinks) and which otherwise 404.
  // Mapping taken from the old site's own sitemap.html and file list.
  // Deliberately not redirected: robots.txt and sitemap.xml (the app serves
  // its own at those paths) and the old google…html verification file.
  async redirects() {
    return [
      // Homepage & core pages
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/aaravya-hospital.html", destination: "/", permanent: true },
      { source: "/sitemap.html", destination: "/", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/appointment.html", destination: "/book", permanent: true },
      { source: "/appointment.php", destination: "/book", permanent: true },
      { source: "/testimonial-videos.html", destination: "/testimonials", permanent: true },
      { source: "/testimonial-images.html", destination: "/testimonials", permanent: true },
      { source: "/gallery.html", destination: "/gallery", permanent: true },
      { source: "/faqs.html", destination: "/faqs", permanent: true },

      // Doctors
      { source: "/dr-deep-prajapati.html", destination: "/doctors/dr-deep-prajapati", permanent: true },
      { source: "/dr-dipti-prajapati.html", destination: "/doctors/dr-dipti-prajapati", permanent: true },
      { source: "/piles-doctor-in-ahmedabad.html", destination: "/doctors", permanent: true },
      { source: "/piles-doctor-in-gujarat.html", destination: "/doctors", permanent: true },
      { source: "/best-piles-specialist-doctor-in-ahmedabad.html", destination: "/doctors/dr-deep-prajapati", permanent: true },
      { source: "/best-piles-specialist-doctor-in-gujarat.html", destination: "/doctors/dr-deep-prajapati", permanent: true },
      { source: "/female-piles-doctor-in-ahmedabad.html", destination: "/doctors/dr-dipti-prajapati", permanent: true },
      { source: "/female-piles-doctor-in-gujarat.html", destination: "/doctors/dr-dipti-prajapati", permanent: true },

      // Piles: the old SEO variants collapse into one condition + one treatment
      { source: "/piles-treatment-in-ahmedabad.html", destination: "/conditions/piles", permanent: true },
      { source: "/piles-treatment-in-gujarat.html", destination: "/conditions/piles", permanent: true },
      { source: "/best-piles-treatment-in-ahmedabad.html", destination: "/conditions/piles", permanent: true },
      { source: "/ayurvedic-piles-treatment-ahmedabad.html", destination: "/conditions/piles", permanent: true },
      { source: "/low-cost-piles-laser-treatment-in-ahmedabad.html", destination: "/treatments/piles-laser-piles-treatment", permanent: true },
      { source: "/low-cost-piles-laser-treatment-in-gujarat.html", destination: "/treatments/piles-laser-piles-treatment", permanent: true },
      { source: "/laser-piles-treatment-ahmedabad.html", destination: "/treatments/piles-laser-piles-treatment", permanent: true },
      { source: "/laser-treatment-for-piles-in-ahmedabad.html", destination: "/treatments/piles-laser-piles-treatment", permanent: true },
      { source: "/laser-treatment-for-piles-in-gujarat.html", destination: "/treatments/piles-laser-piles-treatment", permanent: true },

      // Every other condition: direct 1:1
      { source: "/fissure-treatment-in-ahmedabad.html", destination: "/conditions/fissure", permanent: true },
      { source: "/laser-fissure-treatment-ahmedabad.html", destination: "/treatments/fissure-laser-fissure-treatment", permanent: true },
      { source: "/fistula-treatment-in-ahmedabad.html", destination: "/conditions/fistula", permanent: true },
      { source: "/pns-treatment-in-ahmedabad.html", destination: "/conditions/pns", permanent: true },
      { source: "/perianal-treatment-in-ahmedabad.html", destination: "/conditions/perianal", permanent: true },
      { source: "/abscess-treatment-in-ahmedabad.html", destination: "/conditions/abscess", permanent: true },
      { source: "/ano-rectal-diseases-treatment-in-ahmedabad.html", destination: "/conditions/ano-rectal-diseases", permanent: true },
      { source: "/appendix-treatment-in-ahmedabad.html", destination: "/conditions/appendix", permanent: true },
      { source: "/hernia-treatment-in-ahmedabad.html", destination: "/conditions/hernia", permanent: true },
      { source: "/gall-stones-treatment-in-ahmedabad.html", destination: "/conditions/gall-stones", permanent: true },
      { source: "/corn-treatment-in-ahmedabad.html", destination: "/conditions/corn", permanent: true },
      { source: "/boils-treatment-in-ahmedabad.html", destination: "/conditions/boils", permanent: true },
      { source: "/cyst-treatment-in-ahmedabad.html", destination: "/conditions/cyst", permanent: true },
      { source: "/lipoma-treatment-in-ahmedabad.html", destination: "/conditions/lipoma", permanent: true },
      { source: "/warts-treatment-in-ahmedabad.html", destination: "/conditions/warts", permanent: true },
      { source: "/bph-treatment-in-ahmedabad.html", destination: "/conditions/bph", permanent: true },
      { source: "/urethral-stricture-treatment-in-ahmedabad.html", destination: "/conditions/urethral-stricture", permanent: true },
      { source: "/urinary-stones-treatment-in-ahmedabad.html", destination: "/conditions/urinary-stones", permanent: true },
      { source: "/diabetic-foot-ulcer-treatment-in-ahmedabad.html", destination: "/conditions/diabetic-foot-ulcer", permanent: true },
      { source: "/venous-ulcers-treatment-in-ahmedabad.html", destination: "/conditions/venous-ulcers", permanent: true },
      { source: "/arterial-ulcers-treatment-in-ahmedabad.html", destination: "/conditions/arterial-ulcers", permanent: true },
    ];
  },
};

export default nextConfig;
