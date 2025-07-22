// sidebar.tsx
import { Menu, Home, Settings, History } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <div className={`bg-gray-800 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="p-4">
        <Button variant="ghost" onClick={onToggle}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      <nav className="mt-8">
        <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-700">
          <Home className="h-5 w-5" />
          {isOpen && <span className="ml-3">Dashboard</span>}
        </a>
        <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-700">
          <History className="h-5 w-5" />
          {isOpen && <span className="ml-3">Recordings</span>}
        </a>
        <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-700">
          <Settings className="h-5 w-5" />
          {isOpen && <span className="ml-3">Settings</span>}
        </a>
      </nav>
    </div>
  )
}

// alerts-panel.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AlertsPanel() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Alerts & Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm text-gray-400">No alerts</div>
          <div className="text-sm text-green-400">System operational</div>
        </div>
      </CardContent>
    </Card>
  )
}