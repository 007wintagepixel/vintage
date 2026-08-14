"use client";

import { motion } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  Moon,
  Monitor,
  Smartphone,
  Save,
  CheckCircle,
  AlertCircle,
  Users,
} from "lucide-react";
import { useState } from "react";

const themes = [
  {
    id: "dark",
    name: "Dark",
    icon: Moon,
    description: "Easy on the eyes for late night gaming",
  },
  {
    id: "light",
    name: "Light",
    icon: Monitor,
    description: "Bright and clean for daytime play",
  },
  {
    id: "system",
    name: "System",
    icon: Smartphone,
    description: "Follows your device preference",
  },
];

const languages = [
  { code: "en", name: "English", flag: "\uD83C\uDDFA\uD83C\uDDF8" },
  { code: "es", name: "Espa\u00F1ol", flag: "\uD83C\uDDEA\uD83C\uDDF8" },
  { code: "fr", name: "Fran\u00E7ais", flag: "\uD83C\uDDEB\uD83C\uDDF7" },
  { code: "de", name: "Deutsch", flag: "\uD83C\uDDE9\uD83C\uDDEA" },
  {
    code: "hi",
    name: "\u0939\u093F\u0928\u094D\u0926\u0940",
    flag: "\uD83C\uDDEE\uD83C\uDDF3",
  },
  { code: "zh", name: "\u4E2D\u6587", flag: "\uD83C\uDDE8\uD83C\uDDF3" },
  {
    code: "ar",
    name: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
    flag: "\uD83C\uDDE6\uD83C\uDDF3",
  },
  { code: "pt", name: "Portugu\u00EAs", flag: "\uD83C\uDDE7\uD83C\uDDF7" },
];

const accentColors = [
  { id: "cyan", name: "Cyan", value: "#22D3EE" },
  { id: "magenta", name: "Magenta", value: "#D946EF" },
  { id: "green", name: "Green", value: "#22C55E" },
  { id: "gold", name: "Gold", value: "#FBBF24" },
  { id: "orange", name: "Orange", value: "#F97316" },
  { id: "pink", name: "Pink", value: "#EC4899" },
];

