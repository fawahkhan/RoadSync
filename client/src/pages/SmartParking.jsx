import { useState } from 'react';
import { Car, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SmartParking() {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Smart Parking</h1>
        <p className="text-muted-foreground">Find and book parking spots near you in seconds.</p>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden shadow-xl">
        <div className="h-48 bg-[url('https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <CardHeader className="-mt-10 relative z-10">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <Car size={20} className="text-primary-foreground" />
            </div>
            Reserve a Spot
          </CardTitle>
          <CardDescription>Enter details below to find available real-time parking.</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 mt-2">
          <div className="space-y-2">
            <Label>Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Enter destination..." 
                className="pl-9 bg-secondary/50" 
                value={location} onChange={(e) => setLocation(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Check-in</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input type="time" className="pl-9 bg-secondary/50" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Check-out</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input type="time" className="pl-9 bg-secondary/50" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full text-base h-12">Search Availability</Button>
        </CardFooter>
      </Card>
    </div>
  );
}