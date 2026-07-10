import { useState } from 'react';
import { emissionsAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, Leaf, ArrowRight, Zap, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';

export default function TrackEmissions() {
  const { refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '', carModel: '', engineSize: '', cylinders: '', fuelType: '', mileage: '', distance: '',
  });

  const carCompanies = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Tesla', 'Hyundai', 'Maruti Suzuki', 'Tata', 'Mahindra', 'Kia'];
  const engineSizes = ['1.0L', '1.2L', '1.5L', '2.0L', '2.5L', '3.0L', '4.0L'];
  const cylinderOptions = ['3', '4', '6', '8', '12'];

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        vehicle: { company: formData.companyName, model: formData.carModel, fuelType: formData.fuelType, engineCC: parseFloat(formData.engineSize) * 1000 || 0, cylinders: parseInt(formData.cylinders) || 0, mileage: parseFloat(formData.mileage) },
        trip: { distanceKm: parseFloat(formData.distance) },
      };
      const res = await emissionsAPI.calculate(payload);
      setResult({ co2Emitted: res.data.co2Grams, gemsEarned: res.data.gemsEarned, percentile: res.data.percentile, fuelConsumed: res.data.fuelConsumedLitres, aiAnalysis: res.data.record?.aiAnalysis });
      setStep(3);
      await refreshUser();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to calculate emissions. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Track CO₂ Emissions</h1>
        <p className="text-muted-foreground">Log a trip to calculate your carbon footprint and earn rewards.</p>
      </div>

      {/* Progress */}
      <div className="flex items-center mb-8 max-w-2xl mx-auto">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center flex-1 last:flex-none">
            <motion.div 
              layout
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                step >= num ? 'bg-primary border-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)]' : 'bg-secondary border-border text-muted-foreground'
              }`}
            >
              {step > num ? <CheckCircle size={18} /> : num}
            </motion.div>
            {num < 3 && (
              <div className="flex-1 h-1 mx-2 bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary" 
                  initial={{width: "0%"}} 
                  animate={{width: step > num ? "100%" : "0%"}} 
                  transition={{duration: 0.4}} 
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {error && (
        <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6 text-sm max-w-2xl mx-auto">
          {error}
        </motion.div>
      )}

      <Card className="max-w-2xl mx-auto bg-card/50 backdrop-blur-sm border-border/50 shadow-xl overflow-hidden relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <CardHeader>
                <CardTitle>Vehicle Details</CardTitle>
                <CardDescription>Tell us what you drive to estimate baseline efficiency.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Select value={formData.companyName} onValueChange={(v) => setFormData({...formData, companyName: v})}>
                    <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select brand" /></SelectTrigger>
                    <SelectContent>{carCompanies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Input placeholder="e.g. Civic" className="bg-secondary/50" value={formData.carModel} onChange={(e) => setFormData({...formData, carModel: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Engine Size</Label>
                  <Select value={formData.engineSize} onValueChange={(v) => setFormData({...formData, engineSize: v})}>
                    <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select size" /></SelectTrigger>
                    <SelectContent>{engineSizes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cylinders</Label>
                  <Select value={formData.cylinders} onValueChange={(v) => setFormData({...formData, cylinders: v})}>
                    <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select cylinders" /></SelectTrigger>
                    <SelectContent>{cylinderOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => setStep(2)}>Continue <ArrowRight className="ml-2 w-4 h-4" /></Button>
              </CardFooter>
            </motion.div>
          )}

          {step === 2 && (
            <motion.form key="step2" onSubmit={handleSubmit} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
                <CardDescription>Enter the specifics of your journey.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label>Fuel Type</Label>
                  <Select value={formData.fuelType} onValueChange={(v) => setFormData({...formData, fuelType: v})}>
                    <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select fuel" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="petrol">Petrol</SelectItem><SelectItem value="diesel">Diesel</SelectItem><SelectItem value="cng">CNG</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem><SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label>Distance (km)</Label>
                    <Input type="number" className="bg-secondary/50" placeholder="25" value={formData.distance} onChange={(e) => setFormData({...formData, distance: e.target.value})} required min="0.1" step="0.1" />
                  </div>
                  <div className="space-y-2">
                    <Label>Mileage (km/L)</Label>
                    <Input type="number" className="bg-secondary/50" placeholder="15" value={formData.mileage} onChange={(e) => setFormData({...formData, mileage: e.target.value})} required min="0.1" step="0.1" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button type="button" variant="outline" className="w-1/3" onClick={() => setStep(1)}>Back</Button>
                <Button type="submit" disabled={loading} className="w-2/3">
                  {loading ? 'Calculating...' : 'Calculate Emissions'}
                </Button>
              </CardFooter>
            </motion.form>
          )}

          {step === 3 && result && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", duration: 0.5 }}>
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
              <CardHeader className="text-center pb-2 pt-8">
                <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                  <Leaf className="w-8 h-8 text-emerald-500" />
                </div>
                <CardTitle className="text-3xl font-bold">{(result.co2Emitted / 1000).toFixed(2)} kg</CardTitle>
                <CardDescription>Total CO₂ Emitted ({result.fuelConsumed}L Fuel)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/50 p-4 rounded-xl text-center border border-border/50">
                    <Target className="w-5 h-5 mx-auto text-primary mb-2" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Efficiency</p>
                    <p className="text-lg font-bold text-foreground">Top {100 - result.percentile}%</p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-xl text-center border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
                    <Zap className="w-5 h-5 mx-auto text-primary mb-2" />
                    <p className="text-xs text-primary/70 uppercase tracking-wider">Rewards</p>
                    <p className="text-lg font-bold text-primary">+{result.gemsEarned} Gems</p>
                  </div>
                </div>

                {result.aiAnalysis && (
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                    <h3 className="font-semibold text-blue-400 text-sm mb-1 flex items-center gap-2">🤖 AI Insight</h3>
                    <p className="text-sm text-foreground/80 leading-relaxed">{result.aiAnalysis}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => {setStep(1); setResult(null);}}>Log Another Trip</Button>
              </CardFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}