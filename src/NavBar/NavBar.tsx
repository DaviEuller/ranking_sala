import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import style from './style.module.css'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
}

// ✅ Adicionado userName e userRole como props
interface NavBarProps {
  notificacoes?: number
  userName?: string
  userRole?: 'Aluno' | 'Admin'
}

function IconDashboard() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="5" height="5" rx="1" strokeWidth="1.4" />
      <rect x="9" y="2" width="5" height="5" rx="1" strokeWidth="1.4" />
      <rect x="2" y="9" width="5" height="5" rx="1" strokeWidth="1.4" />
      <rect x="9" y="9" width="5" height="5" rx="1" strokeWidth="1.4" />
    </svg>
  )
}

function IconRanking() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2L10 6L14 6.5L11 9.5L11.8 14L8 12L4.2 14L5 9.5L2 6.5L6 6L8 2Z"
        strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function IconAlunos() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="6" r="3" strokeWidth="1.4" />
      <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function IconRelatorios() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 4h10M3 8h7M3 12h5" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function IconEquipes() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="5" cy="6" r="2.5" strokeWidth="1.4" />
      <circle cx="11" cy="6" r="2.5" strokeWidth="1.4" />
      <path d="M1 14c0-2.5 1.8-4 4-4s4 1.5 4 4" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M11 10c2.2 0 4 1.5 4 4" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function IconBell() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2a4 4 0 0 0-4 4v2l-1.5 2.5h11L12 8V6a4 4 0 0 0-4-4z" strokeWidth="1.3" />
      <path d="M6.5 13a1.5 1.5 0 0 0 3 0" strokeWidth="1.3" />
    </svg>
  )
}

const navItemsAluno: NavItem[] = [
  { label: 'Dashboard', path: '/aluno/dashboard', icon: <IconDashboard /> },
  { label: 'Ranking',   path: '/ranking',          icon: <IconRanking /> },
]

const navItemsAdmin: NavItem[] = [
  { label: 'Dashboard',  path: '/admin/dashboard', icon: <IconDashboard /> },
  { label: 'Ranking',    path: '/aluno/dashboard',  icon: <IconRanking /> },
  { label: 'Alunos',     path: '/Caluno',           icon: <IconAlunos /> },
  { label: 'Equipes',    path: '/Cequipe',          icon: <IconEquipes /> },
  { label: 'Relatórios', path: '/relatorios',       icon: <IconRelatorios /> },
]

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]?.toUpperCase() ?? '').join('')
}

// ✅ Recebe userName e userRole como props — sem mais localStorage aqui
export default function NavBar({ notificacoes = 0, userName = 'Usuário', userRole = 'Aluno' }: NavBarProps) {
  const navigate   = useNavigate()
  const location   = useLocation()
  const [hasNotif] = useState(notificacoes > 0)

  const initials = getInitials(userName)
  const items    = userRole === 'Admin' ? navItemsAdmin : navItemsAluno
  const homePath = userRole === 'Admin' ? '/admin/dashboard' : '/aluno/dashboard'

  return (
    <div className={style.navbar_wrapper}>
      <nav className={style.navbar}>
        <div className={style.corner_tl} />
        <div className={style.corner_br} />

        {/* LOGO */}
        <div className={style.nav_logo} onClick={() => navigate(homePath)}>
          <div className={style.logo_mark}>
            <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
              <polygon points="7,1 13,10 1,10" fill="white" />
            </svg>
          </div>
          <span className={style.logo_text}>
            Rank<span className={style.logo_accent}> Sala</span>
          </span>
        </div>

        <div className={style.nav_sep} />

        {/* LINKS */}
        <div className={style.nav_links}>
          {items.map(item => {
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                className={`${style.nav_link} ${isActive ? style.nav_link_active : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span className={`${style.nav_icon} ${isActive ? style.nav_icon_active : ''}`}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            )
          })}
        </div>

        {/* DIREITO */}
        <div className={style.nav_right}>
          <button className={style.nav_notif}>
            <IconBell />
            {hasNotif && <span className={style.notif_dot} />}
          </button>

          <div className={style.nav_user}>
            <span className={style.nav_user_name}>{userName}</span>
            <span className={style.nav_user_role}>{userRole}</span>
          </div>

          <div className={style.nav_avatar}>{initials}</div>
        </div>
      </nav>
    </div>
  )
}