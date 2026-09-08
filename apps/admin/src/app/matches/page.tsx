"use client";

import { Gamepad2 } from "lucide-react";

export default function MatchesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Gamepad2 className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            Matches
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage matches across the platform
          </p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
          Add Matche
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <p className="text-center text-gray-500 dark:text-gray-400 py-12">
          Matches management page - Coming soon
        </p>
      </div>
    </div>
  );
}
