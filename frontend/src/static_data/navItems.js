import { markRaw } from 'vue'
import IconDashboard from '@/components/icons/IconDashboard.vue'
import IconPassport from '@/components/icons/IconPassport.vue'
import IconGlobals from '@/components/icons/IconGlobals.vue'
import IconDiary from '@/components/icons/IconDiary.vue'
import IconUntis from '@/components/icons/IconUnits.vue'
import IconPremun from '@/components/icons/IconPremun.vue'
import IconProgress from '@/components/icons/IconProgress.vue'
import IconAI from '@/components/icons/IconAI.vue'
import IconClassRoom from '@/components/icons/IconClassRoom.vue'
import IconStudents from '@/components/icons/IconStudents.vue'
import IconBrain from '@/components/icons/IconBrain.vue'
export const commonNavItems = [
  { label: 'Dashboard', to: '/dashboard', icon: markRaw(IconDashboard) },
]

export const studentNavItems = [
  { label: 'My Passport',    to: '/passport',     icon: markRaw(IconPassport) },
  { label: 'My Globals',     to: '/globals',       icon: markRaw(IconGlobals)  }, 
  { label: 'Units',          to: '/units',         icon: markRaw(IconUntis)    },
  { label: 'PREMUN Hub',     to: '/premun',        icon: markRaw(IconPremun)    }, 
  { label: 'AI Assistant',   to: '/ai-assistant',  icon: markRaw(IconBrain) },
]

export const teacherNavItems = [  
  { label: 'Students',  to: '/students',      icon: markRaw(IconStudents)  },
  { label: 'Units',     to: '/units',        icon: markRaw(IconUntis) },
  { label: 'AI Assistant', to: '/ai-assistant', icon: markRaw(IconBrain) },
]
