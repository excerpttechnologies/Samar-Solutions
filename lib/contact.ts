/**
 * Single source of truth for the company's phone numbers.
 * Primary is listed first everywhere; no phone number may be hard-coded in a
 * component — import CONTACT or phones from here instead.
 */
export const CONTACT = {
  primary: { display: '8197 241 705', tel: '+918197241705' },
  alternate: { display: '8105 250 250', tel: '+918105250250' },
} as const

/** Order matters: primary first, alternate second. */
export const phones = [
  { label: CONTACT.primary.display, href: `tel:${CONTACT.primary.tel}` },
  { label: CONTACT.alternate.display, href: `tel:${CONTACT.alternate.tel}` },
] as const
