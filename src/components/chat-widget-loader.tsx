"use client";

import dynamic from "next/dynamic";

// `next/dynamic` with `ssr: false` is only allowed inside a Client
// Component — Next.js throws a build error if a Server Component (like
// `src/app/(site)/layout.tsx`) calls it directly. This thin client boundary
// is the fix: the layout stays an async Server Component and just renders
// this, and the actual code-splitting/lazy-load of the (larger, non-trivial)
// chat widget bundle still happens here, after hydration, exactly as
// intended.
const ChatWidget = dynamic(() => import("@/components/chat-widget").then((m) => m.ChatWidget), {
  ssr: false,
});

export function ChatWidgetLoader({ phone, whatsapp }: { phone: string; whatsapp: string }) {
  return <ChatWidget phone={phone} whatsapp={whatsapp} />;
}
