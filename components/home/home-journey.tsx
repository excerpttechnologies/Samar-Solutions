import { JourneySteps } from '@/components/blocks'
import { CtaLink } from '@/components/cta-link'
import { Section, SectionHeading } from '@/components/section'

export function HomeJourney() {
  return (
    <Section labelledBy="journey-title" className="overflow-hidden">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          id="journey-title"
          eyebrow="Project Execution Journey"
          title="A clear, accountable process from assessment to maintenance"
          intro="Every project follows a structured lifecycle so you know what happens next, who is responsible, and how delivery progresses."
        />
        <CtaLink href="/epc-services" variant="outline" arrow className="self-start md:self-auto">
          Our EPC Approach
        </CtaLink>
      </div>
      <div className="mt-14 rounded-[2rem] border border-border/70 bg-card/60 p-6 md:p-10">
        <JourneySteps />
      </div>
    </Section>
  )
}
