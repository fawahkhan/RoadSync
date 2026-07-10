import { Github, Twitter, Mail, Navigation2, Code2, Cpu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full text-center">
      <div className="mb-12 pt-8">
        <div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(var(--primary),0.2)]">
          <Navigation2 className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">About RoadSync</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          RoadSync is an open-source intelligent city operating system designed to make urban mobility smarter, safer, and greener.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <Code2 className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Open Source</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Built by the community, for the community. RoadSync's codebase is transparent and driven by contributors worldwide.
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <Cpu className="w-8 h-8 text-primary mb-2" />
            <CardTitle>AI Powered</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Integrating state-of-the-art models like Gemini to analyze traffic patterns and reduce your carbon footprint dynamically.
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <Navigation2 className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Next-Gen Mobility</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            From smart parking allocation to emergency routing, we're building the infrastructure of tomorrow.
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center gap-4">
        <Button variant="outline" className="gap-2"><Github size={18}/> GitHub</Button>
        <Button variant="outline" className="gap-2"><Twitter size={18}/> Twitter</Button>
        <Button variant="outline" className="gap-2"><Mail size={18}/> Contact Us</Button>
      </div>
    </div>
  );
}