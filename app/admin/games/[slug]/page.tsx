import PackageManager from "@/app/manage-packages/PackageManager"

export default async function GameAdminPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <PackageManager initialGameSlug={slug} />
}
