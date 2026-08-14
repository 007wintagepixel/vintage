"use client";

import { motion } from "framer-motion";
import {
  Bell,
  UserPlus,
  Gamepad2,
  Trophy,
  Settings,
  Check,
  Trash2,
} from "lucide-react";
import { useState } from "react";

type Filter = "all" | "unread" | "game" | "friends" | "system";
type NotifType =
  "friend_request" | "game_invite" | "tournament" | "achievement" | "system";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "friend_request",
    title: "New Friend Request",
    description: "NeonStriker wants to add you as a friend",
    timestamp: "5 min ago",
    read: false,
  },
  {
    id: "2",
    type: "game_invite",
    title: "Game Invitation",
    description: "VoidWalker invited you to a Classic 4P match",
    timestamp: "15 min ago",
    read: false,
  },
  {
    id: "3",
    type: "tournament",
    title: "Tournament Starting Soon",
    description:
      "Weekend Warriors Cup starts in 1 hour. Don't forget to check in!",
    timestamp: "30 min ago",
    read: false,
  },
  {
    id: "4",
    type: "achievement",
    title: "Achievement Unlocked!",
    description: 'You earned "Win Streak Master" — Win 5 matches in a row',
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "5",
    type: "system",
    title: "Account Security",
    description: "Your account was accessed from a new device",
    timestamp: "2 hours ago",
    read: true,
  },
  {
    id: "6",
    type: "game_invite",
    title: "Game Invitation",
    description: "CyberRogue invited you to a Quick 1v1 match",
    timestamp: "3 hours ago",
    read: true,
  },
  {
    id: "7",
    type: "friend_request",
    title: "New Friend Request",
    description: "PixelPhantom wants to add you as a friend",
    timestamp: "5 hours ago",
    read: true,
  },
  {
    id: "8",
    type: "tournament",
    title: "Tournament Results",
    description: "You placed #1 in the Daily Quick Cup! You won 1,200 coins",
    timestamp: "8 hours ago",
    read: true,
  },
  {
    id: "9",
    type: "achievement",
    title: "New Milestone",
    description: "You've reached 250 wins! Keep climbing",
    timestamp: "12 hours ago",
    read: true,
  },
  {
    id: "10",
    type: "system",
    title: "Maintenance Scheduled",
    description:
      "The game will undergo maintenance on Jan 20, 2:00-4:00 AM UTC",
    timestamp: "1 day ago",
    read: true,
  },
  {
    id: "11",
    type: "game_invite",
    title: "Game Invitation",
    description: "AstroBlitz invited you to a Team 2v2 match",
    timestamp: "1 day ago",
    read: true,
  },
  {
    id: "12",
    type: "system",
    title: "Welcome to Ludo Nexus",
    description: "Complete your profile to earn 500 bonus coins",
    timestamp: "2 days ago",
    read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<Filter>("all");

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "game")
      return n.type === "game_invite" || n.type === "tournament";
    if (filter === "friends") return n.type === "friend_request";
    if (filter === "system")
      return n.type === "system" || n.type === "achievement";
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: NotifType) => {
    switch (type) {
      case "friend_request":
        return {
          icon: UserPlus,
          color: "text-primary-glow",
          bg: "bg-primary-glow/20",
        };
      case "game_invite":
        return {
          icon: Gamepad2,
          color: "text-accent-magenta",
          bg: "bg-accent-magenta/20",
        };
      case "tournament":
        return {
          icon: Trophy,
          color: "text-secondary-glow",
          bg: "bg-secondary-glow/20",
        };
      case "achievement":
        return {
          icon: Trophy,
          color: "text-accent-green",
          bg: "bg-accent-green/20",
        };
      case "system":
        return {
          icon: Settings,
          color: "text-text-muted",
          bg: "bg-surface-tertiary",
        };
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
            Notifications
          </h1>
          <p className="text-text-secondary mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notifications`
              : "You're all caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-secondary gap-2">
            <Check className="w-4 h-4" />
            Mark All Read
          </button>
        )}
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 flex-wrap"
      >
        {[
          { id: "all" as Filter, label: "All", count: notifications.length },
          { id: "unread" as Filter, label: "Unread", count: unreadCount },
          {
            id: "game" as Filter,
            label: "Game",
            count: notifications.filter(
              (n) => n.type === "game_invite" || n.type === "tournament",
            ).length,
          },
          {
            id: "friends" as Filter,
            label: "Friends",
            count: notifications.filter((n) => n.type === "friend_request")
              .length,
          },
          {
            id: "system" as Filter,
            label: "System",
            count: notifications.filter(
              (n) => n.type === "system" || n.type === "achievement",
            ).length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-body-sm font-medium transition-all flex items-center gap-2 ${
              filter === tab.id
                ? "bg-primary-glow/20 text-primary-glow border border-primary-glow/30"
                : "glass-card text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-caption font-medium ${
                  filter === tab.id
                    ? "bg-primary-glow/30 text-primary-glow"
                    : "bg-surface-tertiary text-text-muted"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </motion.div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-strong p-12 rounded-2xl text-center"
          >
            <Bell className="w-16 h-16 mx-auto mb-4 text-text-muted/50" />
            <h3 className="font-display text-heading-md mb-2">
              No notifications
            </h3>
            <p className="text-text-secondary text-body">
              You have no notifications in this category.
            </p>
          </motion.div>
        ) : (
          filteredNotifications.map((notif, index) => {
            const { icon: Icon, color, bg } = getIcon(notif.type);
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`glass-card p-4 rounded-2xl flex items-start gap-4 transition-all ${
                  !notif.read
                    ? "ring-1 ring-primary-glow/20 bg-primary-glow/[0.03]"
                    : ""
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`font-medium ${notif.read ? "text-text-secondary" : "text-text-primary"}`}
                    >
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-primary-glow flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-body-sm text-text-secondary mt-1">
                    {notif.description}
                  </p>
                  <div className="text-caption text-text-muted mt-2">
                    {notif.timestamp}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="btn-ghost p-2 rounded-xl hover:bg-primary-glow/10 text-text-muted hover:text-primary-glow"
                      aria-label="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="btn-ghost p-2 rounded-xl hover:bg-accent-red/10 text-text-muted hover:text-accent-red"
                    aria-label="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
