export type AnonymousCategoryContent = {
  slug: string;
  dbValue: "STUDENT" | "WOMAN" | "IT_PROFESSIONAL" | "POLICE_DEFENCE" | "OTHER";
  label: string;
  hook: string;
  headline: string;
  intro: string;
  whyCommon: string[];
  whatToExpect: string[];
  offerFemaleDoctor: boolean;
};

export const ANONYMOUS_CATEGORIES: AnonymousCategoryContent[] = [
  {
    slug: "students",
    dbValue: "STUDENT",
    label: "Students",
    hook: "Long study hours, exam stress, irregular meals",
    headline: "Piles and fissures are more common in students than you'd think",
    intro:
      "Between all-night study sessions, exam-season stress, and putting off a bathroom break because you're mid-revision, the habits that come with student life are exactly the ones that lead to piles and fissures — and most students never mention it to anyone, family included.",
    whyCommon: [
      "Holding it in during long study sessions or exams increases straining and pressure",
      "Dehydration and hostel/canteen food (low fibre, high processed food) are common contributors",
      "Sitting for extended hours with little movement slows digestion",
      "Exam stress itself can worsen bowel habits",
    ],
    whatToExpect: [
      "A private video call — no one from your college or family needs to know",
      "You can join with just your first name or a nickname",
      "The doctor asks about your symptoms and suggests next steps — self-care advice, or an in-person visit only if actually needed",
    ],
    offerFemaleDoctor: false,
  },
  {
    slug: "women",
    dbValue: "WOMAN",
    label: "Women",
    hook: "Pregnancy-related piles, postpartum fissures, privacy concerns",
    headline: "You deserve a female doctor and a private consult — no judgment, no discomfort",
    intro:
      "Pregnancy and postpartum recovery bring on piles and fissures for a large number of women, but the modesty and privacy concerns around an anorectal exam stop many from ever getting checked. You can request Dr. Dipti Prajapati specifically, and keep the entire first conversation to a video call.",
    whyCommon: [
      "Pregnancy increases pelvic pressure, a leading cause of piles in the third trimester",
      "Straining during delivery is a common cause of postpartum fissures",
      "Hormonal changes can slow digestion and worsen constipation",
    ],
    whatToExpect: [
      "Request a female doctor (Dr. Dipti Prajapati) at the time of booking — no need to explain why",
      "A private, unhurried conversation about your symptoms before any exam is ever discussed",
      "Camera-off is completely fine for this first call",
    ],
    offerFemaleDoctor: true,
  },
  {
    slug: "it-professionals",
    dbValue: "IT_PROFESSIONAL",
    label: "IT Professionals",
    hook: "8+ hour desk days, WFH stress, irregular meal timing",
    headline: "What 8+ hours at your desk is doing to your gut health",
    intro:
      "Long sitting hours, back-to-back meetings that push lunch to 4pm, and the general sedentary pull of a desk job are a well-documented risk factor for piles and fissures — and it's one of the most common reasons IT professionals quietly search for a doctor at midnight.",
    whyCommon: [
      "Prolonged sitting increases pressure on rectal veins",
      "Irregular meal timing and low fibre intake around deadlines worsen constipation",
      "WFH schedules often mean even less daily movement than a commute-based routine",
    ],
    whatToExpect: [
      "Book a slot outside your work hours — early morning or after 8pm is fine",
      "A first call focused entirely on symptoms and guidance, camera optional",
      "Practical, desk-job-specific advice, not just generic lifestyle tips",
    ],
    offerFemaleDoctor: false,
  },
  {
    slug: "police-defence",
    dbValue: "POLICE_DEFENCE",
    label: "Police & Defence",
    hook: "Long duty hours, limited washroom access, delayed treatment",
    headline: "Duty comes first — we get it. Book around your shift, fully confidential",
    intro:
      "Long duty hours, limited access to washrooms during postings, and physically demanding schedules mean treatment often gets delayed until a condition becomes serious. We work around your shift timing, not the other way around, and every consult stays strictly between you and the treating doctor.",
    whyCommon: [
      "Restricted washroom access during duty encourages holding in, a known risk factor",
      "Long hours standing or in vehicles increase pressure on the lower body",
      "Postings and shift patterns often mean treatment gets pushed back repeatedly",
    ],
    whatToExpect: [
      "Flexible slot timing built around duty hours, including early morning and late evening",
      "A nickname or service number initials are enough — no personal details required upfront",
      "A clear treatment timeline if a procedure is needed, so you can plan it around leave",
    ],
    offerFemaleDoctor: false,
  },
  {
    slug: "others",
    dbValue: "OTHER",
    label: "Others",
    hook: "Anyone who'd rather not explain why they're asking",
    headline: "The same private consult, no category required",
    intro:
      "Not everyone fits neatly into a category, and that's fine — this option exists for exactly that. Same anonymous video consult, same minimal-information request, same confidentiality, no questions about why you're here.",
    whyCommon: [
      "Piles, fissures, and fistula are common conditions — far more common than the silence around them suggests",
      "Most people delay a first conversation simply because of the embarrassment, not the symptoms themselves",
    ],
    whatToExpect: [
      "A private video call with just a phone number or email to send you the link",
      "A nickname is completely fine — camera-off too",
      "Practical next steps, with zero pressure to book anything further",
    ],
    offerFemaleDoctor: false,
  },
];

export const ANONYMOUS_WHATSAPP_MESSAGE = "Hi, I'd like to request an anonymous video consultation.";

export function getAnonymousCategory(slug: string) {
  return ANONYMOUS_CATEGORIES.find((c) => c.slug === slug);
}
