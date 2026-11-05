# Animation plans

| # | Plan | Severity | Status |
|---|---|---|---|
| 001 | Preserve useful feedback in reduced-motion mode | MEDIUM | TODO |
| 002 | Respect reduced motion on checkout scroll | MEDIUM | TODO |
| 003 | Scope shared button transitions | LOW | TODO |

## Recommended execution order

1. **001** updates the site-wide reduced-motion policy and keeps the existing card motion overrides.
2. **002** applies the reduced-motion preference to checkout's programmatic scroll.
3. **003** narrows the shared button transition properties.

The plans are independent and can be executed in any order. Run the verification listed in each plan after implementation.
