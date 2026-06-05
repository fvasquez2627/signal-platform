import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";
import { SeoIntel } from "@/components/seo/seo-intel";

export default function SeoPage() {
  return (
    <>
      <PageHeader
        title="SEO + AEO"
        description="Search visibility and answer-engine optimization insights"
      />
      <PageContent
        summary={<SeoIntel variant="summary" />}
        detail={<SeoIntel variant="detail" />}
      />
    </>
  );
}
