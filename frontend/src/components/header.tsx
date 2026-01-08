//import * as React from "react"
import { Link } from "react-router-dom"
import { ModeToggle } from "./mode-toggle"
import { useIsMobile } from "@/hooks/use-mobile"
import logoLight from "@/assets/logo-light.svg"
import logoDark from "@/assets/logo-dark.svg"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Badge } from "@/components/ui/badge"


export function Header() {
  const isMobile = useIsMobile()
  return (
    <NavigationMenu viewport={isMobile}>
      <NavigationMenuList className="flex-wrap">
        <NavigationMenuItem>
            <Link to="/">
              <img src={logoLight} alt="Logo" className="h-8 w-auto block dark:hidden" />
              <img src={logoDark} alt="Logo" className="h-8 w-auto hidden dark:block" />
            </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Badge variant="secondary">Alpha v0.0.3</Badge>
        </NavigationMenuItem>
        <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/builder">Builder</Link>
            </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/compare">Compare</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <ModeToggle />
      </NavigationMenuList>
    </NavigationMenu>
  )
}

/*function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
*/