import { Link } from 'react-router-dom';
import { Navigation2, Car, Leaf, ShieldAlert, MapPin, MessageSquare, Wrench, ArrowRight, Github } from 'lucide-react';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const features = [
    { icon: Car, title: 'Smart Parking', desc: 'Real-time spot detection & booking.', col: 'md:col-span-2' },
    { icon: Leaf, title: 'Track CO₂', desc: 'Calculate carbon footprint automatically.', col: 'md:col-span-1' },
    { icon: ShieldAlert, title: 'Report Incidents', desc: 'Crowdsourced safety alerts.', col: 'md:col-span-1' },
    { icon: MapPin, title: 'Route Optimization', desc: 'Traffic-aware navigation.', col: 'md:col-span-2' },
    { icon: MessageSquare, title: 'AI Assistant', desc: 'Gemini-powered insights.', col: 'md:col-span-3' },
  ];

  return (
    <div className="min-h-screen bg-background font-sans overflow-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Navigation2 className="text-primary w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">RoadSync</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/auth" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
            <Link to="/auth">
              <Button className="rounded-full shadow-[0_0_15px_rgba(var(--primary),0.3)]">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background z-[-1]" />
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="mb-6 flex justify-center">
            <Badge variant="secondary" className="px-3 py-1 text-xs tracking-widest uppercase bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              Introducing RoadSync 2.0
            </Badge>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-foreground">
            The intelligent operating <br className="hidden md:block"/> system for your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">city.</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Navigate smarter, park faster, and track your carbon footprint. All powered by community data and advanced AI.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="rounded-full h-14 px-8 text-base shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:shadow-[0_0_40px_rgba(var(--primary),0.5)] transition-shadow">
                Start Exploring <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <Button variant="outline" size="lg" className="rounded-full h-14 px-8 text-base border-border bg-background/50 backdrop-blur-sm">
                <Github className="mr-2 w-5 h-5" /> View Source
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Bento Grid */}
      <section className="px-6 py-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need. <span className="text-muted-foreground">In one place.</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div 
                key={i} 
                className={f.col}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-xl border-border/50 hover:bg-card/80 transition-all hover:border-primary/50 group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center border border-border shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                      <f.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{f.title}</CardTitle>
                    <CardDescription className="text-base">{f.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}