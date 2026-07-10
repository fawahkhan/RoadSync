import { Search, Info, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Utilities() {
  const utilities = [
    { name: 'City General Hospital', type: 'Hospital', distance: '1.2 km', status: 'Open 24/7' },
    { name: 'Central Fire Station', type: 'Fire Station', distance: '2.5 km', status: 'Active' },
    { name: 'Downtown Police Precinct', type: 'Police', distance: '0.8 km', status: 'Active' },
    { name: 'Public Restrooms - Park Plaza', type: 'Restroom', distance: '0.3 km', status: 'Open' },
    { name: 'EV Charging - Block B', type: 'EV Station', distance: '1.5 km', status: '2 Available' },
    { name: 'Community Center', type: 'Shelter', distance: '3.0 km', status: 'Open' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full h-full flex flex-col">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Public Utilities</h1>
          <p className="text-muted-foreground">Locate essential services and infrastructure nearby.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search hospitals, EV stations..." className="pl-9 bg-secondary/50 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {utilities.map((u, i) => (
          <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card hover:border-primary/50 transition-all cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="bg-secondary text-secondary-foreground">{u.type}</Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin size={12} className="mr-1" /> {u.distance}
                </div>
              </div>
              <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">{u.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-500 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  {u.status}
                </span>
                <Info size={16} className="text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}