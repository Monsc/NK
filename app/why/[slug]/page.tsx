import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default function WhySlugPage() {
  const content = 'Hereditary privilege imposes significant costs on taxpayers annually.'
  return (
    <div className="container-responsive py-12">
      <p>{content}</p>
    </div>
  )
}
