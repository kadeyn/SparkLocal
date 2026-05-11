import { useMemo, useState } from 'react'
import { Award, Plus, Send, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { listBadgeClasses } from '@/lib/credentials/badgeSchema'
import {
  getProposalProvider,
  type BadgeProposal,
} from '@/lib/credentials/proposalStore'

export interface BadgeIssuanceFormKid {
  id: string
  firstName: string // First name only — PII minimization
}

export interface BadgeIssuanceFormMentor {
  id: string
  displayName: string // First name + last initial; never full last name
  businessName?: string
}

export interface BadgeIssuanceFormDefaults {
  city?: string
  state?: string
}

interface BadgeIssuanceFormProps {
  mentor: BadgeIssuanceFormMentor
  kids: BadgeIssuanceFormKid[]
  defaults?: BadgeIssuanceFormDefaults
  onProposed?: (proposal: BadgeProposal) => void
}

export default function BadgeIssuanceForm({
  mentor,
  kids,
  defaults,
  onProposed,
}: BadgeIssuanceFormProps) {
  const badgeClasses = useMemo(() => listBadgeClasses(), [])

  const [kidId, setKidId] = useState<string>(kids[0]?.id ?? '')
  const [badgeClassId, setBadgeClassId] = useState<string>(badgeClasses[0]?.id ?? '')
  const [city, setCity] = useState(defaults?.city ?? '')
  const [state, setState] = useState(defaults?.state ?? '')
  const [completedAt, setCompletedAt] = useState(() => new Date().toISOString().slice(0, 10))
  const [skills, setSkills] = useState<string[]>([])
  const [skillDraft, setSkillDraft] = useState('')
  const [mentorNote, setMentorNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<BadgeProposal | null>(null)

  const selectedKid = kids.find((k) => k.id === kidId)
  const selectedBadge = badgeClasses.find((b) => b.id === badgeClassId)

  const addSkill = (raw: string) => {
    const cleaned = raw.trim().replace(/,$/, '').trim()
    if (!cleaned) return
    setSkills((prev) => (prev.includes(cleaned) ? prev : [...prev, cleaned]))
    setSkillDraft('')
  }

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill))
  }

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill(skillDraft)
    }
  }

  const canSubmit = Boolean(
    kidId && badgeClassId && city.trim() && state.trim() && completedAt && !submitting,
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || !selectedKid) return
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    // Capture any in-flight skill draft so a mentor isn't penalized for not
    // hitting Enter.
    const trailingSkill = skillDraft.trim()
    const finalSkills = trailingSkill && !skills.includes(trailingSkill)
      ? [...skills, trailingSkill]
      : skills

    try {
      const proposal = await getProposalProvider().createProposal({
        badgeClassId,
        proposedBy: {
          mentorId: mentor.id,
          mentorDisplayName: mentor.displayName,
          mentorBusinessName: mentor.businessName,
        },
        recipientKidId: selectedKid.id,
        recipientFirstName: selectedKid.firstName,
        context: {
          completedAt: new Date(completedAt).toISOString(),
          city: city.trim(),
          state: state.trim(),
          skills: finalSkills,
          mentorNote: mentorNote.trim() || undefined,
        },
      })
      setSuccess(proposal)
      onProposed?.(proposal)
      // Reset volatile fields but keep mentor + location for a likely
      // batch-issuing flow.
      setSkills([])
      setSkillDraft('')
      setMentorNote('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not propose the badge — try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Issuing as — read-only mentor context */}
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
          Issuing as
        </p>
        <p className="text-sm text-slate-900">
          {mentor.displayName}
          {mentor.businessName && (
            <span className="text-slate-500"> · {mentor.businessName}</span>
          )}
        </p>
      </div>

      {/* Kid selector */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Propose to
        </label>
        <select
          value={kidId}
          onChange={(e) => setKidId(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
          required
        >
          <option value="">Select a kid…</option>
          {kids.map((k) => (
            <option key={k.id} value={k.id}>
              {k.firstName}
            </option>
          ))}
        </select>
      </div>

      {/* Badge class selector */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Badge
        </label>
        <select
          value={badgeClassId}
          onChange={(e) => setBadgeClassId(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
          required
        >
          {badgeClasses.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        {selectedBadge && (
          <div className="mt-2 rounded-lg bg-slate-50 border border-slate-100 p-3 flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #fb7185 100%)',
              }}
            >
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{selectedBadge.name}</p>
              <p className="text-xs text-slate-600 mt-0.5">{selectedBadge.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Gig context: city + state + date */}
      <div className="grid grid-cols-6 gap-3">
        <div className="col-span-3">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Mobile"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            required
          />
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">State</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
            placeholder="AL"
            maxLength={2}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 uppercase"
            required
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Completed</label>
          <input
            type="date"
            value={completedAt}
            onChange={(e) => setCompletedAt(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            required
          />
        </div>
      </div>

      {/* Skills tag input */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Skills demonstrated
        </label>
        <p className="text-xs text-slate-500 mb-2">
          Press Enter or comma to add. These travel with the credential.
        </p>
        <div className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 flex flex-wrap gap-1.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
          {skills.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs"
            >
              {s}
              <button
                type="button"
                onClick={() => removeSkill(s)}
                aria-label={`Remove ${s}`}
                className="hover:text-emerald-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={skillDraft}
            onChange={(e) => setSkillDraft(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            onBlur={() => addSkill(skillDraft)}
            placeholder={skills.length ? '' : 'e.g. wrote captions, edited reels'}
            className="flex-1 min-w-[140px] px-1 py-1 text-sm bg-transparent focus:outline-none placeholder-slate-400"
          />
        </div>
      </div>

      {/* Optional narrative */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Note to {selectedKid?.firstName ?? 'the kid'} (optional)
        </label>
        <textarea
          value={mentorNote}
          onChange={(e) => setMentorNote(e.target.value)}
          rows={3}
          placeholder="A specific thing they did well, or why this badge fits them."
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-rose-700" role="alert">
          {error}
        </p>
      )}

      {success && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-emerald-900">
              Proposed to {success.recipientFirstName}.
            </p>
            <p className="text-xs text-emerald-700 mt-0.5">
              They'll see it in their portfolio and can accept or decline. Expires{' '}
              {new Date(success.expiresAt).toLocaleDateString()}.
            </p>
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={!canSubmit}
        className={cn(
          'w-full bg-gradient-to-r from-emerald-500 to-amber-500',
          'hover:from-emerald-400 hover:to-amber-400 text-white font-semibold',
        )}
      >
        {submitting ? (
          <>
            <Plus className="w-4 h-4 mr-1.5 animate-pulse" />
            Sending…
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-1.5" />
            Propose badge
          </>
        )}
      </Button>
    </form>
  )
}
