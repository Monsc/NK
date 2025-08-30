import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LatestCard } from '@/components/LatestCard'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default function LatestArticlePage() {
  const article = {
    title: 'Monarchy Costs Surge in 2024',
    content: 'The latest Sovereign Grant figures reveal that the cost to taxpayers has increased significantly in 2024, with the monarchy now costing over £100 million annually...'
  }

  return (
    <div className="container-responsive py-12">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <p>{article.content}</p>
    </div>
  )
}
