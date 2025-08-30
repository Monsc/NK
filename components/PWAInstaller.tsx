'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, X } from 'lucide-react'

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setShowInstallButton(false)
    }
  }

  const handleDismiss = () => {
    setShowInstallButton(false)
  }

  if (!showInstallButton) return null

  return (
    <div className="fixed bottom-4 right-4 bg-card border rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Install NoKing App</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Get quick access to our democratic advocacy platform.
          </p>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleInstallClick}>
              <Download className="h-4 w-4 mr-2" />
              Install
            </Button>
            <Button size="sm" variant="outline" onClick={handleDismiss}>
              <X className="h-4 w-4 mr-2" />
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
