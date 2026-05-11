// Owner Playbook knowledge base — strategic guidance for business owners hiring
// teens through SparkLocal. Shape mirrors operatorKnowledgeBase.ts so the
// RAG-lite UI patterns work identically.

export type OwnerKBCategory =
  | 'Delegation'
  | 'Hiring'
  | 'Pricing'
  | 'Operations'
  | 'Growth'
  | 'Compliance'
  | 'Tax'
  | 'Marketing'

export interface OwnerKnowledgeEntry {
  id: string
  category: OwnerKBCategory
  title: string
  content: string
  tags: string[]
}

export const OWNER_KNOWLEDGE_BASE: OwnerKnowledgeEntry[] = [
  // ── Delegation ────────────────────────────────────────────────────────────
  {
    id: 'okb-1',
    category: 'Delegation',
    title: 'How to delegate a service call to a 16-year-old apprentice',
    content:
      'Start small: scope a delegation by the smallest reversible unit. A first-time apprentice should never run a service call solo. Pair them on three back-to-back ride-alongs, then let them lead the customer greeting and intake while you stand back. By the 5th call, hand off setup (tools, customer history pull) entirely. Full handoff happens around call #15-20 on routine maintenance only — never on diagnostics, never on warranty work. Document the handoff stages so the next apprentice ramps faster. Expect a 30-60 day curve before they are net-positive on a route.',
    tags: ['delegation', 'apprentice', 'ride-along', 'onboarding'],
  },
  {
    id: 'okb-2',
    category: 'Delegation',
    title: 'The "Watch, Help, Lead" handoff framework',
    content:
      'Three-stage framework for moving an apprentice from observer to operator: (1) Watch — they shadow with no responsibility, ~5 sessions. Goal: pattern recognition. (2) Help — they assist on specific sub-tasks (carrying tools, taking customer notes), ~10 sessions. Goal: get hands on. (3) Lead — they run the work with you as backup, ~5 sessions. Goal: build customer-facing confidence. After Lead, the next call is theirs. The most common mistake is collapsing Watch and Help, then wondering why they freeze in front of a customer.',
    tags: ['delegation', 'framework', 'progression'],
  },
  {
    id: 'okb-3',
    category: 'Delegation',
    title: 'When NOT to delegate to a teen apprentice',
    content:
      'Three permanent no-gos under federal youth labor law and platform policy: (1) Anything involving live electrical above 50V, (2) Driving a company vehicle on public roads if under 17, (3) Operating power tools rated "hazardous" by the FLSA (e.g., circular saws, table saws). Beyond legal: never delegate the first customer conversation of a new account, never delegate cash handling without a co-sign, and never delegate work where mistakes would cost more than 2x their weekly wage. The rule of thumb: the cost of a mistake should be less than the cost of you doing it yourself.',
    tags: ['delegation', 'compliance', 'safety', 'no-gos'],
  },

  // ── Hiring ────────────────────────────────────────────────────────────────
  {
    id: 'okb-4',
    category: 'Hiring',
    title: 'Reading match scores on SparkLocal',
    content:
      'Match score combines interest overlap (40%), proximity (25%), schedule fit (20%), and platform engagement signals (15%). 85+ is a strong fit — start the conversation. 70-84 is worth a second look if the interests line up with your specific need. Below 70, only proceed if you have a niche role the algorithm could not weight properly (e.g., bilingual customer-facing work). Match score is not skill — it is fit. A 96 match still needs a real interview.',
    tags: ['hiring', 'match-score', 'algorithm'],
  },
  {
    id: 'okb-5',
    category: 'Hiring',
    title: 'The 15-minute intro call: a question script',
    content:
      'Five questions, 15 minutes, on speakerphone with the parent present if the kid is under 16: (1) "Walk me through your day yesterday." — energy check. (2) "What is something you fixed or built recently?" — agency check. (3) "What is the hardest thing you have stuck with?" — grit check. (4) "If a customer was upset, what would you do in the first 30 seconds?" — composure check. (5) "What do you want to learn from this?" — alignment check. Skip the resume — most teens do not have one. The intro call is for vibe and curiosity, not credentials.',
    tags: ['hiring', 'interview', 'script', 'parents'],
  },
  {
    id: 'okb-6',
    category: 'Hiring',
    title: 'When to hire your apprentice full-time',
    content:
      'Move from apprentice to full-time when three conditions hold: (1) They have run 20+ solo jobs without a callback that required your physical intervention. (2) They have at least 30 days of cushion in your cash flow to cover their salary if revenue dipped 20%. (3) They want it — do not promote a kid who is happy as an hourly apprentice into a salaried role they did not ask for. Once eligible, the timing question is "do I have the work?" not "are they ready?" — readiness comes faster than demand for most one-truck shops.',
    tags: ['hiring', 'full-time', 'promotion'],
  },
  {
    id: 'okb-7',
    category: 'Hiring',
    title: 'Handling a kid who is not showing up',
    content:
      'First missed shift, send one text: "Saw you missed today — everything ok?" That is it. No lecture. 80% of first misses are a one-time real reason. Second miss inside 60 days, schedule a 10-minute call (not a text) with the parent looped in. Ask one question: "Is this still working for you?" Give them the easy out. Third miss, end the engagement on the platform with a 3-star "scheduling inconsistent" rating. Do not let attendance issues drag for a month — it teaches the rest of your team that no-shows are tolerated.',
    tags: ['hiring', 'attendance', 'no-show', 'feedback'],
  },

  // ── Pricing ───────────────────────────────────────────────────────────────
  {
    id: 'okb-8',
    category: 'Pricing',
    title: 'What is the right hourly rate for a first-time kid hire?',
    content:
      'Benchmark for non-licensed work in the southeastern US: $12-15/hr for 14-15 year olds, $14-17/hr for 16-17 year olds. Pay above your local minimum wage by at least $2 — it is what separates "real job" from "side gig" in the kid\'s mind and signals seriousness. Do not lowball: a $1/hr difference will not move your margin, but it will move retention. Pay weekly, not biweekly — teens experience time differently than adults.',
    tags: ['pricing', 'wages', 'compensation'],
  },
  {
    id: 'okb-9',
    category: 'Pricing',
    title: 'Project pricing vs hourly for one-off gigs',
    content:
      'For defined deliverables (build a website, run an Instagram campaign, organize the back office), use project pricing. Estimate the time, multiply by 1.4 (kids estimate optimistically), multiply by their hourly. Then quote a fixed price. For open-ended apprentice work where you are training them on a trade, use hourly. Project pricing teaches them scope; hourly teaches them craft. Mix both deliberately based on what skill you want to grow.',
    tags: ['pricing', 'project', 'hourly', 'scope'],
  },
  {
    id: 'okb-10',
    category: 'Pricing',
    title: 'Raises and the 90-day check-in',
    content:
      'Schedule a wage check-in at day 90, not day 365. A $1/hr bump after a productive first 90 days costs you ~$2,000 a year and buys you a kid who tells their friends "this place is the real deal." A 90-day raise also gives you cover to NOT raise wages immediately if the work has not improved — the conversation is built into the calendar so it is not awkward.',
    tags: ['pricing', 'raises', 'retention'],
  },

  // ── Operations ────────────────────────────────────────────────────────────
  {
    id: 'okb-11',
    category: 'Operations',
    title: 'The first 30 days: a week-by-week onboarding playbook',
    content:
      'Week 1 — pure shadowing. They are with you on every call. No tools, no customer talk. The goal is for them to see what a normal day actually looks like. Week 2 — they carry tools and take notes. They can answer simple customer questions ("when did you call us?"). Week 3 — they own the setup and breakdown of each job, and they greet the customer first. Week 4 — they run one full simple job (e.g., filter change, basic maintenance) under your eye. Pass that and they graduate to "Active" on SparkLocal with you as their named mentor.',
    tags: ['operations', 'onboarding', '30-day', 'curriculum'],
  },
  {
    id: 'okb-12',
    category: 'Operations',
    title: 'Scheduling around school hours',
    content:
      'Federal FLSA rules for 14-15 year olds during school weeks: max 3 hours on a school day, max 18 hours per week, no work before 7am or after 7pm (9pm in summer). 16-17 year olds have no federal hour limits but most states layer their own. Practically: schedule teens 3-7pm on weekdays and Saturday mornings. Never 5am calls. Build their schedule in 2-week blocks so they can plan around tests and games. School comes first — say it out loud.',
    tags: ['operations', 'scheduling', 'school', 'compliance'],
  },
  {
    id: 'okb-13',
    category: 'Operations',
    title: 'Tools, uniforms, and what you provide vs they provide',
    content:
      'You provide: anything that costs over $30, anything safety-related (gloves, eye protection, ear plugs), branded uniform shirts (2 minimum), and any tool specific to your trade. They provide: closed-toe boots, jeans, water bottle, phone. Charging them for tools is a fast way to lose them in week 3. If you want skin in the game, give them a tool of their own after 90 days — a real one, with their name engraved. Costs ~$40 and buys you years of loyalty.',
    tags: ['operations', 'tools', 'uniform', 'equipment'],
  },

  // ── Growth ────────────────────────────────────────────────────────────────
  {
    id: 'okb-14',
    category: 'Growth',
    title: 'When to add a second apprentice (and when not to)',
    content:
      'Add a second only when: (1) your first apprentice is averaging 25+ billable hours/wk on their own, (2) you are turning down jobs you would have taken six months ago, and (3) you can cover both wages from existing revenue with at least 30 days of buffer. Do NOT add a second to "give the first one company" or to "scale up" — two apprentices need 2x the supervision until they have run jobs solo. Most one-truck shops bottleneck at apprentice #2 because the founder has not built a real route planning system yet.',
    tags: ['growth', 'scaling', 'second-hire'],
  },
  {
    id: 'okb-15',
    category: 'Growth',
    title: 'Using SparkLocal\'s Verified Plus tier',
    content:
      'Verified Plus ($49/mo at the time of writing) gives you: priority placement in match results, a featured badge on your business profile, and access to advanced filters (cert level, exact hours available). Worth it if you are getting 5+ matches a month already — the conversion lift on featured placement is typically 30-45% in early data. Not worth it in your first 60 days on the platform when you are still learning what kinds of kids fit your shop.',
    tags: ['growth', 'subscription', 'verified-plus'],
  },
  {
    id: 'okb-16',
    category: 'Growth',
    title: 'Cross-selling apprentices across business lines',
    content:
      'A teen who started doing social media for your shop probably has a friend who would do scheduling. A kid who is great on residential maintenance can often handle commercial intake calls. Once a kid has 60 days on your platform, ask them: "What is something at the shop I would not think to ask you to do?" The answers often unlock entirely new revenue streams (e.g., Lina at Blossom Bakery hired a teen for Instagram who ended up running a $400/mo subscription "behind the scenes" newsletter).',
    tags: ['growth', 'cross-sell', 'apprentice', 'creative'],
  },

  // ── Compliance ────────────────────────────────────────────────────────────
  {
    id: 'okb-17',
    category: 'Compliance',
    title: 'State youth labor law cheat sheet (AL, MS, FL, GA, TN)',
    content:
      'Alabama: 14-15 year olds need work permits from the school, 16-17 do not. Max 3hr school days for 14-15. Mississippi: similar to Alabama, plus a hazardous orders list that includes most power tools. Florida: 14-15 need a permit, 16-17 do not, max 4hr school days for 14-15. Georgia: no permit required at any age, follows federal FLSA for hours. Tennessee: 14-15 need a permit through TN Dept of Labor, max 3hr school days. ALL of these prohibit work during regular school hours for ages 14-15. When in doubt, schedule weekday work 3-7pm only.',
    tags: ['compliance', 'state-law', 'labor', 'permits'],
  },
  {
    id: 'okb-18',
    category: 'Compliance',
    title: 'Workers comp and small-business insurance for teen hires',
    content:
      'Most state workers comp laws cover anyone you pay, including teens — call your insurance agent and confirm. Some states exempt employers with fewer than 5 employees; you may still want voluntary coverage. General liability is non-negotiable: a $1M policy is typically $400-700/yr for a one-truck operation and covers most apprentice mishaps. Without coverage, a single injury claim can be a business-ending event. Ask SparkLocal support for the standard rider language they recommend for partner businesses.',
    tags: ['compliance', 'insurance', 'workers-comp', 'liability'],
  },
  {
    id: 'okb-19',
    category: 'Compliance',
    title: 'Independent contractor vs employee for teens',
    content:
      'SparkLocal\'s default platform structure is independent contractor with parental supervision — this works for project-based gigs (social media, one-off organizing). For ongoing weekly hourly work, IRS guidance (especially after recent revisions) leans toward W-2 employee status. Talk to a small-business accountant once your apprentice crosses 15 hours/wk for 3+ months. The misclassification penalty is steep; the bookkeeping bump to W-2 is mild.',
    tags: ['compliance', 'irs', 'contractor', 'w2'],
  },

  // ── Tax ───────────────────────────────────────────────────────────────────
  {
    id: 'okb-20',
    category: 'Tax',
    title: 'Work Opportunity Tax Credit (WOTC) for hiring youth',
    content:
      'The federal Work Opportunity Tax Credit can offset 25-40% of first-year wages (up to $2,400 per qualifying employee) when you hire from designated groups, including "qualified summer youth" ages 16-17 living in an Empowerment Zone. The credit applies to W-2 hires, not 1099 contractors. To claim: file IRS Form 8850 with your state workforce agency within 28 days of the hire date — miss the window and you lose the credit. Most small businesses leave this on the table; ask your accountant explicitly.',
    tags: ['tax', 'wotc', 'credit', 'federal'],
  },
  {
    id: 'okb-21',
    category: 'Tax',
    title: 'Deducting apprenticeship training expenses',
    content:
      'Training expenses for an apprentice — tools you bought for them, courses you paid for, certification exam fees — are ordinary business expenses, fully deductible. Track them separately so your accountant can break out "employee training" on your Schedule C. Also deductible: the value of free meals you provide on long jobs (de minimis fringe benefit), uniforms you supplied, and mileage if they drive their own vehicle on company business at the standard IRS rate. Keep receipts.',
    tags: ['tax', 'deductions', 'training', 'expenses'],
  },

  // ── Marketing ─────────────────────────────────────────────────────────────
  {
    id: 'okb-22',
    category: 'Marketing',
    title: 'The "I hire local kids" badge as a marketing asset',
    content:
      'Most local businesses do not realize that "we apprentice local high schoolers" is one of the strongest differentiators they have. It signals: rooted in the community, willing to invest, not a fly-by-night op. Put the SparkLocal mentor badge on your website, your truck (a magnet works), your Google Business profile, and your invoice footer. Reference your apprentices by first name on social: "Carlos handled the install today — he\'s now diagnosing thermostats solo." This converts at 2-3x the rate of generic "family-owned" copy in customer surveys.',
    tags: ['marketing', 'badge', 'differentiation', 'community'],
  },
]

