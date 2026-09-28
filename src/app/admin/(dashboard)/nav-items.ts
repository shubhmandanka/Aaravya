import {
  LayoutDashboard,
  CalendarClock,
  Stethoscope,
  ClipboardList,
  Syringe,
  HelpCircle,
  Quote,
  Images,
  Newspaper,
  Wallet,
  MapPin,
  Settings,
} from "lucide-react";

export const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/appointments", label: "Appointments", icon: CalendarClock },
  { href: "/admin/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/admin/conditions", label: "Conditions", icon: ClipboardList },
  { href: "/admin/procedures", label: "Procedures", icon: Syringe },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/blog", label: "Health Library", icon: Newspaper },
  { href: "/admin/cost-estimator", label: "Cost Estimator", icon: Wallet },
  { href: "/admin/locations", label: "Locations", icon: MapPin },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
] as const;
