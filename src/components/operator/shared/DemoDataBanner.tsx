import { AlertCircle } from 'lucide-react'

export default function DemoDataBanner() {
  return (
    <div
      className="rounded-lg px-3 py-1.5 inline-flex items-center gap-2 text-[11px]"
      style={{
        background: 'rgba(255,211,122,0.12)',
        border: '1px solid rgba(255,211,122,0.3)',
        color: '#92400E',
      }}
    >
      <AlertCircle size={11} />
      Demo data — figures are illustrative, not real company metrics
    </div>
  )
}
