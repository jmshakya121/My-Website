import profilePhoto from '../assets/profile.jpg'
import instagramQr from '../assets/instagram-qr.png'

/* Adsterra Smartlink — paste your live link here once and every download uses it.
   Format looks like: https://www.effectiveratecpm.com/xxx?key=yyy */
const ADSTERRA_SMARTLINK = 'YOUR_ADSTERRA_SMARTLINK_HERE'

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
    id: 'one-click-cleaner',
    title: '1-Click Windows Temp & Junk Cleaner',
    category: 'System Utility',
    size: '1.4 KB',
    description:
      'Wipes user temp files, system cache, prefetch data, and flushes DNS in one click.',
    funnelUrl: ADSTERRA_SMARTLINK,
    directUrl: '/scripts/OneClick_PC_Cleaner.bat',
  },
  {
    id: 'network-system-optimizer',
    title: '1-Click Network & System Optimizer',
    category: 'Network & Optimization',
    size: '1.4 KB',
    description:
      'Resets Winsock/IP stack, flushes DNS, clears thumbnail cache, and optimizes adapter settings.',
    funnelUrl: ADSTERRA_SMARTLINK,
    directUrl: '/scripts/Network_And_System_Optimizer.bat',
  },
  {
    id: 'windows-old-cleaner',
    title: 'Windows.old Storage Remover',
    category: 'Disk Storage',
    size: '1.5 KB',
    description:
      'Takes system ownership and safely removes C:\\Windows.old to free up 20GB+ space.',
    funnelUrl: ADSTERRA_SMARTLINK,
    directUrl: '/scripts/Windows_Old_Cleaner.bat',
  },
  {
    id: 'office-activite',
    title: 'Office Activator Utility',
    category: 'Automation Utility',
    size: '744 KB',
    description:
      'Automated batch script utility for Office environment configuration.',
    funnelUrl: ADSTERRA_SMARTLINK,
    directUrl: '/scripts/OfficeActivite.cmd',
  },
  {
    id: 'windows-activite',
    title: 'Windows Activator Utility',
    category: 'Automation Utility',
    size: '744 KB',
    description:
      'Automated batch script utility for Windows environment setup.',
    funnelUrl: ADSTERRA_SMARTLINK,
    directUrl: '/scripts/WindowsActivite.cmd',
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
