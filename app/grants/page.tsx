import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  FileText, 
  Users, 
  Eye,
  CheckCircle,
  Clock,
  Award,
  Shield
} from 'lucide-react'

export default function GrantsPage() {
  const grants = [
    { title: 'Campus Outreach', budget: '50-150 USDT' },
    { title: 'Local Meetups', budget: '100-300 USDT' },
    { title: 'Research Microfund', budget: '200-500 USDT' },
    { title: 'Digital Materials', budget: '100-250 USDT' },
    { title: 'Community Art', budget: '75-200 USDT' },
    { title: 'Workshops', budget: '150-400 USDT' }
  ]

  const rubricCriteria = [
    {
      criterion: "Relevance",
      description: "How directly does the project advance the cause of monarchy abolition?",
      weight: "25%"
    },
    {
      criterion: "Impact",
      description: "What is the potential reach and influence of the project?",
      weight: "25%"
    },
    {
      criterion: "Cost-effectiveness",
      description: "Is the budget reasonable and well-justified for the expected outcomes?",
      weight: "20%"
    },
    {
      criterion: "Feasibility",
      description: "Can the project be completed successfully within the proposed timeline?",
      weight: "20%"
    },
    {
      criterion: "Verifiability",
      description: "How easily can we verify the project's completion and impact?",
      weight: "10%"
    }
  ]

  const applicationSteps = [
    {
      step: 1,
      title: "Submit Proposal",
      description: "Complete the application form with project details, budget, and timeline",
      icon: <FileText className="h-6 w-6" />
    },
    {
      step: 2,
      title: "Peer Review",
      description: "Applications are reviewed by community members and scored against our rubric",
      icon: <Users className="h-6 w-6" />
    },
    {
      step: 3,
      title: "Approval",
      description: "Top-scoring applications are approved for funding",
      icon: <CheckCircle className="h-6 w-6" />
    },
    {
      step: 4,
      title: "Milestone Funding",
      description: "50% upfront, 50% upon completion with evidence",
      icon: <Clock className="h-6 w-6" />
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-responsive py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-red-600 text-white">
            Action Fund
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
            Apply for Micro-Grants
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            The Action Fund supports grassroots projects that advance the cause of abolishing the monarchy. 
            Submit your proposal for funding to create abolition-themed campaigns, art, education, and activism.
          </p>
        </div>

        {/* Action Fund Explanation */}
        <Card className="mb-16 border-2 border-red-200">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Target className="h-8 w-8 text-red-600" />
              How the Action Fund Works
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Funding Mechanism</h3>
                <p className="text-slate-600 mb-4">
                  70% of all donations go directly to the Action Fund, supporting grassroots projects 
                  that challenge the monarchy and promote republican values.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li>• Micro-grants from 50 to 500 USDT per project</li>
                  <li>• Milestone-based funding (50% upfront, 50% upon completion)</li>
                  <li>• Public peer review process</li>
                  <li>• Complete transparency in all decisions</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Project Requirements</h3>
                <p className="text-slate-600 mb-4">
                  All funded projects must be lawful, non-violent, and advance the cause of monarchy abolition.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li>• Must provide evidence of completion</li>
                  <li>• Must be publicly verifiable</li>
                  <li>• Must align with our mission and values</li>
                  <li>• Must be completed within agreed timeline</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grant Types */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Supported Project Types</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grants.map((g) => (
              <Card key={g.title} className="border-2 border-slate-200 hover:border-red-300 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="h-8 w-8 text-red-600" />
                    <CardTitle className="text-xl">{g.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">Budget: {g.budget}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Application Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Application Process</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {applicationSteps.map((step) => (
              <Card key={step.step} className="border-2 border-slate-200 text-center">
                <CardHeader>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    {step.icon}
                    <Badge variant="secondary" className="bg-red-600 text-white">
                      Step {step.step}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Evaluation Rubric */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Evaluation Rubric</h2>
          <Card className="border-2 border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl">How Applications Are Scored</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {rubricCriteria.map((criterion) => (
                  <div key={criterion.criterion} className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg">
                    <Badge variant="outline" className="text-red-600 border-red-600 shrink-0">
                      {criterion.weight}
                    </Badge>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">{criterion.criterion}</h4>
                      <p className="text-slate-600">{criterion.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <Card className="text-center border-2 border-red-200 bg-red-50">
          <CardContent className="p-12">
            <h3 className="text-3xl font-bold mb-4 text-slate-900">Ready to Submit Your Proposal?</h3>
            <p className="text-xl text-slate-600 mb-8">
              Join the movement to abolish the monarchy. Your project could be the next step towards a republic.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8" asChild>
                <a href="/grants/apply">Apply Now</a>
              </Button>
              <Button variant="outline" size="lg" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8" asChild>
                <a href="/actions">View Funded Projects</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
