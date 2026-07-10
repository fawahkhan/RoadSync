import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert, Car, Leaf, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { user } = useAuth();
  const mockData = [
    { name: 'Mon', emissions: 12 }, { name: 'Tue', emissions: 19 }, { name: 'Wed', emissions: 15 },
    { name: 'Thu', emissions: 22 }, { name: 'Fri', emissions: 18 }, { name: 'Sat', emissions: 28 }, { name: 'Sun', emissions: 24 }
  ];

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {user?.name || 'Citizen'}</h1>
        <p className="text-muted-foreground">Here is what's happening in your city today.</p>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'CO₂ Saved', val: '42 kg', icon: Leaf, col: 'text-emerald-500' },
          { title: 'Parking Booked', val: '12', icon: Car, col: 'text-blue-500' },
          { title: 'Incidents Reported', val: '3', icon: ShieldAlert, col: 'text-rose-500' },
          { title: 'Global Rank', val: '#4,291', icon: TrendingUp, col: 'text-amber-500' }
        ].map((stat, i) => (
          <motion.div variants={item} key={i}>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`w-4 h-4 ${stat.col}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.val}</div>
                <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={item} initial="hidden" animate="show">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Weekly Emissions Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData}>
                  <defs>
                    <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                    itemStyle={{ color: 'hsl(var(--primary))' }}
                  />
                  <Area type="monotone" dataKey="emissions" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorEmissions)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}