export type GalleryCategorySlug =
  | 'rooftop-solar'
  | 'commercial-solar'
  | 'residential-solar'
  | 'structures-mounting'
  | 'pole-foundation'
  | 'solar-installations'

export type GalleryCategory = {
  slug: GalleryCategorySlug
  label: string
  description: string
}

export type GalleryPhoto = {
  id: number
  src: string
  thumbnail: string
  width: number
  height: number
  alt: string
  caption: string
  category: GalleryCategorySlug
}

export const galleryCategories: GalleryCategory[] = [
  {
    slug: 'rooftop-solar',
    label: 'Rooftop Solar Projects',
    description: 'Solar systems installed on residential, institutional, and commercial rooftops.'
  },
  {
    slug: 'commercial-solar',
    label: 'Commercial Solar Projects',
    description: 'Larger solar arrays for commercial, industrial, and institutional buildings.'
  },
  {
    slug: 'residential-solar',
    label: 'Residential Solar Installations',
    description: 'Rooftop solar installations for homes and residential terraces.'
  },
  {
    slug: 'structures-mounting',
    label: 'Solar Panel Structures & Mounting',
    description: 'Mounting frames, elevated structures, and rooftop support systems.'
  },
  {
    slug: 'pole-foundation',
    label: 'Pole Foundation & Grounding',
    description: 'Foundation, grounding, and site work supporting solar infrastructure.'
  },
  {
    slug: 'solar-installations',
    label: 'Solar Panel Installations',
    description: 'Close views of completed solar panel installations.'
  }
]

/**
 * Curated project photography supplied by the company. Images are stored as
 * optimized WebP assets in public/images/projects, with separate thumbnails
 * for the gallery grid and full-size files for the lightbox.
 */
