import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'

describe('Components', () => {
  describe('Header', () => {
    it('renders navigation links', () => {
      render(<Header />)
      
      expect(screen.getByText('NoKing')).toBeInTheDocument()
      expect(screen.getByText('Why Republic?')).toBeInTheDocument()
      expect(screen.getByText('Learn')).toBeInTheDocument()
      expect(screen.getByText('Act')).toBeInTheDocument()
      expect(screen.getByText('Support')).toBeInTheDocument()
    })
  })

  describe('Hero', () => {
    it('renders hero content', () => {
      render(<Hero />)
      
      expect(screen.getByText('A Democratic UK')).toBeInTheDocument()
      expect(screen.getByText(/Join the movement/)).toBeInTheDocument()
      expect(screen.getByText('Learn More')).toBeInTheDocument()
      expect(screen.getByText('Take Action')).toBeInTheDocument()
    })
  })

  describe('Footer', () => {
    it('renders footer content', () => {
      render(<Footer />)
      
      expect(screen.getByText(/© 2024 NoKing/)).toBeInTheDocument()
      expect(screen.getByText(/Advocating for a democratic UK/)).toBeInTheDocument()
    })
  })

  describe('Button', () => {
    it('renders button with text', () => {
      render(<Button>Click me</Button>)
      
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('applies variant classes', () => {
      render(<Button variant="destructive">Delete</Button>)
      
      const button = screen.getByRole('button', { name: 'Delete' })
      expect(button).toHaveClass('bg-destructive')
    })
  })
})
