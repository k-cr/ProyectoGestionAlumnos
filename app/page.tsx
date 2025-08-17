import { Sidebar } from "@/components/sidebar"
import { RecentActivity } from "@/components/recent-activity"
import { UpcomingActivities } from "@/components/upcoming-activities"
import { ActivityCalendar } from "@/components/activity-calendar"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 md:ml-64">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Bienvenido a tu sistema de gestión de alumnos</p>
          </div>

          <div className="space-y-8">
            {/* Calendar - Full width section */}
            <div className="w-full">
              <ActivityCalendar />
            </div>

            {/* Upcoming Activities - Full width section */}
            <div className="w-full">
              <UpcomingActivities />
            </div>

            {/* Recent Activity - Full width section */}
            <div className="w-full">
              <div>
                <h2 className="text-xl font-semibold mb-4">Actividad Reciente</h2>
                <RecentActivity />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
