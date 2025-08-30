'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'

interface ReviewTask {
  id: string
  kind: 'EVIDENCE' | 'TEMPLATE' | 'NEWS' | 'LEDGER_REPORT'
  targetId: string
  title: string
  summary?: string
  sources: string[]
  risk: number
  state: 'REVIEWING' | 'APPROVED' | 'REJECTED'
  checklist: {
    sources: boolean
    quotes: boolean
    counterview: boolean
    numbers: boolean
    rights: boolean
    style: boolean
  }
  notes?: string
  reviewer?: string
  createdAt: number
  updatedAt: number
}

export default function AdminReviewPage() {
  const [tasks, setTasks] = useState<ReviewTask[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<ReviewTask | null>(null)

  useEffect(() => {
    fetchReviewTasks()
  }, [])

  const fetchReviewTasks = async () => {
    try {
      const response = await fetch('/api/review/tasks')
      const data = await response.json()
      if (data.success) {
        setTasks(data.data)
      }
    } catch (error) {
      console.error('Error fetching review tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (taskId: string) => {
    try {
      const response = await fetch(`/api/review/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: 'APPROVED',
          reviewer: 'admin-user',
          notes: 'Approved by admin'
        })
      })
      
      if (response.ok) {
        await fetchReviewTasks()
        setSelectedTask(null)
      }
    } catch (error) {
      console.error('Error approving task:', error)
    }
  }

  const handleReject = async (taskId: string, notes: string) => {
    try {
      const response = await fetch(`/api/review/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: 'REJECTED',
          reviewer: 'admin-user',
          notes
        })
      })
      
      if (response.ok) {
        await fetchReviewTasks()
        setSelectedTask(null)
      }
    } catch (error) {
      console.error('Error rejecting task:', error)
    }
  }

  const getRiskColor = (risk: number) => {
    if (risk <= 2) return 'bg-green-100 text-green-800'
    if (risk <= 3) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getRiskLabel = (risk: number) => {
    if (risk <= 2) return 'Low'
    if (risk <= 3) return 'Medium'
    return 'High'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-20">
          <div className="container-responsive">
            <div className="text-center">Loading review tasks...</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-20">
        <div className="container-responsive">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4 text-black">Review Queue</h1>
              <p className="text-gray-600">
                Review and approve content before publication. All content must pass the 6-point checklist.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Task List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Pending Reviews ({tasks.filter(t => t.state === 'REVIEWING').length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tasks
                        .filter(task => task.state === 'REVIEWING')
                        .map(task => (
                          <div
                            key={task.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedTask?.id === task.id
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedTask(task)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant="outline" className="text-xs">
                                {task.kind}
                              </Badge>
                              <Badge className={`text-xs ${getRiskColor(task.risk)}`}>
                                {getRiskLabel(task.risk)} Risk
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-sm mb-1">{task.title}</h3>
                            <p className="text-xs text-gray-600 mb-2">
                              {task.summary?.substring(0, 100)}...
                            </p>
                            <div className="text-xs text-gray-500">
                              {new Date(task.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      {tasks.filter(t => t.state === 'REVIEWING').length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                          No pending reviews
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Task Detail */}
              <div className="lg:col-span-2">
                {selectedTask ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="mb-2">{selectedTask.title}</CardTitle>
                          <div className="flex items-center gap-4 text-sm">
                            <Badge variant="outline">{selectedTask.kind}</Badge>
                            <Badge className={getRiskColor(selectedTask.risk)}>
                              {getRiskLabel(selectedTask.risk)} Risk
                            </Badge>
                            <span className="text-gray-500">
                              Created {new Date(selectedTask.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Summary */}
                        {selectedTask.summary && (
                          <div>
                            <h3 className="font-semibold mb-2">Summary</h3>
                            <p className="text-gray-700">{selectedTask.summary}</p>
                          </div>
                        )}

                        {/* Sources */}
                        <div>
                          <h3 className="font-semibold mb-2">Sources</h3>
                          <ul className="space-y-1">
                            {selectedTask.sources.map((source, index) => (
                              <li key={index} className="text-sm">
                                <a href={source} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                  {source}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Checklist */}
                        <div>
                          <h3 className="font-semibold mb-2">Review Checklist</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(selectedTask.checklist).map(([key, value]) => (
                              <div key={key} className="flex items-center gap-2">
                                {value ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-600" />
                                )}
                                <span className="text-sm capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Notes */}
                        {selectedTask.notes && (
                          <div>
                            <h3 className="font-semibold mb-2">Notes</h3>
                            <p className="text-gray-700 text-sm">{selectedTask.notes}</p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4 border-t">
                          <Button
                            onClick={() => handleApprove(selectedTask.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleReject(selectedTask.id, 'Rejected by admin')}
                            className="border-red-600 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Select a task from the list to review</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
