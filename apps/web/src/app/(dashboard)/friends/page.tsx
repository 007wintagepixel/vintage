"use client";

import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  UserX,
  Search,
  MessageSquare,
  MoreVertical,
  Check,
  X,
  Star,
} from "lucide-react";
import { useState } from "react";

const mockFriends = [
  {
    id: "1",
    username: "PlayerTwo",
    avatar: "P2",
    status: "online",
    isFriend: true,
    mutualFriends: 12,
    lastSeen: "Now",
  },
  {
    id: "2",
    username: "PlayerThree",
    avatar: "P3",
    status: "online",
    isFriend: true,
    mutualFriends: 8,
    lastSeen: "Now",
  },
  {
    id: "3",
    username: "PlayerFour",
    avatar: "P4",
    status: "offline",
    isFriend: true,
    mutualFriends: 5,
    lastSeen: "2h ago",
  },
  {
    id: "4",
    username: "PlayerFive",
    avatar: "P5",
    status: "in-game",
    isFriend: true,
    mutualFriends: 3,
    lastSeen: "In Match",
  },
  {
    id: "5",
    username: "PlayerSix",
    avatar: "P6",
    status: "online",
    isFriend: false,
    pending: true,
    mutualFriends: 15,
    lastSeen: "Now",
  },
  {
    id: "6",
    username: "PlayerSeven",
    avatar: "P7",
    status: "offline",
    isFriend: false,
    pending: false,
    sent: true,
    mutualFriends: 7,
    lastSeen: "1d ago",
  },
  {
    id: "7",
    username: "PlayerEight",
    avatar: "P8",
    status: "online",
    isFriend: false,
    pending: false,
    sent: false,
    mutualFriends: 4,
    lastSeen: "Now",
  },
  {
    id: "8",
    username: "PlayerNine",
    avatar: "P9",
    status: "offline",
    isFriend: false,
    pending: false,
    sent: false,
    mutualFriends: 2,
    lastSeen: "3d ago",
  },
];

const mockRequests = [
  {
    id: "1",
    username: "PlayerTen",
    avatar: "P10",
    mutualFriends: 6,
    sentAt: "2h ago",
  },
  {
    id: "2",
    username: "PlayerEleven",
    avatar: "P11",
    mutualFriends: 3,
    sentAt: "5h ago",
  },
];

