"use client"

import { Home, BookOpen, Bookmark, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { icon: Home, label: "Home", active: true },
    { icon: BookOpen, label: "Topics", active: false },
    { icon: Bookmark, label: "Saved Lessons", active: false },
    { icon: Settings, label: "Settings", active: false },
  ]

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 border-r border-border bg-card transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col p-6">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-primary to-accent p-2">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">Learn Anything</span>
            </div>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Menu items */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant={item.active ? "secondary" : "ghost"}
                className={cn("w-full justify-start gap-3 rounded-xl", item.active && "bg-secondary")}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Footer */}
          <div className="mt-auto rounded-xl bg-muted p-4 text-sm text-muted-foreground">
            <p className="font-medium">💡 Tip</p>
            <p className="mt-1">Be specific about what you want to learn for better results.</p>
          </div>
        </div>
      </aside>
    </>
  )
}
