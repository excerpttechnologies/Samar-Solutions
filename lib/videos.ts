export type GalleryVideo = {
  id: string
  title: string
  caption: string
  src: string
  poster: string
  width: number
  height: number
  orientation: 'portrait' | 'landscape'
}

/**
 * Site videos supplied by the company. Both are vertical (portrait) clips, so
 * the player is width-constrained rather than stretched to 16:9.
 */
export const galleryVideos: GalleryVideo[] = [
  {
    id: 'solar-water-pump',
    title: 'Solar-Powered Water Pump — Samar Solutions',
    caption:
      'A solar-powered agricultural water pump installed by Samar Solutions, demonstrated on site.',
    src: '/videos/solar-water-pump.mp4',
    poster: '/videos/posters/solar-water-pump.webp',
    width: 1080,
    height: 1920,
    orientation: 'portrait',
  },
  {
    id: 'rooftop-site-footage',
    title: 'Rooftop Solar Installation — Site Footage',
    caption:
      'Field footage of a completed rooftop solar array, filmed on site by the Samar Solutions team.',
    src: '/videos/rooftop-site-footage.mp4',
    poster: '/videos/posters/rooftop-site-footage.webp',
    width: 720,
    height: 1280,
    orientation: 'portrait',
  },
]
