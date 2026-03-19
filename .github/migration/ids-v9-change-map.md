# IDS v7 → v9 Migration

## package.json bumps

- `apps/rehabstod/package.json` — `^7.0.0` → `^9.0.0` (ids-react + ids-design)
- `packages/components/package.json` — `^7.0.0` → `^9.0.0` (ids-react +
  ids-design)
- `packages/theme-1177/package.json` — `^7.0.0` → `^9.0.0` (ids-react +
  ids-design)

---

## Code changes

### packages/components/src/Button/Button.tsx

**v9 — `IDSSpinner` `light` prop removed; replaced by `variant`**

```diff
- {loading ? <IDSSpinner light /> : children}
+ {loading ? <IDSSpinner variant="v3" /> : children}
```

`variant="v3"` is the equivalent of the old `light` (spinner inside a primary
button).

---

### packages/components/src/GlobalAlert/GlobalAlert.tsx

**v8 — IDS icon components removed entirely** (`IDSIconInformation`,
`IDSIconAttention`, `IDSIconWarning`)

```diff
- import { IDSAlertGlobal, IDSIconAttention, IDSIconInformation, IDSIconWarning } from '@inera/ids-react'
+ import { IDSAlertGlobal } from '@inera/ids-react'
+ import { Icon } from '../Icon/Icon'
...
- {priority === PriorityEnum.INFO && <IDSIconInformation data-testid="LOW_ICON" />}
- {priority === PriorityEnum.OBSERVE && <IDSIconAttention data-testid="MEDIUM_ICON" />}
- {priority === PriorityEnum.ERROR && <IDSIconWarning data-testid="HIGH_ICON" />}
+ {priority === PriorityEnum.INFO && <Icon icon="information" data-testid="LOW_ICON" />}
+ {priority === PriorityEnum.OBSERVE && <Icon icon="attention" data-testid="MEDIUM_ICON" />}
+ {priority === PriorityEnum.ERROR && <Icon icon="warning" data-testid="HIGH_ICON" />}
```

---

### packages/components/src/AppLink/AppLink.tsx

**v8 — `large` and `nounderline`/`noUnderline` variants removed from `IDSLink`**

```diff
- large?: boolean
...
- noUnderline={underlined != null ? !underlined : undefined}
- large={large}
```

Also remove the `large` prop from the `IDSLink` call (keep it in the type if
downstream code still passes it, but stop forwarding to IDSLink).

---

### packages/components/src/header/HeaderAvatarLink.tsx

**v8 — depends on AppLink `large` removal above**

```diff
- <AppLink to={to} block colorPreset={2} large>
+ <AppLink to={to} block colorPreset={2}>
```

---

### apps/rehabstod/src/components/SickLeave/MinimizedSickLeaveDegreeInfo.tsx

**v8 — `IDSIconArrow` removed**

```diff
- import { IDSIconArrow } from '@inera/ids-react'
+ import { Icon } from '@frontend/components'
...
- <IDSIconArrow size="xs" className="my-auto" color="currentColor" color2="currentColor" />
+ <Icon icon="arrow-right-small" className="my-auto" />
```

---

### apps/rehabstod/src/components/SickLeave/SickLeaveDegreeInfo.tsx

**v8 — `IDSIconArrow` removed**

```diff
- import { IDSIconArrow } from '@inera/ids-react'
  import { classNames } from '@frontend/components'
+ import { classNames, Icon } from '@frontend/components'
...
- <IDSIconArrow size="xs" className="my-auto" color="currentColor" color2="currentColor" />
+ <Icon icon="arrow-right-small" className="my-auto" />
```

---

### apps/rehabstod/src/components/Table/TableFilter.tsx

**v8 — `IDSIconChevron` removed**

```diff
- import { IDSIconChevron } from '@inera/ids-react'
  import { Button, Heading } from '@frontend/components'
+ import { Button, Heading, Icon } from '@frontend/components'
...
- <IDSIconChevron rotate={expanded ? '270' : '90'} width="0.75rem" height="0.75rem" color="currentColor" inline />
+ <Icon icon={expanded ? 'chevron-up' : 'chevron-down'} />
```

---

### apps/rehabstod/src/pages/Patient/components/PatientHeader/PatientHeaderInfo.tsx

**v8 — `IDSIconUser`, `IDSIconInformation` removed**

```diff
- import { IDSIconInformation, IDSIconUser } from '@inera/ids-react'
+ import { Icon } from '@frontend/components'
...
- <IDSIconUser width="100%" height="100%" inline className="float-left mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
+ <Icon icon="user" className="float-left mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
...
- <IDSIconInformation width="100%" height="100%" className="ml-1 h-4 w-4 sm:ml-2 sm:h-5 sm:w-5" />
+ <Icon icon="information" className="ml-1 h-4 w-4 sm:ml-2 sm:h-5 sm:w-5" />
```

