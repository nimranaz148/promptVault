"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function UserMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const handleLogoutClick = () => {
    setMenuOpen(false);
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        <div 
          className="w-8 h-8 rounded-full bg-primary/20 overflow-hidden cursor-pointer border border-border transition-transform hover:scale-105 active:scale-95"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
        </div>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-xl z-50 py-1 animate-in fade-in-0 zoom-in-95">
            <Link href="/settings" onClick={() => setMenuOpen(false)}>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                <User className="w-4 h-4" /> Settings
              </button>
            </Link>
            <div className="border-t border-border/60 my-1" />
            <button
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              onClick={handleLogoutClick}
            >
              <LogOut className="w-4 h-4" /> Log out
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
        description="Are you sure you want to log out of your account?"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowLogoutModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmLogout}>
              Log out
            </Button>
          </>
        }
      />
    </>
  );
}
