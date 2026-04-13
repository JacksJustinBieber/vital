# VitalWatch - AI Early Warning System for Physical Health Decline

## Project Overview
- **Project name**: VitalWatch
- **Type**: Health tracking web application
- **Core functionality**: Track routine health metrics, detect deviation patterns, provide actionable early warnings without crossing into medical diagnosis
- **Target users**: Health-conscious individuals who want proactive health monitoring between doctor visits

## UI/UX Specification

### Layout Structure
- **Header**: Logo, privacy badge, minimal navigation
- **Hero**: Value proposition, trust messaging, CTA to start
- **Dashboard**: Main tracking interface (post onboarding)
- **Insights Panel**: Pattern detection results and recommendations
- **Footer**: Privacy policy link, disclaimers

### Responsive Breakpoints
- Mobile: < 768px (single column)
- Tablet: 768px - 1024px (adaptive grid)
- Desktop: > 1024px (two-column dashboard)

### Visual Design

#### Color Palette
- **Primary**: #0F766E (teal-700) - trust, health, calm
- **Primary Light**: #14B8A6 (teal-500)
- **Secondary**: #1E293B (slate-800) - professional, serious
- **Background**: #F8FAFC (slate-50) - clean, clinical but warm
- **Card Background**: #FFFFFF
- **Text Primary**: #1E293B
- **Text Secondary**: #64748B
- **Success**: #10B981 (green-500)
- **Warning**: #F59E0B (amber-500)
- **Alert**: #EF4444 (red-500)
- **Border**: #E2E8F0

#### Typography
- **Headings**: "DM Sans", sans-serif (weight 600-700)
- **Body**: "DM Sans", sans-serif (weight 400-500)
- **Monospace** (for data): "JetBrains Mono", monospace

#### Spacing System
- Base unit: 4px
- Section padding: 64px vertical
- Card padding: 24px
- Element gaps: 16px

#### Visual Effects
- Card shadows: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)
- Hover transitions: 200ms ease
- Subtle gradient on hero: linear-gradient(135deg, #F8FAFC 0%, #E0F2F1 100%)
- Rounded corners: 12px for cards, 8px for buttons/inputs

### Components

#### 1. Privacy Badge
- Lock icon + "Your data never leaves your device"
- Prominent placement in header

#### 2. Metric Input Cards
- Sleep quality (1-10 slider)
- Energy level (1-10 slider)
- Sleep duration (hours)
- Water intake (glasses)
- Exercise (minutes)
- Mood (emoji scale)
- Vitals section (collapsible): Blood pressure, weight, heart rate

#### 3. Insight Cards
- Pattern type icon
- Title (e.g., "Sleep disruption + fatigue pattern detected")
- Description with specific observation
- Recommended action
- Confidence indicator (low/medium/high)
- "What to ask your doctor" suggestion

#### 4. Trend Charts
- 7-day mini sparklines
- 30-day detailed view
- Metric comparison overlays

#### 5. Warning/Alert System
- Toast notifications for significant changes
- Color-coded severity
- Dismissible with "remind later"

## Functionality Specification

### Core Features

#### 1. Daily Health Logging
- Quick 2-minute daily check-in
- Default values for convenience
- Edit capability for past days
- Visual confirmation of logged data

#### 2. Pattern Detection Engine (Rule-Based AI)
Monitors for:
- **Thyroid-like pattern**: Fatigue + sleep disruption + temperature sensitivity
- **Metabolic decline**: Rising weight + decreasing energy + poor sleep
- **Blood pressure trend**: Consistently elevated readings
- **Sleep deprivation cascade**: <6h sleep + low energy + mood decline
- **Hydration impact**: Low water + headaches + fatigue correlation
- **Exercise sensitivity**: Post-exercise fatigue that doesn't recover

#### 3. Insight Generation
- Triggers after 7+ days of data
- Requires pattern to persist 14+ days
- Confidence based on data consistency
- Natural language explanations

#### 4. Data Privacy
- All data stored in localStorage (browser)
- No server communication
- Clear data export/delete functionality
- No accounts required

### User Flow
1. Landing page → Trust messaging
2. Quick onboarding (1 question) → age range
3. Daily dashboard → Log today's metrics
4. View insights → See patterns detected
5. Trend view → Historical data visualization

### Edge Cases
- First-time user: Show sample data explanation, require 7 days before insights
- Missing days: Interpolate, don't penalize
- Incomplete entries: Allow partial saves
- Conflicting patterns: Prioritize by severity

## Acceptance Criteria

### Visual Checkpoints
- [ ] Clean, clinical aesthetic that feels trustworthy
- [ ] Mobile-responsive layout works on all breakpoints
- [ ] All interactive elements have hover/focus states
- [ ] Loading states for async operations
- [ ] Empty states with helpful guidance

### Functional Checkpoints
- [ ] Can log daily metrics successfully
- [ ] Data persists across browser sessions
- [ ] Insights appear after sufficient data
- [ ] Charts display historical trends
- [ ] Can delete all data with one click
- [ ] Works offline after initial load
