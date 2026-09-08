import profilePhoto from '../assets/profile.jpg'
import instagramQr from '../assets/instagram-qr.png'

export const PROFILE = {
  name: 'JM Shakya',
  photo: profilePhoto,
  title: 'Computer Science Student & Full-Stack Developer',
  location: 'Bagbazar, Kathmandu, Nepal',
  postalCode: '44600',
  education: {
    current: 'Currently pursuing Bachelor\u2019s Degree in CS',
    completed: 'Completed +2 in Computer Science',
  },
  contact: {
    phone: '+977 9740845743',
    phoneRaw: '9779740845743',
    email: 'jmshakya121@gmail.com',
  },
  domain: 'jmshakya.com.np',
  social: {
    youtube: 'https://www.youtube.com/@J_EMS_SH',
    instagram: 'https://www.instagram.com/__j_e_m_s___/',
    facebook: 'https://www.facebook.com/jm.shakya.9',
  },
}

export const PROJECTS = {
  spotlight: {
    name: 'Service Desk Pro',
    tagline: 'Enterprise-Ready Ticketing System',
    description:
      'A comprehensive, enterprise-ready ticketing system designed to streamline IT support, issue tracking, and ticket management for businesses.',
    features: [
      'Live Dashboard',
      'Analytics',
      'Role-based Access',
      'Ticket Automation',
    ],
    stats: [
      { label: 'Tickets Handled', value: '10K+' },
      { label: 'Avg Resolution', value: '< 4h' },
      { label: 'SLA Compliance', value: '98%' },
    ],
    liveUrl: 'https://servicedesk.printronixsolution.com.np',
  },
}

export const SOFTWARE_ITEMS = [
  {
    id: 'windows-activator',
    name: 'Windows Activator',
    description:
      'A one-click activation utility script (.cmd) for Windows operating systems. Streamlines activation of supported Windows editions without manual commands.',
    category: 'Utilities',
    version: '1.0.0',
    size: '745 KB',
    date: '2026-08-12',
    type: '.cmd',
    lang: 'Batch Script',
    securityNote:
      'Review script source before running. Use at your own risk. Only run on systems you own.',
    downloadUrl: `${import.meta.env.BASE_URL}software/windows-activate.cmd`,
    downloadName: 'WindowsActivite.cmd',
    downloads: '2,341',
    badge: 'Popular',
  },
  {
    id: 'office-activator',
    name: 'Office Activator',
    description:
      'A one-click activation utility script (.cmd) for Microsoft Office products. Activates supported Office editions with a single double-click.',
    category: 'Utilities',
    version: '1.0.0',
    size: '745 KB',
    date: '2026-08-12',
    type: '.cmd',
    lang: 'Batch Script',
    securityNote:
      'Review script source before running. Use at your own risk. Only run on systems you own.',
    downloadUrl: `${import.meta.env.BASE_URL}software/office-activate.cmd`,
    downloadName: 'OfficeActivite.cmd',
    downloads: '1,876',
    badge: 'New',
  },
  {
    id: 'system-cleaner',
    name: 'System Cleaner & Optimizer',
    description:
      'Batch utility to clear temp files, caches, and optimize Windows performance with a single double-click.',
    category: 'System Tools',
    version: '2.4.1',
    size: '18 KB',
    date: '2026-07-30',
    type: '.bat',
    lang: 'Batch Script',
    securityNote: 'Safe to run; no registry modifications.',
    downloads: '1,891',
    badge: null,
  },
  {
    id: 'net-speed-check',
    name: 'Network Speed & Ping Checker',
    description:
      'Quick diagnostics tool that tests ping, latency, and network stability against multiple endpoints.',
    category: 'Networking',
    version: '1.2.0',
    size: '8 KB',
    date: '2026-06-18',
    type: '.bat',
    lang: 'Batch Script',
    securityNote: 'Read-only; does not send any data externally.',
    downloads: '987',
    badge: null,
  },
  {
    id: 'backup-script',
    name: 'Folder Backup Automation',
    description:
      'Automated incremental backup script that syncs specified folders to a destination with logging.',
    category: 'Automation',
    version: '3.0.0',
    size: '15 KB',
    date: '2026-05-22',
    type: '.bat',
    lang: 'Batch Script',
    securityNote: 'Requires admin rights to schedule tasks.',
    downloads: '654',
    badge: 'New',
  },
]

export const SKILLS = [
  'React', 'Three.js', 'Node.js', 'Tailwind CSS', 'JavaScript',
  'Python', 'MongoDB', 'Express', 'Git', 'Docker', 'REST APIs',
  'GraphQL', 'Firebase', 'TypeScript', 'Next.js',
]

export const MEDIA = {
  youtube: {
    handle: '@J_EMS_SH',
    subscribers: '12K+',
    videos: '85+',
  },
  instagram: {
    handle: '__j_e_m_s___',
    followers: '4.5K',
    qr: instagramQr,
  },
  facebook: {
    handle: 'jm.shakya.9',
  },
}

export const EMAIL_LINK = `mailto:${PROFILE.contact.email}?subject=Hello%20JM%20Shakya`
export const WHATSAPP_LINK = `https://wa.me/${PROFILE.contact.phoneRaw}`
