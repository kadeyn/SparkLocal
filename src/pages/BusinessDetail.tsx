import { useParams } from 'react-router-dom'

export default function BusinessDetail() {
  const { id } = useParams()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Business Detail</h1>
        <p className="text-muted-foreground mt-2">/business/{id} — Coming Soon</p>
      </div>
    </div>
  )
}
