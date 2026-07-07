import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronRight, Laptop, Moon, Sun, FileText, Video, BookOpen, Search } from 'lucide-react'
import { useSearch } from '@/contexts/search-provider'
import { useTheme } from '@/contexts/theme-provider'
import { searchContent, SearchResult } from '@/services/contentService'
import { useDebounce } from 'use-debounce'
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
  
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebounce(query, 300)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    async function fetchResults() {
      if (!debouncedQuery.trim()) {
        setResults([])
        return
      }
      setIsSearching(true)
      try {
        const res = await searchContent(debouncedQuery)
        setResults(res)
      } catch (err) {
        console.error(err)
      } finally {
        setIsSearching(false)
      }
    }
    fetchResults()
  }, [debouncedQuery])

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  const getIcon = (type: string) => {
    switch(type) {
      case 'note': return <FileText className='size-3.5 text-muted-foreground' />
      case 'tutorial': return <Video className='size-3.5 text-muted-foreground' />
      case 'subject': return <BookOpen className='size-3.5 text-muted-foreground' />
      default: return <ArrowRight className='size-3.5 text-muted-foreground' />
    }
  }

  const getUrl = (item: SearchResult) => {
    switch(item.type) {
      case 'note': return `/library/${item.subject_slug}/${item.slug}`
      case 'tutorial': return `/tutorials/${item.subject_slug}/${item.slug}`
      case 'subject': return `/library/${item.slug}`
      default: return '/'
    }
  }

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder='Type a command or search...' 
        value={query} 
        onValueChange={setQuery} 
      />
      <CommandList>
        <ScrollArea type='hover' className='h-72 pe-1'>
          <CommandEmpty>{isSearching ? 'Searching...' : 'No results found.'}</CommandEmpty>
          
          {results.length > 0 && (
            <CommandGroup heading='Search Results'>
              {results.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.title}
                  onSelect={() => runCommand(() => navigate(getUrl(item)))}
                >
                  <div className='flex size-6 items-center justify-center mr-2 bg-surface-container rounded-md'>
                    {getIcon(item.type)}
                  </div>
                  <div className="flex flex-col">
                    <span>{item.title}</span>
                    <span className="text-xs text-muted-foreground uppercase font-label-caps">{item.type} • {item.subject_slug}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!query && commandNavGroups.map((group) => (
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
          
          {!query && (
            <>
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
            </>
          )}
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}
