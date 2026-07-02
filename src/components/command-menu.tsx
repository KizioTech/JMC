import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronRight, Laptop, Moon, Sun } from 'lucide-react'
import { useSearch } from '@/contexts/search-provider'
import { useTheme } from '@/contexts/theme-provider'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { ScrollArea } from './ui/scroll-area'

// Static navigation items for the command palette
const commandNavGroups = [
  {
    title: 'Navigation',
    items: [
      { title: 'Home', url: '/' },
      { title: 'Library', url: '/library' },
      { title: 'Tutorials', url: '/tutorials' },
      { title: 'Courses', url: '/courses' },
      { title: 'Dashboard', url: '/dashboard' },
    ],
  },
]

export function CommandMenu() {
  const navigate = useNavigate()
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder='Type a command or search...' />
      <CommandList>
        <ScrollArea type='hover' className='h-72 pe-1'>
          <CommandEmpty>No results found.</CommandEmpty>
          {commandNavGroups.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((item, i) => (
                <CommandItem
                  key={`${item.url}-${i}`}
                  value={item.title}
                  onSelect={() => {
                    runCommand(() => navigate(item.url))
                  }}
                >
                  <div className='flex size-4 items-center justify-center'>
                    <ArrowRight className='size-2 text-muted-foreground/80' />
                  </div>
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup heading='Theme'>
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <Sun /> <span>Light</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              <Moon className='scale-90' />
              <span>Dark</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
              <Laptop />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}
