import { Plus, FilePenLine } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupAction,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "File 1",
    url: "#",
    icon: FilePenLine,
  },
  {
    title: "File 2",
    url: "#",
    icon: FilePenLine,
  },
];

export function AppSidebar() {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Drawings</SidebarGroupLabel>
        <SidebarGroupAction title="New Drawing">
          <Plus /> <span className="sr-only">New Drawing</span>
        </SidebarGroupAction>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton>
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
