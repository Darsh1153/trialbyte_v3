"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Bar,
  BarChart,
  ResponsiveContainer,
} from "recharts";

// Mock data
const data = [
  { month: "Jan", users: 120, trials: 30 },
  { month: "Feb", users: 160, trials: 45 },
  { month: "Mar", users: 200, trials: 60 },
  { month: "Apr", users: 240, trials: 70 },
  { month: "May", users: 280, trials: 85 },
  { month: "Jun", users: 320, trials: 95 },
];

const registrationData = [
  { month: "Jan", registrations: 13 },
  { month: "Feb", registrations: 14 },
  { month: "Mar", registrations: 15 },
  { month: "Apr", registrations: 22 },
  { month: "May", registrations: 18 },
  { month: "June", registrations: 15 },
  { month: "July", registrations: 15 },
];

const trialData = [
  { name: "Active", value: 65, color: "#204B73" },
  { name: "Inactive", value: 25, color: "#C6EDFD" },
  { name: "Expired", value: 10, color: "#94A3B8" },
];

export default function AdminHome() {
  return (
    <div className="space-y-6 p-2 sm:p-4">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Users",
            value: "1,248",
            change: "+12% from last month",
          },
          { title: "Active Trials", value: "73", change: "+5 this week" },
          { title: "Therapeutics", value: "29", change: "+2 new" },
          { title: "Drugs", value: "112", change: "-3 discontinued" },
        ].map((card, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">{card.value}</div>
              <div className="text-xs text-muted-foreground">{card.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="flex flex-col xl:flex-row gap-4">
        {/* Main Area Chart */}
        {/* <Card className="flex-1 min-h-[350px]">
          <CardHeader>
            <CardTitle>Users and Trials (last 6 months)</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer
              config={{
                users: { label: "Users", color: "#2563eb" },
                trials: { label: "Trials", color: "#16a34a" },
              }}
              className="w-full h-[250px] md:h-[300px] lg:h-[350px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#2563eb"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor="#2563eb"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                    <linearGradient id="fillTrials" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#16a34a"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor="#16a34a"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#2563eb"
                    fillOpacity={1}
                    fill="url(#fillUsers)"
                  />
                  <Area
                    type="monotone"
                    dataKey="trials"
                    stroke="#16a34a"
                    fillOpacity={1}
                    fill="url(#fillTrials)"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card> */}

        {/* Side Charts */}
        <div className="flex flex-col gap-4 w-full xl:w-[400px]">
          {/* Bar Chart */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-lg">New Registration</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <ChartContainer
                config={{
                  registrations: { label: "Registrations", color: "#204B73" },
                }}
                className="w-full h-[180px] sm:h-[200px] md:h-[220px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={registrationData}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="registrations"
                      fill="#204B73"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Donut Chart */}
          <Card className="flex-2">
            <CardHeader>
              <CardTitle className="text-lg">Active trial list</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <ChartContainer
                config={{
                  active: { label: "Active", color: "#204B73" },
                  inactive: { label: "Inactive", color: "#C6EDFD" },
                  expired: { label: "Expired", color: "#94A3B8" },
                }}
                className="w-full h-[180px] sm:h-[200px] md:h-[220px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trialData}
                      cx="50%"
                      cy="50%"
                      innerRadius="40%"
                      outerRadius="70%"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {trialData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-3 flex flex-wrap justify-center gap-3">
                {trialData.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
