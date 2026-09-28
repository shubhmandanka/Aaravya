import Script from "next/script";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { ChatWidgetLoader } from "@/components/chat-widget-loader";
import { organizationSchema } from "@/lib/schema";
import { getContactDetails, getPrimaryLocation, getSiteSettings } from "@/lib/queries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, contact, location] = await Promise.all([getSiteSettings(), getContactDetails(), getPrimaryLocation()]);

  const orgSchema = organizationSchema({
    phone: contact.phone,
    email: contact.email,
    address: location?.address ?? "Chandkheda, Ahmedabad",
    facebookUrl: settings.facebook_url,
    instagramUrl: settings.instagram_url,
  });

  return (
    <>
      {settings.gtm_id && (
        <>
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${settings.gtm_id}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${settings.gtm_id}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}
      {settings.ga4_id && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${settings.ga4_id}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${settings.ga4_id}');`}
          </Script>
        </>
      )}
      <JsonLd data={orgSchema} />
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <ChatWidgetLoader phone={contact.phone} whatsapp={contact.whatsapp} />
    </>
  );
}
