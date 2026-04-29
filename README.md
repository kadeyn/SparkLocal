# SparkLocal

![Status: Pre-MVP Visual Prototype](https://img.shields.io/badge/Status-Pre--MVP%20Visual%20Prototype-orange)

SparkLocal is a youth entrepreneurship marketplace connecting students ages 11–18 with verified local business owners and AI-suggested earning opportunities — all parent-approved.

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui (Radix primitives)
- **Routing:** React Router 7
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Type-check with TypeScript

## Project Structure

```
src/
├── components/
│   ├── brand/          # Logo, BrandGradient utilities
│   └── ui/             # shadcn/ui components
├── data/               # Mock data (businessOwners, aiIdeas, kidProfile)
├── lib/                # Utilities and theme config
└── pages/              # Route components
```

## License

MIT
