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
    linkedin: '', // TODO: add your LinkedIn profile URL
  },
  github: 'https://github.com/jmshakya121/My-Website',
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
    releaseUrl: `${import.meta.env.BASE_URL}software/windows-activate.cmd`,
    funnelUrl: null, // e.g. your CPAGrip / Linkvertise / Gumroad checkout link
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
    releaseUrl: `${import.meta.env.BASE_URL}software/office-activate.cmd`,
    funnelUrl: null,
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
    releaseUrl: `${PROFILE.github}/releases/tag/system-cleaner-v2.4.1`,
    funnelUrl: null,
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
    releaseUrl: `${PROFILE.github}/releases/tag/net-speed-check-v1.2.0`,
    funnelUrl: null,
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
    releaseUrl: `${PROFILE.github}/releases/tag/backup-automation-v3.0.0`,
    funnelUrl: null,
    downloads: '654',
    badge: 'New',
  },
  {
    id: 'portfolio-3d-template',
    name: 'React Portfolio Starter Kit',
    description:
      'Production-ready React + Three.js portfolio template with glassmorphism, neon FX, and responsive layout. Drop in your data and go live.',
    category: '3D Templates',
    version: '1.0.0',
    size: '~10 MB',
    date: '2026-09-01',
    type: '.zip',
    lang: 'React / Tailwind / R3F',
    securityNote: 'Open-source template — audit the source in the GitHub repo before deploying.',
    releaseUrl: `${PROFILE.github}/releases/tag/portfolio-starter-v1.0.0`,
    funnelUrl: null,
    downloads: '312',
    badge: 'Featured',
  },
  {
    id: 'shortcut-keys-infographic',
    name: '100 Computer Shortcut Keys Infographic',
    description:
      'Printable PDF cheat-sheet covering 100 essential keyboard shortcuts across Windows, browsers, and IDEs. Great for your desk or dev onboarding.',
    category: 'Resources',
    version: '1.0.0',
    size: '2 MB',
    date: '2026-09-03',
    type: '.pdf',
    lang: 'PDF / Infographic',
    securityNote: 'Free to share — keep my author credit intact.',
    releaseUrl: `${PROFILE.github}/releases/tag/shortcut-keys-v1.0.0`,
    funnelUrl: null,
    downloads: '540',
    badge: 'New',
  },
  {
    id: 'three-canvas-snippets',
    name: '3D Canvas Snippets',
    description:
      'Copy-paste collection of React Three Fiber building blocks: particle fields, neon shapes, camera rigs, and glow materials.',
    category: 'Resources',
    version: '0.8.0',
    size: '~1 MB',
    date: '2026-08-30',
    type: '.zip',
    lang: 'R3F / GLSL / JS',
    securityNote: 'MIT-licensed snippets — use freely in your own projects.',
    releaseUrl: `${PROFILE.github}/releases/tag/three-canvas-snippets-v0.8.0`,
    funnelUrl: null,
    downloads: '208',
    badge: null,
  },
]

/* Hire / client intake configuration */
export const HIRE = {
  endpoint: 'https://api.web3forms.com/submit',
  accessKey: '24cb19db-a758-4f42-a848-d241edafb57d',
  subjectPrefix: 'New Project Request',
  budgetOptions: ['$100 - $500', '$500 - $1,500', '$1,500+'],
  projectTypes: ['Web App', '3D / Interactive', 'UI/UX Design', 'Utility Script'],
  trust: [
    { label: 'Fast Turnaround', detail: 'First draft in 2–3 days' },
    { label: '100% Satisfaction', detail: 'Unlimited fixes until you love it' },
    { label: 'Clean, Modern Code', detail: 'Maintainable & documented' },
  ],
}

/* Affiliate / "Tools I Use" links — replace "#" with your real affiliate URLs */
export const TOOLS = [
  { title: 'Hostinger', tag: 'Web Hosting', icon: 'Globe', description: 'Budget-friendly hosting with a free domain — every project I deploy runs great here.', affiliateUrl: '#' },
  { title: 'Vercel', tag: 'Deploy', icon: 'Zap', description: 'Zero-config deploys for React/Next.js apps with instant CDN.', affiliateUrl: '#' },
  { title: 'GitHub', tag: 'Code Hosting', icon: 'GitBranch', description: 'Version control, releases, and this very portfolio repo.', affiliateUrl: '#' },
  { title: 'Tailwind CSS', tag: 'Styling', icon: 'Wind', description: 'Utility-first CSS framework — the design backbone of this site.', affiliateUrl: '#' },
  { title: 'Namecheap', tag: 'Domains', icon: 'Globe', description: 'Affordable domains — my go-to for jmshakya.com.np.', affiliateUrl: '#' },
  { title: 'Figma', tag: 'Design', icon: 'PenTool', description: 'UI/UX mockups, prototypes, and design systems.', affiliateUrl: '#' },
  { title: 'Three.js', tag: '3D Web', icon: 'Box', description: 'The WebGL library behind all the interactive 3D on this site.', affiliateUrl: '#' },
  { title: 'VS Code', tag: 'Editor', icon: 'Code2', description: 'My daily driver editor with Copilot for fast shipping.', affiliateUrl: '#' },
  { title: 'DigitalOcean', tag: 'Cloud', icon: 'Cloud', description: 'Droplet hosting for client backends and databases.', affiliateUrl: '#' },
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
