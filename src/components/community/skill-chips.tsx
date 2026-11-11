export function SkillChips({ skills }: { skills: Array<string> }) {
  if (!skills.length) return null
  return <ul aria-label="Skills" className="flex flex-wrap gap-2">{skills.map((skill) => <li key={skill} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{skill}</li>)}</ul>
}
