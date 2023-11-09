import { CurrencySwitcher } from "@/components/currency-switcher";
import { MainNav } from "@/components/layout/main-nav";
import { UserNav } from "@/components/layout/user-nav";

export default function Header() {
    return (
        <>
            <div className="border-b">
                <div className="flex h-16 items-center px-4">
                    <MainNav className="mx-6" />
                    <div className="ml-auto flex items-center space-x-4">
                        <CurrencySwitcher />
                        <UserNav />
                    </div>
                </div>
            </div>
        </>
    )
}