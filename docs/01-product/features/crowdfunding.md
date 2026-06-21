# Crowdfunding Core

## URI Routes

| Route | Description |
| ----- | ----------- |
| `/` | Landing page — stats, featured campaigns, categories |
| `/campaigns` | Campaign listing with filter/sort/search |
| `/campaign/[slug]` | Campaign detail — story, updates, donate button |
| `/campaign/create` | Create new campaign form |
| `/campaign/manage/[slug]` | Manage campaign (edit, updates, see donations) |

## API Endpoints

All under `/api/public/funding/`:

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `/campaigns` | GET | List campaigns (paginated, filterable) |
| `/campaigns/[slug]` | GET | Single campaign detail |
| `/categories` | GET | Campaign categories |
| `/stats` | GET | Platform stats (total campaigns, raised, donors) |

## Components

- `CampaignCard.svelte` — Card in grid view (image, title, progress bar, days remaining)
- `CampaignGrid.svelte` — Responsive grid layout for campaign cards
- `CategoryPills.svelte` — Horizontal scrollable category chips
- `Hero.svelte` — Hero section on landing page
- `StatsSection.svelte` — Stats counter section
- `ProgressBar.svelte` — Reusable funding progress bar

## States

- **Loading:** Skeleton cards (`CampaignCardSkeleton`)
- **Empty:** "Belum ada campaign" message
- **Error:** Error state with retry
- **Edge cases:** 0 campaign results for category filter