export default function DashboardFriendsPage() {
  const [activeTab, setActiveTab] = useState<
    "friends" | "requests" | "add" | "blocked"
  >("friends");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFriends = mockFriends.filter((f) =>
    f.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "online":
        return <span className="w-2.5 h-2.5 rounded-full bg-accent-green" />;
      case "offline":
        return <span className="w-2.5 h-2.5 rounded-full bg-text-muted" />;
      case "in-game":
        return (
          <span className="w-2.5 h-2.5 rounded-full bg-primary-glow animate-pulse" />
        );
      default:
        return <span className="w-2.5 h-2.5 rounded-full bg-text-muted" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "online":
        return "Online";
      case "offline":
        return "Offline";
      case "in-game":
        return "In Match";
      default:
        return "Offline";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <h1 className="font-display text-display-md gradient-text">
            Friends
          </h1>
          <p className="text-text-secondary mt-1">
            Connect with players and build your squad
          </p>
        </div>
        <button className="btn-primary gap-2">
          <UserPlus className="w-4 h-4" />
          Add Friend
        </button>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card-strong rounded-2xl overflow-hidden"
      >
        <div className="border-b border-surface-border">
          <nav className="flex -mb-px" role="tablist">
            {[
              {
                id: "friends",
                label: "Friends",
                count: mockFriends.filter((f) => f.isFriend).length,
                icon: Users,
              },
              {
                id: "requests",
                label: "Requests",
                count: mockRequests.length,
                icon: UserPlus,
              },
              { id: "add", label: "Find Friends", count: null, icon: Search },
              { id: "blocked", label: "Blocked", count: 0, icon: UserX },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`flex items-center gap-2 px-6 py-4 text-body-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "text-primary-glow border-b-2 border-primary-glow bg-primary-glow/5"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-tertiary"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-caption font-medium bg-primary-glow/20 text-primary-glow">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6" role="tabpanel">
          {activeTab === "friends" && (
            <>
              {/* Search */}
              <div className="mb-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search friends..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-12 w-full"
                  />
                </div>
              </div>

              {/* Friends List */}
              <div className="space-y-3">
                {filteredFriends
                  .filter((f) => f.isFriend)
                  .map((friend, index) => (
                    <motion.div
                      key={friend.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-card-hover p-4 rounded-2xl flex items-center gap-4"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-glow to-accent-magenta flex items-center justify-center font-display font-bold text-text-inverse">
                          {friend.avatar}
                        </div>
                        {getStatusIndicator(friend.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-text-primary">
                            {friend.username}
                          </span>
                          {friend.mutualFriends > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-caption bg-surface-tertiary text-text-muted">
                              {friend.mutualFriends} mutual
                            </span>
                          )}
                        </div>
                        <div className="text-body-sm text-text-muted">
                          {getStatusLabel(friend.status)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="btn-ghost p-2 rounded-xl hover:bg-surface-tertiary"
                          aria-label="Chat"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          className="btn-ghost p-2 rounded-xl hover:bg-surface-tertiary"
                          aria-label="Invite to game"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                        <button
                          className="btn-ghost p-2 rounded-xl hover:bg-surface-tertiary"
                          aria-label="More options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </>
          )}

          {activeTab === "requests" && (
            <>
              {/* Incoming Requests */}
              {mockRequests.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-display text-heading-sm mb-4">
                    Incoming Requests ({mockRequests.length})
                  </h3>
                  <div className="space-y-3">
                    {mockRequests.map((request, index) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass-card-hover p-4 rounded-2xl flex items-center gap-4"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-glow to-accent-magenta flex items-center justify-center font-display font-bold text-text-inverse">
                          {request.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-text-primary">
                            {request.username}
                          </div>
                          <div className="text-body-sm text-text-muted">
                            {request.mutualFriends} mutual friends \u2022{" "}
                            {request.sentAt}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="btn-primary gap-2 text-body-sm"
                            onClick={() => {}}
                          >
                            <Check className="w-4 h-4" />
                            Accept
                          </button>
                          <button
                            className="btn-secondary gap-2 text-body-sm"
                            onClick={() => {}}
                          >
                            <X className="w-4 h-4" />
                            Decline
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sent Requests */}
              <div>
                <h3 className="font-display text-heading-sm mb-4">
                  Sent Requests
                </h3>
                <div className="space-y-3">
                  {mockFriends
                    .filter((f) => f.sent && !f.isFriend)
                    .map((friend, index) => (
                      <motion.div
                        key={friend.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass-card-hover p-4 rounded-2xl flex items-center gap-4 opacity-60"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-glow to-accent-magenta flex items-center justify-center font-display font-bold text-text-inverse">
                          {friend.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-text-primary">
                            {friend.username}
                          </div>
                          <div className="text-body-sm text-text-muted">
                            Request sent \u2022 Pending
                          </div>
                        </div>
                        <button className="btn-ghost text-body-sm text-accent-red hover:bg-accent-red/10 gap-1">
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </motion.div>
                    ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "add" && (
            <div className="space-y-6">
              {/* Search */}
              <div className="glass-card-strong p-6 rounded-2xl">
                <h3 className="font-display text-heading-md mb-4">
                  Find Friends
                </h3>
                <div className="relative max-w-xl">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search by username or email..."
                    className="input pl-12 w-full"
                  />
                </div>
                <p className="text-text-secondary text-body-sm mt-3">
                  Enter a username or email to find and add friends.
                </p>
              </div>

              {/* Suggested Friends */}
              <div>
                <h3 className="font-display text-heading-sm mb-4">
                  Suggested for You
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mockFriends
                    .filter((f) => !f.isFriend && !f.pending && !f.sent)
                    .slice(0, 4)
                    .map((friend, index) => (
                      <motion.div
                        key={friend.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card-hover p-5 rounded-2xl text-center"
                      >
                        <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary-glow to-accent-magenta flex items-center justify-center font-display font-bold text-2xl text-text-inverse">
                          {friend.avatar}
                        </div>
                        <h4 className="font-medium text-text-primary">
                          {friend.username}
                        </h4>
                        <p className="text-text-secondary text-body-sm mt-1">
                          {friend.mutualFriends} mutual friends
                        </p>
                        <button className="btn-primary w-full mt-4 gap-2">
                          <UserPlus className="w-4 h-4" />
                          Add Friend
                        </button>
                      </motion.div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "blocked" && (
            <div className="text-center py-12">
              <UserX className="w-16 h-16 mx-auto mb-4 text-text-muted/50" />
              <h3 className="font-display text-heading-md mb-2">
                No blocked users
              </h3>
              <p className="text-text-secondary text-body">
                Users you block will appear here. You won't receive friend
                requests or messages from them.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            label: "Total Friends",
            value: mockFriends.filter((f) => f.isFriend).length,
            icon: Users,
            color: "text-primary-glow",
          },
          {
            label: "Online Now",
            value: mockFriends.filter(
              (f) => f.isFriend && f.status === "online",
            ).length,
            icon: Star,
            color: "text-accent-green",
          },
          {
            label: "Pending Requests",
            value: mockRequests.length,
            icon: UserPlus,
            color: "text-secondary-glow",
          },
          {
            label: "Sent Requests",
            value: mockFriends.filter((f) => f.sent && !f.isFriend).length,
            icon: MessageSquare,
            color: "text-accent-cyan",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="glass-card-hover p-6 rounded-2xl text-center"
          >
            <div
              className={`w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center ${stat.color}/20`}
            >
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
              className="font-display text-display-sm md:text-display-md"
            >
              {stat.value}
            </motion.div>
            <div className="text-text-secondary text-body-sm mt-1">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
