import classNames from "classnames"
import Link from "next/link"
import { ElementType, ReactChild } from "react"

interface SidebarLinkProps {
  Icon: ElementType
  children: ReactChild
  active?: boolean
  link?: string
}

const SidebarLink = ({
  Icon,
  children,
  active,
  link = "/",
}: SidebarLinkProps) => {
  return (
    <Link href={link}>
      <a className="block">
        <div
          className={classNames(
            "hoverAnimation flex items-center justify-center space-x-3 text-xl text-slate-200 xl:justify-start",
            {
              "bg-neutral-200/10 font-bold": active,
            }
          )}
        >
          <Icon className="h-7" />
          <span className="hidden xl:inline">{children}</span>
        </div>
      </a>
    </Link>
  )
}

export default SidebarLink
