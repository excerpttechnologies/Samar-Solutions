export const site = {
  name: 'SAMAR SOLUTIONS INDIA PVT. LTD.',
  shortName: 'SAMAR Solutions',
  legalName: 'SAMAR SOLUTIONS INDIA PVT. LTD.',
  established: 2013,
  partnership: 'Authorized Channel Partner of TATA Power Renewable Energy Ltd.',
  /**
   * Contact details have not been supplied. Fill these in before launch;
   * any value left as null renders as a clearly labelled placeholder.
   */
  contact: {
    phone: null as string | null,
    email: null as string | null,
    address: null as string | null,
    hours: null as string | null,
  },
}

export const mainNav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/solar-solutions', label: 'Solar Rooftop' },
  { href: '/ev-charging-solutions', label: 'EV Charging' },
  { href: '/epc-services', label: 'EPC Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact Us' },
] as const

export const serviceNav = [
  { href: '/solar-solutions', label: 'Solar Rooftop Solutions' },
  { href: '/ev-charging-solutions', label: 'EV Charging Infrastructure' },
  { href: '/epc-services', label: 'EPC Services' },
] as const

export const solarAudiences = [
  'Residential communities',
  'Commercial buildings',
  'Manufacturing industries',
  'Warehouses and logistics parks',
  'Educational institutions',
  'Hospitals and healthcare facilities',
  'Government organizations',
  'Real-estate developers',
  'Corporate offices',
  'Fleet and mobility operators',
]

export const evAudiences = [
  'Residential communities',
  'Commercial complexes',
  'Fleet operators',
  'Corporate offices',
  'Public charging stations',
  'Fuel stations',
]

export const solarScope = [
  {
    title: 'Site survey and feasibility analysis',
    body: 'An on-site review of your roof, structure, shading, and electrical setup to understand what a solar system can realistically achieve.',
  },
  {
    title: 'System design and engineering',
    body: 'A system layout and electrical design matched to your site, energy use, and applicable technical requirements.',
  },
  {
    title: 'Supply of quality components',
    body: 'Sourcing of modules, inverters, mounting structures, and balance-of-system components from industry-approved products.',
  },
  {
    title: 'Installation and commissioning',
    body: 'Planned, supervised installation followed by testing and commissioning before the system is handed over.',
  },
  {
    title: 'Net-metering assistance',
    body: 'Support with the documentation and process involved in applying for net-metering with your electricity distribution company.',
  },
  {
    title: 'Operations and maintenance',
    body: 'Ongoing maintenance support to help keep your system performing as designed over its working life.',
  },
]

export const evScope = [
  {
    title: 'AC EV chargers',
    body: 'Alternating-current chargers suited to locations where vehicles are parked for longer periods, such as homes, offices, and residential communities.',
  },
  {
    title: 'DC fast chargers',
    body: 'Direct-current chargers for locations where shorter charging stops matter, such as fleet depots, commercial sites, and public stations.',
  },
  {
    title: 'Site assessment',
    body: 'A review of the location, parking layout, available electrical capacity, and expected usage before recommending a solution.',
  },
  {
    title: 'Electrical infrastructure development',
    body: 'Planning and execution of the electrical work needed to support chargers safely, from supply to cabling and protection.',
  },
  {
    title: 'Installation and commissioning',
    body: 'Installation of the charging equipment, followed by testing and commissioning before it is put into use.',
  },
  {
    title: 'Annual maintenance services',
    body: 'Scheduled maintenance support to help keep charging infrastructure available and in good working order.',
  },
]

export const epcScope = [
  {
    title: 'Engineering design',
    body: 'Technical design and documentation that define how the project will be built.',
  },
  {
    title: 'Procurement management',
    body: 'Selection, sourcing, and coordination of equipment and materials for the project.',
  },
  {
    title: 'Project execution',
    body: 'On-site construction and installation, coordinated and supervised by the project team.',
  },
  {
    title: 'Testing and commissioning',
    body: 'Verification that systems are installed correctly and operate as designed before handover.',
  },
  {
    title: 'Project monitoring',
    body: 'Tracking of progress, quality, and safety throughout the project lifecycle.',
  },
  {
    title: 'Maintenance and technical support',
    body: 'After-handover support to help keep installed systems running reliably.',
  },
]

export const projectJourney = [
  {
    step: '01',
    title: 'Assess',
    body: 'We understand your site, energy or charging needs, and project goals through a site assessment.',
  },
  {
    step: '02',
    title: 'Design',
    body: 'Our team engineers a solution suited to your site conditions and requirements.',
  },
  {
    step: '03',
    title: 'Procure',
    body: 'We source quality, industry-approved components and coordinate delivery.',
  },
  {
    step: '04',
    title: 'Install & commission',
    body: 'We install, test, and commission the system before handing it over.',
  },
  {
    step: '05',
    title: 'Maintain',
    body: 'We provide maintenance and technical support after the project is complete.',
  },
]

export const differentiators = [
  {
    title: 'Authorized TATA Power Renewable Energy partner',
    body: 'SAMAR SOLUTIONS INDIA PVT. LTD. is an Authorized Channel Partner of TATA Power Renewable Energy Ltd.',
  },
  {
    title: 'More than a decade of experience',
    body: 'Established in 2013, SAMAR has worked in renewable energy and sustainable infrastructure for over ten years.',
  },
  {
    title: 'End-to-end support',
    body: 'One partner from concept and design through procurement, installation, and after-sales support.',
  },
  {
    title: 'Quality and reliability',
    body: 'Industry-approved products, engineering best practices, and quality controls throughout each project.',
  },
  {
    title: 'Customer-centric solutions',
    body: 'Solutions designed around your performance, savings, and return-on-investment priorities.',
  },
]

export const interestOptions = [
  'Solar rooftop solutions',
  'EV charging infrastructure',
  'EPC services',
  'Operations & maintenance',
  'Other / not sure yet',
]
