import { CompetitiveIntel } from "@/components/competitive/competitive-intel";
import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";

export default function CompetitivePage() {
  return (
    <>
      <PageHeader
        title="Competitive Intel"
        description="Track competitor moves, positioning, and messaging shifts"
      />
      <PageContent
        summary={<CompetitiveIntel variant="summary" />}
        detail={<CompetitiveIntel variant="detail" />}
      />
    </>
  );
}
