import type { FareRule } from '@/fares'

interface SourceNoteProps {
  rule: FareRule
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

export function SourceNote({ rule }: SourceNoteProps) {
  const { source } = rule
  return (
    <p className="text-xs leading-relaxed text-muted-foreground">
      Rates for {rule.region} from the {source.authority} notification of{' '}
      {formatDate(source.notifiedOn)}, last checked{' '}
      {formatDate(source.verifiedOn)}.{' '}
      <a
        href={source.url}
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-2 hover:text-foreground"
      >
        Source
      </a>
    </p>
  )
}
