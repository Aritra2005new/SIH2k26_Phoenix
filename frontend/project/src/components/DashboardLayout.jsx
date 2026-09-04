import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import NotificationBell from './NotificationBell';
import CursorGrid from './visuals/CursorGrid';

export default function DashboardLayout({ role }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fdfcfb] text-[#4a3931]">
      
      {/* Background grid */}
      <CursorGrid
        cellSize={72}
        color="#4a3931"
        radius={190}
        maxOpacity={0.18}
        lineWidth={1}
        fillOpacity={0.012}
        gridOpacity={0.035}
        clickPulse={false}
      />

      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main workspace */}
      <div className="relative z-10 ml-64 min-h-screen bg-[radial-gradient(circle_at_80%_0%,rgba(226,209,195,.35),transparent_30%)]">

        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#4a3931]/10 bg-[#fdfcfb]/90 px-6 backdrop-blur-xl">
          
          <div>
            <span className="text-xs uppercase tracking-[.18em] text-[#9b877b]">
              CivicSync
            </span>

            <span className="ml-3 text-xs font-medium text-[#4a3931]">
              {role} workspace
            </span>
          </div>

          <div className="flex items-center gap-3">

            <NotificationBell />
          </div>

        </header>

        {/* Page content */}
        <main className="relative min-h-[calc(100vh-4rem)] p-6 lg:p-8">
          <div className="relative z-10">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}