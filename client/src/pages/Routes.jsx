import { useState } from 'react';
import { MapPin, Navigation, TrafficCone } from 'lucide-react';
import { GoogleMap, useLoadScript, DirectionsRenderer, TrafficLayer } from '@react-google-maps/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const libraries = ['places'];
const mapContainerStyle = { width: '100%', height: '100%', borderRadius: 'var(--radius)' };
const center = { lat: 28.6139, lng: 77.2090 };

export default function RoutesPage() {
  const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, libraries });
  const [directions, setDirections] = useState(null);
  const [showTraffic, setShowTraffic] = useState(true);

  if (loadError) return <div className="p-8 max-w-6xl mx-auto w-full text-destructive">Error loading maps. Check API Key.</div>;
  if (!isLoaded) return <div className="p-8 max-w-6xl mx-auto w-full text-muted-foreground animate-pulse">Loading Map Environment...</div>;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full h-full flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2"><Navigation size={28} className="text-primary"/> Live Routes</h1>
          <p className="text-muted-foreground">Plan your journey with real-time directions and traffic info.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-[500px]">
        {/* Controls */}
        <Card className="lg:col-span-1 bg-card/50 backdrop-blur-sm border-border/50 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Trip Planner</CardTitle>
            <CardDescription>Enter locations to get optimal routes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
                <Input placeholder="Starting point..." className="pl-9 bg-secondary/50" />
              </div>
              <div className="w-0.5 h-4 bg-border mx-auto"></div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-rose-500" />
                <Input placeholder="Destination..." className="pl-9 bg-secondary/50" />
              </div>
            </div>
            
            <Button className="w-full">Get Directions</Button>

            <div className="pt-4 border-t border-border/50 mt-4">
              <Button variant="outline" className="w-full flex gap-2" onClick={() => setShowTraffic(!showTraffic)}>
                <TrafficCone size={16} className={showTraffic ? 'text-amber-500' : 'text-muted-foreground'} />
                {showTraffic ? 'Hide Traffic' : 'Show Traffic'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Map */}
        <Card className="lg:col-span-3 p-1 bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden relative">
          <div className="absolute inset-0 m-1 rounded-[var(--radius)] overflow-hidden shadow-inner border border-border">
            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={12} center={center} options={{ disableDefaultUI: true, zoomControl: true, styles: [ { "elementType": "geometry", "stylers": [{ "color": "#1A1A2E" }] }, { "elementType": "labels.text.stroke", "stylers": [{ "color": "#1A1A2E" }] }, { "elementType": "labels.text.fill", "stylers": [{ "color": "#9CA3AF" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#2C2C4A" }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#374151" }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#4B5563" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0F172A" }] } ]}}>
              {directions && <DirectionsRenderer directions={directions} options={{ polylineOptions: { strokeColor: '#0D9488', strokeWeight: 5 } }} />}
              {showTraffic && <TrafficLayer />}
            </GoogleMap>
          </div>
        </Card>
      </div>
    </div>
  );
}
