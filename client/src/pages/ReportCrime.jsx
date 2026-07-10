import { ShieldAlert, AlertTriangle, Check, MapPin, Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ReportCrime() {
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto w-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-rose-500 flex items-center gap-3">
            <ShieldAlert size={28} /> Emergency Reporting
          </h1>
          <p className="text-muted-foreground">Submit anonymous reports to local authorities immediately.</p>
        </div>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.05)] overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-rose-500 to-orange-500" />
        <CardHeader>
          <CardTitle>Incident Details</CardTitle>
          <CardDescription>All reports are encrypted and sent to dispatch.</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Incident Type</Label>
              <Select>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="accident">Traffic Accident</SelectItem>
                  <SelectItem value="hazard">Road Hazard</SelectItem>
                  <SelectItem value="suspicious">Suspicious Activity</SelectItem>
                  <SelectItem value="medical">Medical Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Severity Level</Label>
              <Select>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select severity" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Non-urgent)</SelectItem>
                  <SelectItem value="medium">Medium (Needs attention)</SelectItem>
                  <SelectItem value="high">High (Immediate Danger)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Pinpoint address or intersection" className="pl-9 bg-secondary/50" />
              <Button variant="ghost" size="sm" className="absolute right-1 top-1 h-7 text-xs text-primary">Use GPS</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              placeholder="Provide any helpful details, vehicle descriptions, or context..." 
              className="min-h-[120px] bg-secondary/50 resize-none" 
            />
          </div>

          <div className="space-y-2">
            <Label>Media Evidence</Label>
            <div className="border-2 border-dashed border-border/50 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-secondary/20 transition-colors cursor-pointer">
              <Camera className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Click to upload photos or videos</p>
              <p className="text-xs text-muted-foreground mt-1">Maximum file size 50MB</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-secondary/20 border-t border-border/50 flex flex-col sm:flex-row gap-4 p-6">
          <div className="flex items-start gap-3 flex-1 text-xs text-muted-foreground">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p>Misuse of emergency reporting systems is a crime. False reports may lead to suspension.</p>
          </div>
          <Button variant="destructive" className="w-full sm:w-auto font-semibold">Submit Report</Button>
        </CardFooter>
      </Card>
    </div>
  );
}