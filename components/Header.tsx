'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-soft">
      <div className="container-responsive py-4">
        <div className="flex justify-between items-center">
          {/* Left Logo - NoKing in red */}
          <Link href="/" className="text-2xl font-bold text-red-600">
            NoKing
          </Link>
          
          {/* Desktop Navigation - Right Aligned */}
          <nav className="hidden md:flex space-x-6 ml-auto mr-4">
            <Link href="/why" className="hover:text-red-600 transition-colors text-foreground">
              Why Republic?
            </Link>
            <Link href="/learn" className="hover:text-red-600 transition-colors text-foreground">
              Learn
            </Link>
            <Link href="/education" className="hover:text-red-600 transition-colors text-foreground">
              Education
            </Link>
            <Link href="/act" className="hover:text-red-600 transition-colors text-foreground">
              Act
            </Link>
            <Link href="/support" className="hover:text-red-600 transition-colors text-foreground">
              Support
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="p-2 text-foreground">
              <Search className="h-4 w-4" />
            </Button>
            <Button asChild className="text-white bg-red-600 hover:bg-red-700">
              <Link href="/support">Donate</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t mt-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/why" 
                className="hover:text-red-600 transition-colors text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Why Republic?
              </Link>
              <Link 
                href="/learn" 
                className="hover:text-red-600 transition-colors text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Learn
              </Link>
              <Link 
                href="/education" 
                className="hover:text-red-600 transition-colors text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Education
              </Link>
              <Link 
                href="/act" 
                className="hover:text-red-600 transition-colors text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Act
              </Link>
              <Link 
                href="/support" 
                className="hover:text-red-600 transition-colors text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>
              <div className="pt-4 border-t">
                <Button asChild className="w-full text-white bg-red-600 hover:bg-red-700">
                  <Link href="/support">Donate</Link>
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
      
      {/* Join the Movement bar */}
      <div className="bg-gray-100 py-2">
        <div className="container-responsive">
          <p className="text-center text-sm text-gray-600">Join the Movement</p>
        </div>
      </div>
    </header>
  )
}
