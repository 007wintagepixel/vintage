"use client";

import { useState } from "react";
import { Users, Search, Ban, UserCheck, Eye } from "lucide-react";
import {
  useAdminQueries,
  useAdminMutations,
} from "@ludo-nexus/api-client/hooks/admin-hooks";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [kycStatus, setKycStatus] = useState<string | undefined>();
  const [isBanned, setIsBanned] = useState<boolean | undefined>();
  const limit = 20;

  const { users } = useAdminQueries();
  const { banUser, unbanUser } = useAdminMutations();

  const usersQuery = users(
    {
      search: search || undefined,
      kycStatus: kycStatus || undefined,
      isBanned: isBanned,
    },
    page,
    limit,
  );

  // Unwrap the API response: ApiResponse -> { data, meta }
  const usersResponse = usersQuery.data;
  const usersData = usersResponse?.data?.data || [];
  const usersMeta = usersResponse?.data?.meta;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const formatDate = (date: string | Date) =>
    format(new Date(date), "MMM d, yyyy");

  const getKycStatusBadge = (status?: string) => {
    const badges: Record<string, string> = {
      none: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      submitted:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
      under_review:
        "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      approved:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      rejected: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    };
    return badges[status || "none"] || badges.none;
  };

  const getKycStatusLabel = (status?: string) => {
    const labels: Record<string, string> = {
      none: "Not Started",
      submitted: "Submitted",
      under_review: "Under Review",
      approved: "Approved",
      rejected: "Rejected",
    };
    return labels[status || "none"] || "Unknown";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            Users
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage users across the platform
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search username, email, or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={kycStatus || ""}
            onChange={(e) => setKycStatus(e.target.value || undefined)}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
          >
            <option value="">All KYC Status</option>
            <option value="none">Not Started</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={isBanned !== undefined ? String(isBanned) : ""}
            onChange={(e) =>
              setIsBanned(
                e.target.value === "" ? undefined : e.target.value === "true",
              )
            }
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
          >
            <option value="">All Users</option>
            <option value="true">Banned Only</option>
            <option value="false">Active Only</option>
          </select>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        {usersQuery.isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
          </div>
        ) : usersQuery.isError ? (
          <div className="p-12 text-center text-red-500">
            <p>Failed to load users: {String(usersQuery.error)}</p>
            <button
              onClick={() => usersQuery.refetch()}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      KYC
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Wallet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {usersData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    usersData.map((user: any) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-slate-700/50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                              <span className="text-primary-600 dark:text-primary-400 font-medium">
                                {user.username?.charAt(0)?.toUpperCase() || "?"}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {user.username}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                              </p>
                              {user.fullName && (
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                  {user.fullName}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getKycStatusBadge(user.kycStatus)}`}
                          >
                            {getKycStatusLabel(user.kycStatus)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 dark:text-white font-mono">
                              {Number(
                                user.wallet?.available || 0,
                              ).toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              coins
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          <div>Matches: {user._count?.matches || 0}</div>
                          <div>Friends: {user._count?.friends || 0}</div>
                          <div>
                            Tournaments: {user._count?.tournaments || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          {user.deletedAt ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                              Banned
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                window.open(`/admin/users/${user.id}`, "_blank")
                              }
                              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {user.deletedAt ? (
                              <button
                                onClick={() => unbanUser.mutate(user.id)}
                                disabled={unbanUser.isPending}
                                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                title="Unban User"
                              >
                                <UserCheck className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  const reason = prompt("Reason for ban:");
                                  if (reason)
                                    banUser.mutate({ userId: user.id, reason });
                                }}
                                disabled={banUser.isPending}
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Ban User"
                              >
                                <Ban className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {usersMeta && usersMeta.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {(page - 1) * limit + 1} to{" "}
                  {Math.min(page * limit, usersMeta.total)} of {usersMeta.total}{" "}
                  users
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || usersQuery.isFetching}
                    className="px-3 py-1 border border-gray-300 dark:border-slate-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(usersMeta!.totalPages, p + 1))
                    }
                    disabled={
                      page === usersMeta.totalPages || usersQuery.isFetching
                    }
                    className="px-3 py-1 border border-gray-300 dark:border-slate-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
