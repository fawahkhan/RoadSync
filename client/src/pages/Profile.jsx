import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Settings, Save, Edit3, Shield, Star, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Profile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        {!editing ? (
          <Button variant="outline" onClick={() => setEditing(true)}><Edit3 className="mr-2 h-4 w-4" /> Edit</Button>
        ) : (
          <Button onClick={() => setEditing(false)}><Save className="mr-2 h-4 w-4" /> Save</Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-card/50 backdrop-blur-sm border-border/50 text-center">
          <CardContent className="pt-6">
            <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary/20 shadow-xl">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'default'}`} />
              <AvatarFallback>UX</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{user?.name || 'Citizen'}</h2>
            <p className="text-muted-foreground text-sm mb-4">{user?.email}</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold text-sm">
              <Star size={14} fill="currentColor" /> {user?.gems || 0} Gems
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Manage your account settings and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input defaultValue={user?.name} disabled={!editing} className="bg-secondary/50" />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input defaultValue={user?.email} disabled={!editing} className="bg-secondary/50" />
            </div>
            
            <div className="pt-6 mt-6 border-t border-border/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Award className="text-primary"/> Recent Badges</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1,2].map(i => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">🌟</div>
                    <div>
                      <p className="text-sm font-semibold">Eco Warrior</p>
                      <p className="text-xs text-muted-foreground">Saved 50kg CO₂</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}