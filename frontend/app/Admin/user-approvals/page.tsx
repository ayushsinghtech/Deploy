"use client"

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, ArrowLeft, Users, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserApprovalsPage() {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // For now, this is a placeholder. In a real app, you'd fetch pending users
    setPendingUsers([
      {
        _id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        createdAt: new Date().toISOString(),
        status: "pending"
      },
      {
        _id: "2",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        createdAt: new Date().toISOString(),
        status: "pending"
      }
    ]);
  }, []);

  const handleApprove = async (userId: string) => {
    // Placeholder for approval logic
    console.log("Approving user:", userId);
    setPendingUsers(prev => prev.filter(user => user._id !== userId));
  };

  const handleReject = async (userId: string) => {
    // Placeholder for rejection logic
    console.log("Rejecting user:", userId);
    setPendingUsers(prev => prev.filter(user => user._id !== userId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      {/* Navbar with Return to Dashboard */}
      <div className="flex items-center justify-between mb-8">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/Admin")}
        >
          <ArrowLeft className="w-5 h-5" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Approvals</h1>
        </div>
        <Button variant="outline" onClick={() => router.push("/Admin")}>
          Return to Dashboard
        </Button>
      </div>

      <div className="space-y-4">
        {pendingUsers.length > 0 ? (
          pendingUsers.map((user) => (
            <Card key={user._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {user.firstName} {user.lastName}
                      </CardTitle>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          Requested {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700">
                    Pending Approval
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(user._id)}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleReject(user._id)}
                    className="flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium">No pending approvals</h3>
            <p className="text-sm">All user requests have been processed</p>
          </div>
        )}
      </div>
    </div>
  );
} 