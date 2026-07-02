import React from 'react'
import { Outlet } from 'react-router-dom'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { LayoutProvider } from '@/contexts/layout-provider'
import { SearchProvider } from '@/contexts/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SkipToMain } from '@/components/skip-to-main'
import { type SidebarData } from './types'
import { Header } from './header'
import { Search } from '@/components/search'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

interface DashboardLayoutProps {
  data: SidebarData
  children?: React.ReactNode
}

export function DashboardLayout({ data, children }: DashboardLayoutProps) {
  const defaultOpen = getCookie('sidebar_state') !== 'false'
  
  return (
    <SearchProvider>
      <LayoutProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />
          <AppSidebar data={data} />
          <SidebarInset
            className={cn(
              '@container/content',
              'has-data-[layout=fixed]:h-svh',
              'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
            )}
          >
            <Header>
              <div className="ml-auto flex items-center space-x-4">
                <Search />
                <ThemeSwitch />
                <ProfileDropdown />
              </div>
            </Header>
            <main className="flex-1 overflow-auto p-4 md:p-6 bg-surface">
              {children ?? <Outlet />}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
    </SearchProvider>
  )
}
