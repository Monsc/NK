import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Heart, Users, Send } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Democratic Principles",
      description: "Modern democracies elect their heads of state through democratic processes."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Cost to Taxpayers",
      description: "Hereditary privilege costs UK taxpayers millions annually."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Action",
      description: "Join local groups and participate in democratic reform efforts."
    },
    {
      icon: <Send className="h-8 w-8" />,
      title: "Take Action",
      description: "Sign petitions, attend events, and advocate for change."
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-responsive">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
            Why Support a Republic?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md rounded-lg">
              <CardHeader className="pb-4">
                <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors w-fit">
                  <div className="text-red-600">
                    {feature.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-xl mb-3 group-hover:text-red-600 transition-colors">
                  {feature.title}
                </CardTitle>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
