"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/utils";

export function Nav({ children }: { children: ReactNode }) {
  return (
    <nav className="hidden items-center lg:flex bg-primary ml-auto text-[16px] text-primary-foreground gap-1 px-4">
      {children}
    </nav>
  );
}
export function NavLink(props: ComponentProps<typeof Link>) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        "py-2 px-3 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary",
        pathname === props.href && "bg-white/10 rounded-4xl text-foreground"
      )}
    />
  );
}
