import { Button } from '@/components/ui/button'
import { Twitter, Facebook, Instagram, Youtube } from 'lucide-react'

export function SocialButtons() {
  const socialLinks = [
    {
      name: 'Twitter',
      href: 'https://twitter.com/noking',
      icon: Twitter,
      color: 'hover:bg-blue-500 hover:text-white'
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/noking',
      icon: Facebook,
      color: 'hover:bg-blue-600 hover:text-white'
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/noking',
      icon: Instagram,
      color: 'hover:bg-pink-500 hover:text-white'
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/noking',
      icon: Youtube,
      color: 'hover:bg-red-500 hover:text-white'
    }
  ]

  return (
    <div className="flex gap-2">
      {socialLinks.map((social) => (
        <Button
          key={social.name}
          variant="outline"
          size="sm"
          asChild
          className={social.color}
        >
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow us on ${social.name}`}
          >
            <social.icon className="h-4 w-4" />
          </a>
        </Button>
      ))}
    </div>
  )
}
