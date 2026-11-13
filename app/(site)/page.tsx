import { CtaBand } from '@/components/blocks'
import { HomeEvShowcase } from '@/components/home/home-ev-showcase'
import { HomeHero } from '@/components/home/home-hero'
import { HomeIndustries } from '@/components/home/home-industries'
import { HomeIntro } from '@/components/home/home-intro'
import { HomeJourney } from '@/components/home/home-journey'
import { HomeProjects } from '@/components/home/home-projects'
import { HomeServices } from '@/components/home/home-services'
import { HomeSolarShowcase } from '@/components/home/home-solar-showcase'
import { HomeTrust } from '@/components/home/home-trust'
import { HomeWhy } from '@/components/home/home-why'

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeTrust />
      <HomeIntro />
      <HomeServices />
      <HomeSolarShowcase />
      <HomeEvShowcase />
      <HomeWhy />
      <HomeProjects />
      <HomeIndustries />
      <HomeJourney />
      <CtaBand />
    </>
  )
}
