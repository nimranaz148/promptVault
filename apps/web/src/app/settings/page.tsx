"use client";

import Link from "next/link";
import { Search, Bell, Settings, User, Lock, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useRef } from "react";
import { toast } from "sonner";
import { useMe, useUpdateProfile, useUploadAvatar } from "@/hooks/useProfile";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useMe();
  const updateMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setUsername(profile.username || "");
      setBio(profile.bio || "");
    }
  }, [profile]);

  const handleSave = async () => {
    if (profile) {
      await updateMutation.mutateAsync({
        display_name: displayName,
        bio,
      });
      toast.success("Profile updated successfully!");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    try {
      await uploadAvatarMutation.mutateAsync(file);
      toast.success("Profile picture updated!");
    } catch (err) {
      toast.error("Failed to update profile picture");
      console.error(err);
    }
  };

  const handleNotifyClick = () => {
    toast.info("No new notifications yet.");
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading settings...</div>;
  }

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center text-destructive">Failed to load profile. Please log in.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header */}
      <header className="h-16 border-b border-border/50 bg-card flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-display font-bold text-xl text-primary">PromptVault</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/app" className="text-muted-foreground hover:text-foreground">Library</Link>
            <Link href="/community" className="text-muted-foreground hover:text-foreground">Discover</Link>
          </nav>
        </div>
        
        <div className="flex-1 max-w-xl px-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search prompts..." 
              className="pl-9 bg-muted/30 border-none h-10 w-full focus-visible:ring-1 focus-visible:ring-border rounded-full"
            />
          </div>
        </div>

        <div className="flex justify-end items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={handleNotifyClick}>
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-primary bg-primary/10">
            <Settings className="w-5 h-5" />
          </Button>
          <Link href="/app">
            <div className="w-8 h-8 rounded-full bg-primary/20 overflow-hidden cursor-pointer border border-border ring-2 ring-primary ring-offset-2 ring-offset-background">
              <img src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} alt="User" className="w-full h-full object-cover" />
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
          
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-2">Manage your profile, account preferences, and integrations.</p>
          </div>
          
          {/* Profile Settings */}
          <Card className="p-8 shadow-sm border-border/60 space-y-6 bg-card">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Profile</h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="shrink-0 flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full overflow-hidden border border-border/50 bg-muted">
                  <img src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/webp" 
                  onChange={handleFileChange}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadAvatarMutation.isPending}
                >
                  {uploadAvatarMutation.isPending ? "Uploading..." : "Change"}
                </Button>
              </div>
              
              <div className="flex-1 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Display Name</Label>
                  <Input 
                    id="displayName" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-background" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Username</Label>
                  <Input 
                    id="username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-background" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bio</Label>
                  <Textarea 
                    id="bio" 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="bg-background resize-none h-24" 
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button 
                    className="px-8 shadow-md"
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Account Settings */}
          <Card className="p-8 shadow-sm border-border/60 space-y-6 bg-card">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <Lock className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Account</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between py-2 border-b border-border/30">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Email Address</p>
                  <p className="text-sm font-medium text-foreground">{user?.email || "Unknown Email"}</p>
                </div>
                <Button variant="link" className="text-primary px-0">Edit</Button>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-border/30 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Change Password</p>
                </div>
                <span className="text-muted-foreground group-hover:text-foreground">›</span>
              </div>
              
              <div className="space-y-3 pt-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Connected Accounts</p>
                <div className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-muted/20">
                  <div className="flex items-center gap-4">
                    {/* Google SVG */}
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Google</p>
                      <p className="text-xs text-green-500 font-medium">Connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="bg-background">Disconnect</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-8 shadow-sm border-red-500/20 bg-red-500/5 space-y-6">
            <div className="flex items-center gap-3 border-b border-red-500/10 pb-4">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Delete Account</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">Permanently remove your account and all stored prompts. This action is irreversible.</p>
              </div>
              <Button variant="outline" className="border-red-500/30 text-red-600 hover:bg-red-500 hover:text-white shrink-0">
                Delete account
              </Button>
            </div>
          </Card>
          
        </div>
      </main>

      <footer className="py-8 text-center text-xs text-muted-foreground font-medium border-t border-border/50 bg-card">
        <p>© 2026 PromptVault Creative Engine. All rights reserved.</p>
        <div className="flex items-center justify-center gap-4 mt-3">
          <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
          <Link href="#" className="hover:text-foreground">Terms of Service</Link>
          <Link href="#" className="hover:text-foreground">Support</Link>
        </div>
      </footer>
    </div>
  );
}
