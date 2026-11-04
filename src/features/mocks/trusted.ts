import type { TrustedBrand } from '#/features/trusted/visible'
import osu_nights_live from './logos/osu-nights-live.svg?url'
import adinkra_records from './logos/adinkra-records.svg?url'
import kente_lager from './logos/kente-lager.svg?url'
import black_star_sounds from './logos/black-star-sounds.svg?url'
import volta_spirits from './logos/volta-spirits.svg?url'
import labadi_social_club from './logos/labadi-social-club.svg?url'
import cedi_pay from './logos/cedi-pay.svg?url'
import harmattan_sessions from './logos/harmattan-sessions.svg?url'

/**
 * Invented, dev only. Fictional names with Ghanaian flavour and drawn
 * placeholder logos; none refers to a real business.
 */
export const MOCK_TRUSTED: Array<TrustedBrand> = [
  { name: 'Osu Nights Live', logo: osu_nights_live, kind: 'organizer' },
  { name: 'Adinkra Records', logo: adinkra_records, kind: 'brand' },
  { name: 'Kente Lager', logo: kente_lager, kind: 'brand' },
  { name: 'Black Star Sounds', logo: black_star_sounds, kind: 'organizer' },
  { name: 'Volta Spirits', logo: volta_spirits, kind: 'brand' },
  { name: 'Labadi Social Club', logo: labadi_social_club, kind: 'organizer' },
  { name: 'Cedi Pay', logo: cedi_pay, kind: 'sponsor' },
  { name: 'Harmattan Sessions', logo: harmattan_sessions, kind: 'organizer' },
]
