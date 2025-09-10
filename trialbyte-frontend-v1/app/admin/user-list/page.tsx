"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ChevronLeft, ChevronRight, Plus, MoreHorizontal } from "lucide-react";
import { AddUserModal } from "@/components/add-user-modal";
import { usersApi } from "@/app/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type ApiUser = {
  id: string;
  username: string;
  email: string;
  company: string | null;
  designation: string | null;
  phone: string | null;
  country: string | null;
  region: string | null;
  sex: string | null;
  age: number | null;
  plan: string | null;
  created_at: string;
  updated_at: string;
};

// Chart data
const newTrialsData = [
  { month: "Jan", trials: 5 },
  { month: "Feb", trials: 8 },
  { month: "Mar", trials: 12 },
  { month: "Apr", trials: 18 },
  { month: "May", trials: 15 },
  { month: "June", trials: 10 },
  { month: "July", trials: 7 },
];

const addedVsModifiedData = [
  { name: "Added", value: 75, color: "#204B73" },
  { name: "Modified", value: 25, color: "#C6EDFD" },
];

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await usersApi.list();
        if (mounted) setUsers(data as ApiUser[]);
      } catch {
        // Use mock data when API fails
        if (mounted) {
          setUsers([
            {
              id: "CT123",
              username: "John Doe",
              email: "john.doe@example.com",
              company: "PharmaCorp",
              designation: "Clinical Researcher",
              phone: "+1-555-0123",
              country: "USA",
              region: "North America",
              sex: "Male",
              age: 35,
              plan: "active",
              created_at: "2024-01-15T10:30:00Z",
              updated_at: "2024-01-15T10:30:00Z",
            },
            {
              id: "CT124",
              username: "Jane Smith",
              email: "jane.smith@example.com",
              company: "MedTech Inc",
              designation: "Clinical Trial Manager",
              phone: "+1-555-0124",
              country: "Canada",
              region: "North America",
              sex: "Female",
              age: 28,
              plan: "inactive",
              created_at: "2024-01-20T14:15:00Z",
              updated_at: "2024-01-20T14:15:00Z",
            },
            {
              id: "CT125",
              username: "Alex Brown",
              email: "alex.brown@example.com",
              company: "BioResearch Ltd",
              designation: "Clinical Data Analyst",
              phone: "+1-555-0125",
              country: "USA",
              region: "North America",
              sex: "Male",
              age: 42,
              plan: "active",
              created_at: "2024-02-01T09:45:00Z",
              updated_at: "2024-02-01T09:45:00Z",
            },
            {
              id: "CT126",
              username: "Emily Davis",
              email: "emily.davis@example.com",
              company: "Clinical Solutions",
              designation: "Clinical Trial Monitor",
              phone: "+1-555-0126",
              country: "USA",
              region: "North America",
              sex: "Female",
              age: 31,
              plan: "active",
              created_at: "2024-02-10T16:20:00Z",
              updated_at: "2024-02-10T16:20:00Z",
            },
            {
              id: "CT127",
              username: "Michael Lee",
              email: "michael.lee@example.com",
              company: "Research Partners",
              designation: "Clinical Research Associate",
              phone: "+1-555-0127",
              country: "Canada",
              region: "North America",
              sex: "Male",
              age: 39,
              plan: "inactive",
              created_at: "2024-02-15T11:30:00Z",
              updated_at: "2024-02-15T11:30:00Z",
            },
          ]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return users.filter((u) =>
      [u.username, u.email, u.company ?? ""].some((v) =>
        String(v).toLowerCase().includes(q)
      )
    );
  }, [users, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAF8FF] to-white p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setIsAddUserModalOpen(true)}
            className="bg-[#204B73] hover:bg-[#204B73]/90 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add new users
          </Button>
          <Button
            variant="outline"
            className="border-[#204B73] text-[#204B73] hover:bg-[#204B73] hover:text-white"
          >
            Remove users
          </Button>
        </div>
      </div>

      {/* User Table */}
      <Card className="bg-white shadow-lg">
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[50px]">
                    <input type="checkbox" className="rounded" />
                  </TableHead>
                  <TableHead className="font-semibold">User Name</TableHead>
                  <TableHead className="font-semibold">Designation</TableHead>
                  <TableHead className="font-semibold">IP Authority</TableHead>
                  <TableHead className="font-semibold">User Status</TableHead>
                  <TableHead className="font-semibold">User ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#204B73]"></div>
                        <span className="ml-2">Loading users...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell>
                        <input type="checkbox" className="rounded" />
                      </TableCell>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.designation || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={user.plan === "active" ? "default" : "secondary"}>
                          {user.plan === "active" ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.plan === "active" ? "default" : "secondary"}>
                          {user.plan === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{user.id.slice(0, 8)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Trials Added Chart */}
        <Card className="bg-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-700">
              New Trials added
            </CardTitle>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={newTrialsData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Bar dataKey="trials" fill="#204B73" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Added vs Modified Chart */}
        <Card className="bg-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-700">
              Added vs Modified
            </CardTitle>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={addedVsModifiedData}
                  cx="50%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="80%"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {addedVsModifiedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              {addedVsModifiedData.map((entry, index) => (
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

      {/* Add User Modal */}
      <AddUserModal
        open={isAddUserModalOpen}
        onOpenChange={setIsAddUserModalOpen}
      />
    </div>
  );
}