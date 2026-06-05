import { ContentStudio } from "@/components/content/content-studio";
import { PageContent } from "@/components/layout/page-content";
import { PageHeader } from "@/components/layout/page-header";

export default function ContentPage() {
  return (
    <>
      <PageHeader
        title="Content Studio"
        description="Drafts, hooks, CTAs, and publishing workflow"
      />
      <PageContent
        summary={<ContentStudio variant="summary" />}
        detail={<ContentStudio variant="detail" />}
      />
    </>
  );
}