---

### apps/rehabstod/src/components/Table/ModifyTableColumns/MoveColumnButton.tsx

**v8 — `IDSIconArrow` removed**

```diff
- import { IDSIconArrow } from '@inera/ids-react'
+ import { Icon } from '@frontend/components'
...
- {direction === 'left' && <IDSIconArrow className="m-auto inline-block" rotate="270" width="14" height="14" />}
- {direction === 'right' && <IDSIconArrow className="m-auto inline-block" rotate="90" width="14" height="14" />}
+ {direction === 'left' && <Icon icon="arrow-left" className="m-auto inline-block" />}
+ {direction === 'right' && <Icon icon="arrow-right" className="m-auto inline-block" />}
```

---

### apps/rehabstod/src/components/Table/tableHeader/SortingIcon.tsx

**v9 — `ids-data-table` sorting icon margin must use `ids-ml-2` utility class,
not inline `marginLeft`**

```diff
- const iconStyle = {
-   marginLeft: '.5rem',
-   marginBottom: '-0.125rem',
-   color: 'var(--IDS-ICON__COLOR)',
- }
+ const iconStyle = { marginBottom: '-0.125rem', color: 'var(--IDS-ICON__COLOR)' }
...
- <span style={iconStyle} className="ids-icon-swap-vertical-small ids-data-table__icon" />
- <span style={iconStyle} className="ids-icon-arrow-up-small ids-data-table__icon" />
- <span style={iconStyle} className="ids-icon-arrow-down-small ids-data-table__icon" />
+ <span style={iconStyle} className="ids-icon-swap-vertical-small ids-data-table__icon ids-ml-2" />
+ <span style={iconStyle} className="ids-icon-arrow-up-small ids-data-table__icon ids-ml-2" />
+ <span style={iconStyle} className="ids-icon-arrow-down-small ids-data-table__icon ids-ml-2" />
```

---

### apps/rehabstod/src/index.css

**v9 — `ids-data-table` class must be placed directly on `<table>`, not on a
wrapper div**

Lines 46–51 scope custom table styles as `.ids-data-table.ids-table-sticky ...`
and `.ids-data-table tr td`.
The `Table.tsx` component does **not** currently apply `ids-data-table` to its
`<table>` element.

Two-step fix:

1. Add `ids-data-table` to the `<table>` className in `Table.tsx` (see below).
2. CSS selectors in `index.css` will then match correctly with no changes needed
   there.

#### apps/rehabstod/src/components/Table/Table.tsx

```diff
  <table
    className={classNames(
-     'table-fixed m-0 w-full overflow-visible whitespace-nowrap border-none text-sm'
+     'ids-data-table table-fixed m-0 w-full overflow-visible whitespace-nowrap border-none text-sm'
    )}
  >
```

---

### packages/theme-1177/src/LayoutFooter/LayoutFooter.tsx

**v8 — Main footer links must have `footer` link variant for correct styling**

1. Add `footer?: boolean` to `AppLink` props and pass `footer` to `IDSLink`.
2. In `LayoutFooter`, add `footer` to all `col1[]` and `col2[]` `<AppLink>`
   items.
3. The `mobileLinks` content moves to the `sub-footer-mobile-links` slot —
   switch from the `mobileLinks` prop to `<slot name="sub-footer-mobile-links">`
   pattern if IDSFooter1177 requires it in v9.

---

## Manual Review Required

| Item                                                         | File                                                    | Reason                                                                                                                                                     |
|--------------------------------------------------------------|---------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `IDSFooter1177` props `col1`, `col2`, `col1Size`, `col2Size` | `packages/theme-1177/src/LayoutFooter/LayoutFooter.tsx` | Old v7 API used `linkcol1/2/3` (removed v8). Confirm whether `col1`/`col2` are already the v8-style API. TypeScript will flag this after the version bump. |
| `IDSCard` `border` prop                                      | `FakeLogin.tsx`, `PatientOverviewCard.tsx`              | v8 changed `border` to boolean-only. Neither file passes `border` so likely safe — confirm TypeScript after bump.                                          |
| `IDSHeader1177Admin` `brandText` prop                        | `apps/rehabstod/src/pages/Welcome/Welcome.tsx`          | Confirm this attribute is still valid in v9 (was not listed as removed).                                                                                   |
| CSS tokens `--IDS-DATA-TABLE__*`                             | `TableHeaderCell.tsx`, `TableCell.tsx`                  | v8 removed base color tokens. Component-scoped tokens like these should survive — verify after bump.                                                       |
| `IDSAccordion`                                               | `AboutPatientOverview.tsx`                              | Not flagged as changed in release notes, but verify it hasn't been renamed to a web component (`ids-wc-accordion`) in v9.                                  |

---

Run the IDS release apply skill to apply these changes.
