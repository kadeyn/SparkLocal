import { MessageSquare } from 'lucide-react'

export default function Messages() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <MessageSquare className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">Messages</h1>
      <p className="text-muted-foreground text-center">Coming soon</p>
    </div>
  )
}
