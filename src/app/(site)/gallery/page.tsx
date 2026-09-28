import type { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHero } from "@/components/site/page-hero";
import { GalleryGrid } from "@/components/site/gallery-grid";
import { getMediaByCategory } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from Aaravya Hospital — happy patients, our facility, and procedures.",
};

export default async function GalleryPage() {
  const [happyFaces, interior, surgery] = await Promise.all([
    getMediaByCategory("HAPPY_FACES"),
    getMediaByCategory("INTERIOR"),
    getMediaByCategory("SURGERY"),
  ]);

  return (
    <div>
      <PageHero
        eyebrow="Inside Aaravya"
        title="Gallery"
        description="A look inside Aaravya Hospital — our patients, our facility, and our procedures."
      />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <Tabs defaultValue="happy-faces">
          <TabsList className="mx-auto">
            <TabsTrigger value="happy-faces">Happy Faces</TabsTrigger>
            <TabsTrigger value="interior">Interior</TabsTrigger>
            <TabsTrigger value="surgery">Surgery</TabsTrigger>
          </TabsList>
          <TabsContent value="happy-faces">
            <GalleryGrid items={happyFaces} category="HAPPY_FACES" />
          </TabsContent>
          <TabsContent value="interior">
            <GalleryGrid items={interior} category="INTERIOR" />
          </TabsContent>
          <TabsContent value="surgery">
            <GalleryGrid items={surgery} category="SURGERY" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
