'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

interface SearchResult {
  id: string
  title: string
  excerpt: string
  url: string
  relevance: number
}

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for articles, events, or topics..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {isLoading && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Searching...
                </p>
              )}

              {!isLoading && results.length === 0 && query && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No results found for &quot;{query}&quot;
                </p>
              )}

              {results.map((result) => (
                <Link
                  key={result.id}
                  href={result.url}
                  onClick={() => setIsOpen(false)}
                  className="block p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <h3 className="font-medium text-foreground">{result.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {result.excerpt}
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
              Press <kbd className="px-1 py-0.5 bg-muted rounded">⌘K</kbd> to search
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
