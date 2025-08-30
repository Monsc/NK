'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Callout } from './Callout'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message)
        setEmail('')
        setName('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to subscribe')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-xl border">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Stay in the Loop</h3>
        <p className="text-muted-foreground">
          Join thousands of supporters fighting for a democratic UK. Get exclusive updates, 
          event invitations, and ways to make a difference.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
            📰
          </div>
          <p className="text-sm font-medium">Weekly Updates</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
            🎯
          </div>
          <p className="text-sm font-medium">Action Alerts</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
            🤝
          </div>
          <p className="text-sm font-medium">Community Events</p>
        </div>
      </div>

      {status === 'success' && (
        <Callout type="success" className="mb-6">
          <div>
            <strong>Welcome to the movement!</strong>
            <p className="mt-1">{message}</p>
          </div>
        </Callout>
      )}

      {status === 'error' && (
        <Callout type="warning" className="mb-6">
          <div>
            <strong>Oops!</strong>
            <p className="mt-1">{message}</p>
          </div>
        </Callout>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">First Name (optional)</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your first name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="mt-1"
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={status === 'loading'} 
          className="w-full h-12 text-lg"
        >
          {status === 'loading' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Subscribing...
            </>
          ) : (
            'Join the Movement'
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          We respect your privacy. Unsubscribe at any time. 
          <br />
          By subscribing, you agree to our privacy policy.
        </p>
      </form>

      {/* Social Proof */}
      <div className="mt-6 pt-6 border-t text-center">
        <p className="text-sm text-muted-foreground">
          ✨ Join <strong>15,420+</strong> supporters already making a difference
        </p>
      </div>
    </div>
  )
}
