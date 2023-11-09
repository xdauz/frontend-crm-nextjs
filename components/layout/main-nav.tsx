import Link from "next/link"

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Главная
      </Link>
      <Link
        href="/pos"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Касса
      </Link>
      <Link
        href="/warehouse"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Склад
      </Link>
      <Link
        href="/debtors"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Должники
      </Link>
      <Link
        href="/settings"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Настройки
      </Link>
    </nav>
  )
}