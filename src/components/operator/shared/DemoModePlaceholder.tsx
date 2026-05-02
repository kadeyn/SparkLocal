export default function DemoModePlaceholder() {
  return (
    <div className="rounded-2xl p-4 bg-slate-100 border border-slate-200">
      <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">
        Demo mode
      </div>
      <div className="text-sm text-slate-700">
        Live AI calls disabled. Set VITE_AI_DEMO_MODE=false to enable.
      </div>
    </div>
  )
}