export const galleryPhotos: GalleryPhoto[] = [
  {
    id: 1,
    src: '/images/projects/01-rooftop-solar-array-flat-roof.webp',
    thumbnail: '/images/projects/01-rooftop-solar-array-flat-roof-thumb.webp',
    width: 1448,
    height: 1086,
    alt: 'Rows of solar panels installed on a flat concrete rooftop in a residential neighbourhood.',
    caption: 'Rooftop solar array on a flat concrete roof',
    category: 'rooftop-solar'
  },
  {
    id: 2,
    src: '/images/projects/02-elevated-commercial-solar-array.webp',
    thumbnail: '/images/projects/02-elevated-commercial-solar-array-thumb.webp',
    width: 1671,
    height: 941,
    alt: 'A large solar panel array mounted on elevated concrete supports under a clear sky.',
    caption: 'Elevated commercial solar installation',
    category: 'commercial-solar'
  },
  {
    id: 3,
    src: '/images/projects/03-elevated-rooftop-solar-urban.webp',
    thumbnail: '/images/projects/03-elevated-rooftop-solar-urban-thumb.webp',
    width: 1672,
    height: 941,
    alt: 'An elevated rooftop solar array overlooking densely built urban buildings.',
    caption: 'Elevated rooftop solar in an urban neighbourhood',
    category: 'rooftop-solar'
  },
  {
    id: 4,
    src: '/images/projects/04-rooftop-solar-mounting-structure.webp',
    thumbnail: '/images/projects/04-rooftop-solar-mounting-structure-thumb.webp',
    width: 1448,
    height: 1086,
    alt: 'Galvanised steel mounting rails and a solar panel frame under installation on a rooftop.',
    caption: 'Galvanised rooftop mounting structure',
    category: 'structures-mounting'
  },
  {
    id: 5,
    src: '/images/projects/05-industrial-roof-solar-inspection.webp',
    thumbnail: '/images/projects/05-industrial-roof-solar-inspection-thumb.webp',
    width: 1059,
    height: 1486,
    alt: 'A technician walking beside a large solar array on a corrugated metal industrial roof.',
    caption: 'Solar installation inspection on an industrial roof',
    category: 'commercial-solar'
  },
  {
    id: 6,
    src: '/images/projects/06-metal-roof-solar-sunset.webp',
    thumbnail: '/images/projects/06-metal-roof-solar-sunset-thumb.webp',
    width: 1272,
    height: 1237,
    alt: 'Solar panels mounted on a blue metal roof at sunset, with palm trees in the background.',
    caption: 'Metal-roof solar array at sunset',
    category: 'commercial-solar'
  },
  {
    id: 7,
    src: '/images/projects/07-raised-rooftop-solar-residential.webp',
    thumbnail: '/images/projects/07-raised-rooftop-solar-residential-thumb.webp',
    width: 1086,
    height: 1448,
    alt: 'Rooftop solar panels on a raised metal structure above a residential terrace.',
    caption: 'Raised rooftop solar system for a residence',
    category: 'residential-solar'
  },
  {
    id: 8,
    src: '/images/projects/08-residential-rooftop-solar-water-tank.webp',
    thumbnail: '/images/projects/08-residential-rooftop-solar-water-tank-thumb.webp',
    width: 1448,
    height: 1086,
    alt: 'A residential rooftop solar array installed next to a water tank and rooftop ladder.',
    caption: 'Residential rooftop solar beside a water tank',
    category: 'residential-solar'
  },
  {
    id: 9,
    src: '/images/projects/09-elevated-solar-structure-residential.webp',
    thumbnail: '/images/projects/09-elevated-solar-structure-residential-thumb.webp',
    width: 1448,
    height: 1086,
    alt: 'An elevated solar panel structure supported by steel posts above a residential terrace.',
    caption: 'Elevated solar structure above a residential terrace',
    category: 'structures-mounting'
  },
  {
    id: 10,
    src: '/images/projects/10-long-commercial-rooftop-solar.webp',
    thumbnail: '/images/projects/10-long-commercial-rooftop-solar-thumb.webp',
    width: 1086,
    height: 1448,
    alt: 'A long row of solar panels covering a flat commercial rooftop with a parapet wall.',
    caption: 'Long-span solar array on a commercial rooftop',
    category: 'commercial-solar'
  },
  {
    id: 11,
    src: '/images/projects/11-large-flat-roof-solar-array.webp',
    thumbnail: '/images/projects/11-large-flat-roof-solar-array-thumb.webp',
    width: 1448,
    height: 1086,
    alt: 'Close view of a large solar panel installation covering a flat roof.',
    caption: 'Large flat-roof solar installation',
    category: 'solar-installations'
  },
  {
    id: 12,
    src: '/images/projects/12-red-tile-roof-solar-panels.webp',
    thumbnail: '/images/projects/12-red-tile-roof-solar-panels-thumb.webp',
    width: 1448,
    height: 1086,
    alt: 'Solar panels mounted above a red-tiled residential roof.',
    caption: 'Solar panels above a red-tiled residential roof',
    category: 'residential-solar'
  },
  {
    id: 13,
    src: '/images/projects/13-urban-terrace-solar-array.webp',
    thumbnail: '/images/projects/13-urban-terrace-solar-array-thumb.webp',
    width: 1086,
    height: 1448,
    alt: 'A rooftop solar array installed on a narrow urban terrace.',
    caption: 'Urban terrace solar installation',
    category: 'rooftop-solar'
  },
  {
    id: 14,
    src: '/images/projects/14-commercial-rooftop-solar-installation.webp',
    thumbnail: '/images/projects/14-commercial-rooftop-solar-installation-thumb.webp',
    width: 1448,
    height: 1086,
    alt: 'A large solar panel array covering a flat commercial rooftop, with trees in the background.',
    caption: 'Commercial rooftop solar array',
    category: 'commercial-solar'
  },
  {
    id: 15,
    src: '/images/projects/15-rooftop-solar-lightning-mast.webp',
    thumbnail: '/images/projects/15-rooftop-solar-lightning-mast-thumb.webp',
    width: 1086,
    height: 1448,
    alt: 'A rooftop solar array installed around a tall lightning-protection mast.',
    caption: 'Rooftop solar with lightning-protection mast',
    category: 'structures-mounting'
  },
  {
    id: 16,
    src: '/images/projects/16-residential-roof-solar-mast.webp',
    thumbnail: '/images/projects/16-residential-roof-solar-mast-thumb.webp',
    width: 1672,
    height: 941,
    alt: 'A solar panel array and tall protection mast on a residential rooftop.',
    caption: 'Residential rooftop solar and protection mast',
    category: 'rooftop-solar'
  },
  {
    id: 17,
    src: '/images/projects/17-white-building-rooftop-solar.webp',
    thumbnail: '/images/projects/17-white-building-rooftop-solar-thumb.webp',
    width: 1672,
    height: 941,
    alt: 'An elevated solar panel array on the rooftop of a white commercial building.',
    caption: 'Elevated solar array on a white commercial building',
    category: 'commercial-solar'
  },
  {
    id: 18,
    src: '/images/projects/18-rooftop-solar-solar-water-heater.webp',
    thumbnail: '/images/projects/18-rooftop-solar-solar-water-heater-thumb.webp',
    width: 1672,
    height: 941,
    alt: 'Rooftop solar panels and a solar water heater on a residential terrace.',
    caption: 'Rooftop solar with solar water heating',
    category: 'residential-solar'
  },
  {
    id: 19,
    src: '/images/projects/19-commercial-solar-service-walkway.webp',
    thumbnail: '/images/projects/19-commercial-solar-service-walkway-thumb.webp',
    width: 1448,
    height: 1086,
    alt: 'A large commercial rooftop solar array divided by a central service walkway.',
    caption: 'Commercial solar array with service walkway',
    category: 'commercial-solar'
  },
  {
    id: 20,
    src: '/images/projects/20-rooftop-solar-residential-view.webp',
    thumbnail: '/images/projects/20-rooftop-solar-residential-view-thumb.webp',
    width: 1672,
    height: 941,
    alt: 'Solar panels and a tall pole on a rooftop overlooking a residential area.',
    caption: 'Rooftop solar overlooking a residential area',
    category: 'rooftop-solar'
  },
  {
    id: 21,
    src: '/images/projects/21-blue-metal-roof-solar-red-building.webp',
    thumbnail: '/images/projects/21-blue-metal-roof-solar-red-building-thumb.webp',
    width: 1448,
    height: 1086,
    alt: 'Solar panels installed on a blue metal roof beside a red building.',
    caption: 'Solar panels on a blue metal roof',
    category: 'commercial-solar'
  },
  {
    id: 22,
    src: '/images/projects/22-sloped-metal-roof-solar-panels.webp',
    thumbnail: '/images/projects/22-sloped-metal-roof-solar-panels-thumb.webp',
    width: 1086,
    height: 1448,
    alt: 'Solar panels mounted along a sloping metal rooftop.',
    caption: 'Solar panels along a sloped metal roof',
    category: 'rooftop-solar'
  },
  {
    id: 23,
    src: '/images/projects/23-flat-roof-solar-cloudy-sky.webp',
    thumbnail: '/images/projects/23-flat-roof-solar-cloudy-sky-thumb.webp',
    width: 1086,
    height: 1448,
    alt: 'A solar panel installation on a flat rooftop beneath a cloudy sky.',
    caption: 'Flat-roof solar installation under a cloudy sky',
    category: 'solar-installations'
  },
  {
    id: 24,
    src: '/images/projects/24-metal-roof-solar-mounting-rails.webp',
    thumbnail: '/images/projects/24-metal-roof-solar-mounting-rails-thumb.webp',
    width: 1086,
    height: 1448,
    alt: 'Solar panel mounting rails fixed to a sloped metal roof.',
    caption: 'Solar mounting rails on a metal roof',
    category: 'structures-mounting'
  },
  {
    id: 25,
    src: '/images/projects/25-blue-corrugated-roof-solar-array.webp',
    thumbnail: '/images/projects/25-blue-corrugated-roof-solar-array-thumb.webp',
    width: 1448,
    height: 1086,
    alt: 'A solar array installed on a blue corrugated metal commercial roof.',
    caption: 'Solar array on a blue corrugated roof',
    category: 'commercial-solar'
  },
  {
    id: 26,
    src: '/images/projects/26-rooftop-solar-mast-dramatic-sky.webp',
    thumbnail: '/images/projects/26-rooftop-solar-mast-dramatic-sky-thumb.webp',
    width: 941,
    height: 1672,
    alt: 'A rooftop solar array with a tall mounting mast under a dramatic sky.',
    caption: 'Rooftop solar array and tall mast',
    category: 'structures-mounting'
  },
  {
    id: 27,
    src: '/images/projects/27-residential-roof-solar-railing.webp',
    thumbnail: '/images/projects/27-residential-roof-solar-railing-thumb.webp',
    width: 1086,
    height: 1448,
    alt: 'Rooftop solar panels behind a safety railing beside a palm tree.',
    caption: 'Residential rooftop solar behind a railing',
    category: 'residential-solar'
  },
  {
    id: 28,
    src: '/images/projects/28-pole-foundation-grounding-work.webp',
    thumbnail: '/images/projects/28-pole-foundation-grounding-work-thumb.webp',
    width: 1600,
    height: 900,
    alt: 'Concrete pole foundations and steel mounting posts prepared on a project site.',
    caption: 'Pole foundations and mounting posts',
    category: 'pole-foundation'
  },
  {
    id: 29,
    src: '/images/projects/29-elevated-solar-mounting-structure.webp',
    thumbnail: '/images/projects/29-elevated-solar-mounting-structure-thumb.webp',
    width: 1280,
    height: 520,
    alt: 'A wide view of an elevated solar panel mounting structure on a rooftop.',
    caption: 'Elevated solar mounting structure',
    category: 'structures-mounting'
  },
  {
    id: 30,
    src: '/images/projects/30-large-rooftop-solar-portrait.webp',
    thumbnail: '/images/projects/30-large-rooftop-solar-portrait-thumb.webp',
    width: 720,
    height: 1090,
    alt: 'A large solar panel array installed along a flat building roof.',
    caption: 'Large rooftop solar array',
    category: 'rooftop-solar'
  }
]

export function countPhotosByCategory(slug: GalleryCategorySlug): number {
  return galleryPhotos.filter((photo) => photo.category === slug).length
}

export function findPhotoIndex(id: number): number {
  return galleryPhotos.findIndex((photo) => photo.id === id)
}
