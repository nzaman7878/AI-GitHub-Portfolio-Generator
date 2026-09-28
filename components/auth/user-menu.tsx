"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useAuth } from "@/lib/use-auth";
import { SignInButton } from "@/components/auth/signin-button";
import {
  LogOut,
  LayoutDashboard,
  ExternalLink,
  Settings,
  ChevronDown,
  User as UserIcon,
} from "lucide-react";

export function UserMenu() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />;
  }

  if (!isAuthenticated || !user) {
    return <SignInButton size="default" />;
  }

  const userInitial = user.name
    ? user.name.charAt(0).toUpperCase()
    : (user.username?.charAt(0).toUpperCase() ?? "U");

  const portfolioUrl = user.username ? `/${user.username}` : "#";

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User navigation menu"
        className="flex items-center gap-2.5 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 cursor-pointer"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? user.username ?? "User avatar"}
            width={34}
            height={34}
            className="rounded-full ring-1 ring-zinc-200 dark:ring-zinc-700 object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center font-medium text-xs">
            {userInitial}
          </div>
        )}
        <span className="hidden sm:inline text-xs font-medium text-zinc-750 dark:text-zinc-300">
          {user.username ?? user.name}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl py-1.5 z-50 focus:outline-none animate-in fade-in zoom-in-95 duration-100"
        >
          {/* User profile header */}
          <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-900">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {user.name ?? user.username}
            </p>
            {user.username && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono truncate">
                @{user.username}
              </p>
            )}
            {user.email && (
              <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                {user.email}
              </p>
            )}
          </div>

          {/* Navigation links */}
          <div className="py-1">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              role="menuitem"
            >
              <LayoutDashboard className="w-4 h-4 text-zinc-500" />
              Dashboard
            </Link>

            {user.username && (
              <Link
                href={portfolioUrl}
                target="_blank"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                role="menuitem"
              >
                <span className="flex items-center gap-2.5">
                  <UserIcon className="w-4 h-4 text-zinc-500" />
                  View Public Portfolio
                </span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </Link>
            )}

            <Link
              href="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              role="menuitem"
            >
              <Settings className="w-4 h-4 text-zinc-500" />
              Settings
            </Link>
          </div>

          {/* Sign out action */}
          <div className="border-t border-zinc-100 dark:border-zinc-900 pt-1 mt-1">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer text-left"
              role="menuitem"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