export const DEMO_OWNER_PLAYBOOK_RESPONSES: Record<string, { answer: string; sources: string[] }> = {
  default: {
    answer:
      'Based on the owner playbook, I can help you think through delegation, hiring, pricing, daily operations, growth decisions, compliance, taxes (including the Work Opportunity Tax Credit), and how to market your apprenticeship program. Ask me something specific — e.g., "how do I set a fair rate for a 16-year-old?" or "when should I add a second apprentice?"',
    sources: ['okb-1', 'okb-14'],
  },
  delegate: {
    answer:
      'Start with the "Watch, Help, Lead" framework [okb-2]: five shadow sessions, ten assisted, then five customer-facing ones with you as backup. Never delegate live electrical above 50V, driving on public roads under 17, or hazardous-rated power tools [okb-3]. The rule of thumb: the cost of a mistake should be less than the cost of you doing the work yourself.',
    sources: ['okb-1', 'okb-2', 'okb-3'],
  },
  rate: {
    answer:
      'For a first-time hire in the southeastern US, pay $12-15/hr for 14-15 year olds and $14-17/hr for 16-17 year olds [okb-8]. Pay at least $2/hr above your local minimum — it is what makes the role feel like a real job. Pay weekly. Schedule a wage check-in at day 90, not day 365 [okb-10] — a $1/hr bump after a productive first quarter buys you serious loyalty for ~$2,000 a year.',
    sources: ['okb-8', 'okb-10'],
  },
  noshow: {
    answer:
      'First missed shift, send one short text: "Saw you missed today — everything ok?" — no lecture. Second miss in 60 days, schedule a call with the parent looped in and ask "is this still working?" Third miss, close the engagement on the platform with a 3-star rating. Do not let attendance issues drag — it teaches the rest of your team that no-shows are tolerated [okb-7].',
    sources: ['okb-7'],
  },
  fulltime: {
    answer:
      'Move from apprentice to full-time when three conditions hold: 20+ solo jobs without a callback that needed your physical intervention, 30 days of cash cushion to cover their salary at a -20% revenue scenario, and they want the role [okb-6]. Once eligible, the real question is "do I have the work?" not "are they ready?" — readiness comes faster than demand for most one-truck shops.',
    sources: ['okb-6'],
  },
  tax: {
    answer:
      'The federal Work Opportunity Tax Credit can offset 25-40% of first-year wages (up to $2,400) when you hire qualifying summer youth ages 16-17 in an Empowerment Zone [okb-20]. The credit only applies to W-2 hires, and you must file IRS Form 8850 with your state workforce agency within 28 days of the hire — miss that window and the credit is gone. Apprenticeship training expenses are also fully deductible business expenses [okb-21].',
    sources: ['okb-20', 'okb-21'],
  },
}

export const getOwnerKnowledgeByCategory = (
  category: OwnerKBCategory,
): OwnerKnowledgeEntry[] => {
  return OWNER_KNOWLEDGE_BASE.filter((entry) => entry.category === category)
}

export const searchOwnerKnowledge = (query: string): OwnerKnowledgeEntry[] => {
  const lower = query.toLowerCase()
  return OWNER_KNOWLEDGE_BASE.filter(
    (entry) =>
      entry.title.toLowerCase().includes(lower) ||
      entry.content.toLowerCase().includes(lower) ||
      entry.tags.some((tag) => tag.includes(lower)),
  )
}

export const getOwnerKnowledgeCategories = (): OwnerKBCategory[] => {
  return [...new Set(OWNER_KNOWLEDGE_BASE.map((e) => e.category))] as OwnerKBCategory[]
}
