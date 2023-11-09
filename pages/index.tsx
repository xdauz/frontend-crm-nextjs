import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker"
import { DashboardOverviewPage } from "@/components/pages/dashboard/overview";
import { DashboardReports } from "@/components/pages/dashboard/reports";
import { DashboardAnalytics } from "@/components/pages/dashboard/analytics";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Layout from "@/components/layout/layout";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
}

export default function DashboardPage() {
  return (
    <Layout>     
      <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Панель управления</h2>
            <div className="flex items-center space-x-2">
              {/* <CalendarDateRangePicker /> */}

              {/* <Button variant="secondary">Скачать</Button> */}
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Общее</TabsTrigger>
              <TabsTrigger value="analytics">
                Аналитика
              </TabsTrigger>
              <TabsTrigger value="reports">
                Отчеты
              </TabsTrigger>
            </TabsList>

            <DashboardOverviewPage />
            <DashboardReports />
            <DashboardAnalytics />

          </Tabs>
        </div>
    </Layout>
  )
}