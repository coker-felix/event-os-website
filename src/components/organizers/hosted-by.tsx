import { Link } from '@tanstack/react-router'
import { isOrganizerId } from '#/features/discovery/ids'

/** "Hosted by X", linked to the profile when the id can be one. */
export function HostedBy({ id, name }: { id?: string; name: string }) {
  return (
    <p className="text-sm text-mist">
      Hosted by{' '}
      {id && isOrganizerId(id) ? (
        <Link
          to="/organizers/$organizerId"
          params={{ organizerId: id }}
          className="font-semibold text-foreground underline underline-offset-2"
        >
          {name}
        </Link>
      ) : (
        <span className="font-semibold text-foreground">{name}</span>
      )}
    </p>
  )
}
