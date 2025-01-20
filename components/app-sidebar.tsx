"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { BookOpen, Bot, Frame, Settings2, SquareTerminal } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";

const navData = [
    {
        title: "Dashboard",
        url: "#",
        icon: SquareTerminal,
        items: [
            { title: "Main", url: "/dashboard" },
            { title: "Transactions", url: "/dashboard/transactions" },
        ],
    },
    {
        title: "Series",
        url: "#",
        icon: Bot,
        items: [
            { title: "Comic", url: "#" },
            { title: "Novel", url: "/series/novel" },
        ],
    },
    {
        title: "Chapter",
        url: "#",
        icon: BookOpen,
        items: [
            { title: "Comic", url: "#" },
            { title: "Novel", url: "/chapter/novel" },
        ],
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
            { title: "General", url: "/settings" },
            { title: "Team", url: "/settings/team" },
            { title: "Billing", url: "/settings/billing" },
            { title: "Limits", url: "/settings/limits" },
        ],
    },
];

const projects = [
    {
        name: "All Users",
        url: "/users",
        icon: Frame,
    },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    user: {
        name: string;
        email: string;
        image?: string | null;
    };
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
    const pathname = usePathname();

    const navMain = navData.map((item) => ({
        ...item,
        isActive:
            pathname === item.url ||
            item.items.some((sub) => pathname.startsWith(sub.url)),
    }));

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
                <NavProjects projects={projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
