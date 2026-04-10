import { avitoProfileUrl } from '../data/siteContent';
import { buildMailtoHref, buildPhoneHref } from './formatters';
import type { SocialLink } from './types';

const phoneRaw = '+79263919225';
const emailRaw = 'Glad_2015@bk.ru';

const socialLinks = [
  {
    id: 'telegram',
    label: 'Telegram',
    href: 'https://t.me/+79263919225',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: 'https://wa.me/79263919225',
  },
  {
    id: 'avito',
    label: 'Avito',
    href: avitoProfileUrl,
  },
] as const satisfies readonly SocialLink[];

export const contacts = {
  phone: {
    raw: phoneRaw,
    display: phoneRaw,
    href: buildPhoneHref(phoneRaw),
  },
  email: {
    raw: emailRaw,
    display: emailRaw,
    href: buildMailtoHref(emailRaw),
  },
  socialLinks,
} as const;
