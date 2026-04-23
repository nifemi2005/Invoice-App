# Invoice App

A full-featured invoice management app was built as HNG stage 2 frontend task. Create, view, edit, and delete invoices with persistent storage, dark mode, and a fully responsive layout.

---

## Setup

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

The dev server runs at `http://localhost:5173` by default.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| State | React Context API |
| Persistence | localStorage |
| Icons | react-icons (Feather + Bootstrap) |

---

## Architecture

### Directory structure

```
src/
├── assets/          # Static images (logo, empty-state illustration)
├── Context/
│   ├── ThemeContext.jsx   # Light/dark mode state + toggle
│   └── InvoiceContext.jsx # Invoice CRUD state + localStorage sync
├── Componets/       # Reusable UI components
│   ├── Navbar.jsx
│   ├── Layout.jsx
│   ├── InvoiceList.jsx
│   ├── InvoiceCard.jsx
│   ├── InvoiceForm.jsx
│   ├── FilterDropdown.jsx
│   ├── StatusBadge.jsx
│   └── DeleteModal.jsx
├── pages/           # Route-level page components
│   ├── home.jsx
│   ├── NewInvoice.jsx
│   ├── EditInvoice.jsx
│   └── InvoiceDetails.jsx
├── App.jsx          # Route definitions
├── main.jsx         # Entry point + provider tree
└── index.css        # Tailwind import + CSS custom properties
```

### Routes

| Path | Page | Description |
|---|---|---|
| `/` | Home | Invoice list with filter |
| `/invoice/new` | NewInvoice | Create form |
| `/invoice/:id` | InvoiceDetails | View + actions |
| `/invoice/:id/edit` | EditInvoice | Edit form |

### State management

Two context providers wrap the app in `main.jsx`:

**ThemeContext** stores the current theme (`"light"` / `"dark"`), writes it to `localStorage`, and applies a `data-theme` attribute to `<html>`. Tailwind's CSS custom properties (`--bg-body`, `--bg-card`, etc.) read this attribute, so theme changes propagate without any JavaScript class toggling.

**InvoiceContext** holds the invoices array and exposes `addInvoice`, `updateInvoice`, and `deleteInvoice`. Every mutation calls `persist()`, which updates React state (triggering an immediate re-render) and writes the new array to `localStorage` in a single step. Initial load reads from `localStorage` or seeds from the built-in mock data if no data is found.

### Theming

CSS custom properties are defined in `index.css` under `:root` (light) and `[data-theme="dark"]`. Tailwind v4's `bg-(--var-name)` shorthand binds directly to these variables, so every component automatically responds to theme changes.

### Responsive layout

The navbar is a single component that switches between a fixed horizontal top bar (below `lg`) and a fixed vertical sidebar (`lg+`) using Tailwind responsive prefixes. `Layout.jsx` applies `pt-18` on mobile and `lg:pl-20` on desktop to offset content from the fixed nav.

---

## Trade-offs

**Context API over Redux / Zustand** — The app has two isolated slices of state (theme + invoices) with no cross-slice dependencies. Context is sufficient and avoids adding a dependency. The trade-off is that large invoice arrays would cause unnecessary re-renders of all consumers; a selector-based store would be preferable if the dataset grew.

**localStorage over IndexedDB** — localStorage is synchronous and has a ~5 MB limit. For this use case (a handful of invoices with small payloads) it is well within bounds and keeps the persistence layer trivially simple. IndexedDB would be the right choice if invoices grew large or if PDF attachments were stored.

**CSS custom properties over Tailwind's `dark:` variant** — Using `data-theme` with CSS variables gives finer control (the draft badge uses RGBA variables that are hard to express with utility classes) and makes it easy to add a third theme in future. The cost is that the variables must be manually kept in sync with Tailwind values.

**`InvoiceForm` as a shared component** — Create and edit share one form component with a `mode` prop. This avoids duplicated markup but means both modes re-render together whenever the shared component changes. A stricter split would keep the files smaller at the cost of duplication.

**Seed versioning with `invoices_v` key** — Rather than a migration system, a single version string in localStorage triggers a full re-seed when the mock data schema changes. This is appropriate for a demo app but would be destructive in a real product.

---

## Accessibility

- **Semantic HTML** — `<nav>` for navigation, `<address>` for postal addresses, `<label>` elements wrapping custom checkboxes in the filter dropdown.
- **`aria-label`** on the theme toggle button (icon-only button with no visible text).
- **`alt` text** on all images — logo, avatar, and the empty-state illustration.
- **Keyboard navigation** — all interactive elements are native `<button>` or `<label>` elements and are focusable by default.
- **Focus-visible styles** — Tailwind's default `:focus-visible` ring is preserved; no `outline: none` without a replacement.
- **Color contrast** — muted text (`--color-muted`) is `#888EB0` on white / dark-card backgrounds. Status badge colours (green, orange, draft-grey) use distinct hues rather than relying on colour alone.
- **`not-italic` on `<address>`** — browsers italicise `<address>` by default; this resets it to match the design without abandoning the semantic element.

---

## Improvements Beyond Requirements

- **Persistent theme preference** — the chosen theme survives a page refresh via localStorage.
- **Seed version guard** — bumping `SEED_VERSION` in `InvoiceContext.jsx` automatically re-seeds stale localStorage data without a manual browser clear.
- **Email validation** — the form validates client email with a regex pattern and shows an inline error, rather than relying solely on the browser's `type="email"` hint.
- **Click-outside to close** — the filter dropdown listens for `mousedown` events on `document` and closes when the user clicks anywhere outside it.
- **Empty-state differentiation** — the list distinguishes between "no invoices at all" and "no invoices match the current filter", showing different messages for each case.
- **Sticky action footer on mobile** — on small screens the Edit / Delete / Mark as Paid buttons move to a fixed footer bar so they remain reachable without scrolling back to the top.
- **`overflow-hidden` card clipping** — the items card uses `rounded-lg overflow-hidden` on the outer wrapper so the inner gray and dark sections are cleanly clipped to the card's border radius without needing extra `rounded-*` classes on each child.
- **Auto-computed item totals** — quantity x price is recalculated live as the user types in the invoice form.
