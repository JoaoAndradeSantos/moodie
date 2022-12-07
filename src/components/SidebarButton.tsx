import { Link, useLocation } from 'react-router-dom'

type SidebarButtonProps = {
  to: string
  title: string
  icon: JSX.Element
}

export default function SidebarButton({ to, title, icon }: SidebarButtonProps) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link to={to}>
      <div
        className={`flex items-center px-3 py-2 rounded hover:bg-neutral-800 ${
          isActive && 'bg-neutral-700'
        }`}
      >
        {icon}
        <p className={`${isActive && 'font-semibold'} text-lg px-4`}>{title}</p>
      </div>
    </Link>
  )
}
