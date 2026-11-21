import { CtaBand } from '@/components/blocks'
import { HomeGallery } from '@/components/home/home-gallery'
import { HomeHero } from '@/components/home/home-hero'
import { HomeIndustries } from '@/components/home/home-industries'
import { HomeJourney } from '@/components/home/home-journey'
import { HomeServices } from '@/components/home/home-services'
import { HomeWhy } from '@/components/home/home-why'

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeServices />
      <HomeWhy />
      <HomeGallery />
      <HomeIndustries />
      <HomeJourney />
      <CtaBand />
    </>
  )
}
