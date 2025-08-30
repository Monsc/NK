'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Callout } from './Callout'

interface SurveyQuestion {
  id: string
  question: string
  type: 'text' | 'rating' | 'multiple-choice'
  options?: string[]
}

interface SurveyProps {
  title: string
  description: string
  questions: SurveyQuestion[]
}

export function Survey({ title, description, questions }: SurveyProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Here you would typically send the survey data to your API
    console.log('Survey answers:', answers)
    
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="p-6">
          <Callout type="success">
            <h3 className="font-semibold mb-2">Thank you for your feedback!</h3>
            <p>Your responses help us improve our advocacy work.</p>
          </Callout>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((question) => (
            <div key={question.id} className="space-y-3">
              <Label className="text-base font-medium">
                {question.question}
              </Label>
              
              {question.type === 'text' && (
                <Textarea
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder="Your answer..."
                  rows={3}
                />
              )}
              
              {question.type === 'rating' && (
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      type="button"
                      variant={answers[question.id] === rating.toString() ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAnswerChange(question.id, rating.toString())}
                    >
                      {rating}
                    </Button>
                  ))}
                </div>
              )}
              
              {question.type === 'multiple-choice' && question.options && (
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="rounded"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <Button type="submit" className="w-full">
            Submit Survey
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
