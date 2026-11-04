import type { TrustedBrand } from '#/features/trusted/visible'

/**
 * Brands, organizers and sponsors Event OS has worked with. Add real ones here;
 * the "Trusted by" section on the landing page shows them and stays hidden
 * while this list is empty. Only list partners who have agreed to be shown.
 *
 * Put logos in `public/logos/` and refer to them as "/logos/acme.svg" (or use
 * an https URL). Dark-on-transparent logos are fine: each sits on a white tile.
 *
 *   { name: 'Acme Live', logo: '/logos/acme-live.svg', href: 'https://acme.example', kind: 'organizer' },
 */
export const TRUSTED_BRANDS: Array<TrustedBrand> = []
