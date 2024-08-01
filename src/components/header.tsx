import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { custom } from "@/custom";
import Link from "next/link";

export function Header() {
  return (
    <header className="container flex flex-col items-start justify-between space-y-2 bg-white py-4 shadow-sm sm:flex-row sm:items-center sm:space-y-0 md:h-16">
      <div className="shrink-0 text-lg font-semibold">{custom.APP_NAME}</div>
      <div className="ml-auto flex w-full space-x-2 sm:justify-end">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  login
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
