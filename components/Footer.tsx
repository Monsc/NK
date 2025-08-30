import Link from 'next/link'
import { SocialButtons } from './SocialButtons'

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container-responsive py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gradient">NoKing</h3>
            <p className="text-subtitle leading-relaxed">
              Advocating for abolishing the British monarchy and ending hereditary privilege.
            </p>
            <SocialButtons />
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/why" className="text-muted-foreground hover:text-foreground transition-colors">
                  Why Abolish?
                </Link>
              </li>
              <li>
                <Link href="/learn" className="text-muted-foreground hover:text-foreground transition-colors">
                  Learn
                </Link>
              </li>
              <li>
                <Link href="/act" className="text-muted-foreground hover:text-foreground transition-colors">
                  Act
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/education" className="text-muted-foreground hover:text-foreground transition-colors">
                  Education
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-muted-foreground hover:text-foreground transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/transparency" className="text-muted-foreground hover:text-foreground transition-colors">
                  Transparency
                </Link>
              </li>
              <li>
                <Link href="/latest" className="text-muted-foreground hover:text-foreground transition-colors">
                  Latest News
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/legal" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center">
          <p className="text-subtitle">
            © 2024 NoKing. All rights reserved. Advocating for abolishing the British monarchy.
          </p>
        </div>
      </div>
    </footer>
  )
}