export default function DashboardSettingsPage() {
  const [activeTab, setActiveTab] = useState<
    | "account"
    | "notifications"
    | "security"
    | "appearance"
    | "gaming"
    | "privacy"
  >("account");
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");
  const [accentColor, setAccentColor] = useState("cyan");
  const [animations, setAnimations] = useState(true);
  const [sound, setSound] = useState(true);
  const [music, setMusic] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const gamingSettings = { animations, sound, music, haptics };
  const [notifications, setNotifications] = useState({
    gameInvites: true,
    turnAlerts: true,
    tournamentUpdates: true,
    friendRequests: true,
    chatMessages: true,
    weeklyDigest: false,
    marketing: false,
  });
  const [security, setSecurity] = useState({
    twoFactor: false,
    biometric: true,
    sessionTimeout: 30,
    loginAlerts: true,
  });

  const handleSave = (_tab: string) => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
            Settings
          </h1>
          <p className="text-text-secondary mt-1">
            Customize your Ludo Nexus experience
          </p>
        </div>
        <button
          onClick={() => handleSave(activeTab)}
          disabled={saved}
          className="btn-primary gap-2"
        >
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
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
          <nav className="flex flex-wrap -mb-px" role="tablist">
            {[
              { id: "account", label: "Account", icon: User },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "security", label: "Security", icon: Shield },
              { id: "appearance", label: "Appearance", icon: Palette },
              { id: "gaming", label: "Gaming", icon: Globe },
              { id: "privacy", label: "Privacy", icon: Key },
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
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6" role="tabpanel">
          {/* Account Settings */}
          {activeTab === "account" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="font-display text-heading-lg">
                Profile Information
              </h2>
              <div className="glass-panel p-5 rounded-xl space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-glow to-accent-magenta flex items-center justify-center font-display font-bold text-2xl text-text-inverse">
                    P1
                  </div>
                  <div>
                    <label className="btn-secondary gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                      </svg>
                      Change Avatar
                    </label>
                    <p className="text-text-secondary text-body-sm mt-1">
                      JPG, PNG up to 5MB
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Username</label>
                    <input
                      type="text"
                      value="PlayerOne"
                      className="input"
                      disabled
                    />
                    <p className="text-text-secondary text-body-sm mt-1">
                      Cannot be changed
                    </p>
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input
                      type="email"
                      value="playerone@ludonexus.com"
                      className="input"
                      disabled
                    />
                    <p className="text-text-secondary text-body-sm mt-1">
                      Verified \u2713
                    </p>
                  </div>
                  <div>
                    <label className="label">Full Name</label>
                    <input type="text" value="Player One" className="input" />
                  </div>
                  <div>
                    <label className="label">Country</label>
                    <select className="input" defaultValue="US">
                      <option value="US">United States</option>
                      <option value="IN">India</option>
                      <option value="GB">United Kingdom</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => handleSave("account")}
                  className="btn-primary gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Profile
                </button>
              </div>

              <h2 className="font-display text-heading-lg mt-8">
                Referral Code
              </h2>
              <div className="glass-panel p-5 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-text-primary">
                      LUDO-NEXUS-7X9K
                    </div>
                    <p className="text-text-secondary text-body-sm">
                      Share to earn 500 coins per referral
                    </p>
                  </div>
                  <button className="btn-secondary gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2h-2M8 5a2 2 0 00-2 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2v-12a2 2 0 002-2h2"
                      />
                    </svg>
                    Copy
                  </button>
                </div>
              </div>

              <h2 className="font-display text-heading-lg mt-8">Danger Zone</h2>
              <div className="glass-panel p-5 rounded-xl border border-accent-red/30 bg-accent-red/5">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-accent-red flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-display text-heading-sm text-accent-red mb-2">
                      Delete Account
                    </h3>
                    <p className="text-text-secondary text-body-sm mb-4">
                      Permanently delete your account and all associated data.
                      This action cannot be undone.
                    </p>
                    <button className="btn-ghost gap-2 text-accent-red hover:bg-accent-red/10">
                      <AlertCircle className="w-4 h-4" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="font-display text-heading-lg">
                Notification Preferences
              </h2>
              <div className="glass-panel p-5 rounded-xl space-y-4">
                <h3 className="font-display text-heading-sm text-primary-glow">
                  Game Notifications
                </h3>
                {[
                  {
                    key: "gameInvites",
                    label: "Game Invites",
                    desc: "When friends invite you to play",
                  },
                  {
                    key: "turnAlerts",
                    label: "Turn Alerts",
                    desc: "When it's your turn in a match",
                  },
                  {
                    key: "tournamentUpdates",
                    label: "Tournament Updates",
                    desc: "Match start, results, bracket updates",
                  },
                  {
                    key: "friendRequests",
                    label: "Friend Requests",
                    desc: "New requests and accepted requests",
                  },
                  {
                    key: "chatMessages",
                    label: "Chat Messages",
                    desc: "New messages in games and private chats",
                  },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between py-3 border-b border-surface-border/50 last:border-0 cursor-pointer"
                  >
                    <div>
                      <div className="font-medium text-text-primary">
                        {item.label}
                      </div>
                      <div className="text-text-secondary text-body-sm">
                        {item.desc}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={
                        notifications[item.key as keyof typeof notifications]
                      }
                      onChange={(e) =>
                        setNotifications((prev) => ({
                          ...prev,
                          [item.key]: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 rounded border-surface-border bg-surface-tertiary text-primary-glow focus:ring-primary-glow focus:ring-2"
                    />
                  </label>
                ))}
              </div>
              <div className="glass-panel p-5 rounded-xl space-y-4">
                <h3 className="font-display text-heading-sm text-secondary-glow">
                  Marketing & Updates
                </h3>
                {[
                  {
                    key: "weeklyDigest",
                    label: "Weekly Digest",
                    desc: "Summary of your stats and upcoming tournaments",
                  },
                  {
                    key: "marketing",
                    label: "Marketing Emails",
                    desc: "News, promotions, and feature announcements",
                  },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between py-3 border-b border-surface-border/50 last:border-0 cursor-pointer"
                  >
                    <div>
                      <div className="font-medium text-text-primary">
                        {item.label}
                      </div>
                      <div className="text-text-secondary text-body-sm">
                        {item.desc}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={
                        notifications[item.key as keyof typeof notifications]
                      }
                      onChange={(e) =>
                        setNotifications((prev) => ({
                          ...prev,
                          [item.key]: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 rounded border-surface-border bg-surface-tertiary text-primary-glow focus:ring-primary-glow focus:ring-2"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="font-display text-heading-lg">
                Security Settings
              </h2>
              <div className="glass-panel p-5 rounded-xl space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-tertiary/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-glow/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary-glow" />
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">
                        Two-Factor Authentication
                      </div>
                      <div className="text-text-secondary text-body-sm">
                        Add an extra layer of security to your account
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={security.twoFactor}
                      onChange={(e) =>
                        setSecurity((prev) => ({
                          ...prev,
                          twoFactor: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-tertiary peer-focus:ring-2 peer-focus:ring-primary-glow rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-glow"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-tertiary/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-green/20 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-accent-green" />
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">
                        Biometric Login
                      </div>
                      <div className="text-text-secondary text-body-sm">
                        Use Face ID / Touch ID / Fingerprint
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={security.biometric}
                      onChange={(e) =>
                        setSecurity((prev) => ({
                          ...prev,
                          biometric: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-tertiary peer-focus:ring-2 peer-focus:ring-primary-glow rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-green"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-tertiary/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-glow/20 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-primary-glow" />
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">
                        Login Alerts
                      </div>
                      <div className="text-text-secondary text-body-sm">
                        Get notified when someone logs into your account
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={security.loginAlerts}
                      onChange={(e) =>
                        setSecurity((prev) => ({
                          ...prev,
                          loginAlerts: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-tertiary peer-focus:ring-2 peer-focus:ring-primary-glow rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-glow"></div>
                  </label>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl">
                <h3 className="font-display text-heading-sm mb-4">
                  Session Timeout
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[15, 30, 60].map((minutes) => (
                    <button
                      key={minutes}
                      onClick={() =>
                        setSecurity((prev) => ({
                          ...prev,
                          sessionTimeout: minutes,
                        }))
                      }
                      className={`p-4 rounded-xl text-center font-medium transition-all ${
                        security.sessionTimeout === minutes
                          ? "bg-primary-glow/20 text-primary-glow border border-primary-glow/30"
                          : "text-text-secondary hover:text-text-primary hover:bg-surface-tertiary"
                      }`}
                    >
                      <div className="font-display text-heading-sm">
                        {minutes} min
                      </div>
                      <div className="text-caption text-text-muted">
                        Auto-logout after inactivity
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl border border-accent-red/30 bg-accent-red/5">
                <h3 className="font-display text-heading-sm text-accent-red mb-4">
                  Danger Zone
                </h3>
                <button className="btn-ghost gap-2 text-accent-red hover:bg-accent-red/10 w-full">
                  <AlertCircle className="w-4 h-4" />
                  Revoke All Sessions
                </button>
                <p className="text-text-secondary text-body-sm mt-2 text-center">
                  Log out of all devices except this one.
                </p>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeTab === "appearance" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="font-display text-heading-lg">Appearance</h2>
              <div className="glass-panel p-5 rounded-xl space-y-6">
                <h3 className="font-display text-heading-sm">Theme</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`p-5 rounded-xl text-center transition-all ${
                        theme === t.id
                          ? "bg-primary-glow/20 text-primary-glow border-2 border-primary-glow"
                          : "text-text-secondary hover:text-text-primary hover:bg-surface-tertiary border border-surface-border"
                      }`}
                    >
                      <t.icon className="w-10 h-10 mx-auto mb-3" />
                      <div className="font-medium text-text-primary">
                        {t.name}
                      </div>
                      <div className="text-body-sm text-text-muted mt-1">
                        {t.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl space-y-6">
                <h3 className="font-display text-heading-sm">Accent Color</h3>
                <div className="flex flex-wrap gap-3">
                  {accentColors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setAccentColor(c.id)}
                      className={`w-12 h-12 rounded-xl transition-all ${
                        accentColor === c.id
                          ? "ring-2 ring-primary-glow scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: c.value }}
                      aria-label={c.name}
                    />
                  ))}
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl space-y-6">
                <h3 className="font-display text-heading-sm">Language</h3>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="input w-full md:w-64"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="glass-panel p-5 rounded-xl space-y-4">
                <h3 className="font-display text-heading-sm">Visual Effects</h3>
                <div className="space-y-3">
                  {[
                    {
                      key: "animations",
                      label: "Animations",
                      desc: "Smooth transitions and micro-interactions",
                    },
                    {
                      key: "sound",
                      label: "Sound Effects",
                      desc: "Game sounds, dice rolls, celebrations",
                    },
                    {
                      key: "music",
                      label: "Background Music",
                      desc: "Ambient music in menus and lobbies",
                    },
                    {
                      key: "haptics",
                      label: "Haptics",
                      desc: "Vibration feedback on mobile devices",
                    },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center justify-between py-2 border-b border-surface-border/50 last:border-0 cursor-pointer"
                    >
                      <div>
                        <div className="font-medium text-text-primary">
                          {item.label}
                        </div>
                        <div className="text-text-secondary text-body-sm">
                          {item.desc}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={
                          gamingSettings[
                            item.key as keyof typeof gamingSettings
                          ]
                        }
                        onChange={(e) => {
                          if (item.key === "animations")
                            setAnimations(e.target.checked);
                          else if (item.key === "sound")
                            setSound(e.target.checked);
                          else if (item.key === "music")
                            setMusic(e.target.checked);
                          else if (item.key === "haptics")
                            setHaptics(e.target.checked);
                        }}
                        className="w-5 h-5 rounded border-surface-border bg-surface-tertiary text-primary-glow focus:ring-primary-glow focus:ring-2"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Gaming */}
          {activeTab === "gaming" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="font-display text-heading-lg">
                Gaming Preferences
              </h2>
              <div className="glass-panel p-5 rounded-xl space-y-6">
                <h3 className="font-display text-heading-sm">
                  Default Game Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-surface-tertiary/50">
                    <div>
                      <div className="font-medium text-text-primary">
                        Auto-ready in private rooms
                      </div>
                      <div className="text-text-secondary text-body-sm">
                        Automatically mark ready when joining private matches
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded border-surface-border bg-surface-tertiary text-primary-glow focus:ring-primary-glow focus:ring-2"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-surface-tertiary/50">
                    <div>
                      <div className="font-medium text-text-primary">
                        Show legal move highlights
                      </div>
                      <div className="text-text-secondary text-body-sm">
                        Highlight tokens that can be moved on your turn
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded border-surface-border bg-surface-tertiary text-primary-glow focus:ring-primary-glow focus:ring-2"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-surface-tertiary/50">
                    <div>
                      <div className="font-medium text-text-primary">
                        Confirm moves before sending
                      </div>
                      <div className="text-text-secondary text-body-sm">
                        Require tap confirmation before submitting a move
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-surface-border bg-surface-tertiary text-primary-glow focus:ring-primary-glow focus:ring-2"
                    />
                  </div>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl">
                <h3 className="font-display text-heading-sm mb-4">
                  AI Difficulty Preference
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    {
                      id: "easy",
                      name: "Easy",
                      desc: "Learning the basics",
                      color: "text-accent-green",
                    },
                    {
                      id: "medium",
                      name: "Medium",
                      desc: "Tactical captures & safety",
                      color: "text-primary-glow",
                    },
                    {
                      id: "hard",
                      name: "Hard",
                      desc: "Risk assessment & blocking",
                      color: "text-accent-red",
                    },
                  ].map((diff) => (
                    <button
                      key={diff.id}
                      className={`p-4 rounded-xl text-center transition-all border ${
                        diff.id === "medium"
                          ? "bg-primary-glow/20 text-primary-glow border-primary-glow/30"
                          : "text-text-secondary hover:text-text-primary hover:bg-surface-tertiary border-surface-border"
                      }`}
                    >
                      <div
                        className={`font-display text-heading-sm ${diff.color}`}
                      >
                        {diff.name}
                      </div>
                      <div className="text-body-sm text-text-muted mt-1">
                        {diff.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl">
                <h3 className="font-display text-heading-sm mb-4">
                  Default Match Type
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    {
                      name: "Quick Match",
                      desc: "2-4 players, skill-based",
                      icon: Users,
                    },
                    {
                      name: "Practice vs AI",
                      desc: "Solo with bots",
                      icon: Globe,
                    },
                    {
                      name: "Private Room",
                      desc: "Custom rules with friends",
                      icon: Smartphone,
                    },
                  ].map((item) => (
                    <button className="p-4 rounded-xl border border-surface-border hover:border-primary-glow/50 hover:bg-surface-tertiary transition-all text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-glow/20 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-primary-glow" />
                        </div>
                        <div>
                          <div className="font-medium text-text-primary">
                            {item.name}
                          </div>
                          <div className="text-text-secondary text-body-sm">
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Privacy */}
          {activeTab === "privacy" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="font-display text-heading-lg">Privacy Settings</h2>
              <div className="glass-panel p-5 rounded-xl space-y-6">
                <h3 className="font-display text-heading-sm">
                  Profile Visibility
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      label: "Show profile to everyone",
                      desc: "Allow all players to view your profile and stats",
                    },
                    {
                      label: "Show online status",
                      desc: "Let friends see when you're online or in a game",
                    },
                    {
                      label: "Show match history",
                      desc: "Display your recent games on your profile",
                    },
                    {
                      label: "Show in leaderboards",
                      desc: "Appear in public leaderboards and rankings",
                    },
                  ].map((item, index) => (
                    <label
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-surface-border/50 last:border-0 cursor-pointer"
                    >
                      <div>
                        <div className="font-medium text-text-primary">
                          {item.label}
                        </div>
                        <div className="text-text-secondary text-body-sm">
                          {item.desc}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 rounded border-surface-border bg-surface-tertiary text-primary-glow focus:ring-primary-glow focus:ring-2"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl space-y-6">
                <h3 className="font-display text-heading-sm">
                  Data & Communications
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      label: "Allow friend requests from anyone",
                      desc: "Anyone can send you a friend request",
                    },
                    {
                      label: "Allow game invites from anyone",
                      desc: "Receive game invites from non-friends",
                    },
                    {
                      label: "Receive marketing emails",
                      desc: "News, updates, and special offers",
                    },
                    {
                      label: "Share usage analytics",
                      desc: "Help us improve with anonymous usage data",
                    },
                  ].map((item, index) => (
                    <label
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-surface-border/50 last:border-0 cursor-pointer"
                    >
                      <div>
                        <div className="font-medium text-text-primary">
                          {item.label}
                        </div>
                        <div className="text-text-secondary text-body-sm">
                          {item.desc}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked={index < 2}
                        className="w-5 h-5 rounded border-surface-border bg-surface-tertiary text-primary-glow focus:ring-primary-glow focus:ring-2"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl border border-accent-red/30 bg-accent-red/5">
                <h3 className="font-display text-heading-sm text-accent-red mb-4">
                  Data Management
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button className="btn-ghost gap-2 text-accent-red hover:bg-accent-red/10">
                    <AlertCircle className="w-4 h-4" />
                    Download My Data
                  </button>
                  <button className="btn-ghost gap-2 text-accent-red hover:bg-accent-red/10">
                    <AlertCircle className="w-4 h-4" />
                    Delete My Data
                  </button>
                </div>
                <p className="text-text-secondary text-body-sm mt-3">
                  Request a copy of your personal data or request deletion per
                  GDPR/CCPA.
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
