import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { 
  AlertTriangle, 
  Cone, 
  Car, 
  Waves, 
  AlertOctagon, 
  Flame, 
  Navigation, 
  Crosshair, 
  Plus, 
  Minus,
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  X, 
  Camera, 
  CheckCircle2, 
  ChevronRight,
  MapPin,
  Clock,
  SlidersHorizontal,
  ChevronUp,
  ArrowLeft,
  Filter,
  Eye,
  Check
} from 'lucide-react';
import { StorageService } from '../services/storageService';

// Category metadata
const CATEGORIES = [
  { id: 'all', label: 'All', icon: AlertOctagon, color: '#10B981', symbol: 'ALL' },
  { id: 'accident', label: 'Accident', icon: AlertTriangle, color: '#EF4444', symbol: '⚠️' },
  { id: 'construction', label: 'Construction', icon: Cone, color: '#F97316', symbol: '🚧' },
  { id: 'pothole', label: 'Pothole', icon: AlertOctagon, color: '#F59E0B', symbol: '🕳️' },
  { id: 'flooding', label: 'Flooding', icon: Waves, color: '#3B82F6', symbol: '🌊' },
  { id: 'traffic', label: 'Traffic Jam', icon: Car, color: '#EC4899', symbol: '🚗' },
  { id: 'danger', label: 'Danger', icon: Flame, color: '#8B5CF6', symbol: '❗' },
];

export default function HazardRadar() {
  const navigate = useNavigate();
  const [hazards, setHazards] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userLocation, setUserLocation] = useState([28.6250, 77.1950]); // Default Delhi center
  const [hasGPS, setHasGPS] = useState(false);
  const [selectedHazard, setSelectedHazard] = useState(null);
  const [isReporting, setIsReporting] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterRadius, setFilterRadius] = useState('all'); // '2', '5', '10', 'all'
  const [filterSeverity, setFilterSeverity] = useState('all'); // 'all', 'high'
  const [newComment, setNewComment] = useState('');
  const [reportForm, setReportForm] = useState({
    category: 'accident',
    title: '',
    locationName: '',
    description: '',
    severity: 'high',
    imageUrl: null
  });

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);

  // Load initial hazards
  useEffect(() => {
    const list = StorageService.getHazards();
    setHazards(list);

    // Attempt browser Geolocation
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(coords);
          setHasGPS(true);
        },
        (err) => console.log('Geolocation skipped or unavailable:', err.message),
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: userLocation,
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Dark Matter tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      mapInstanceRef.current = map;
    }
  }, [mapContainerRef]);

  // Update user location pulse on map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    // Custom pulsing user GPS marker with radar ripple
    const userIcon = L.divIcon({
      className: 'custom-user-gps',
      html: `
        <div class="relative flex items-center justify-center w-10 h-10">
          <div class="absolute w-10 h-10 bg-blue-500/25 rounded-full animate-radar"></div>
          <div class="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg"></div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    userMarkerRef.current = L.marker(userLocation, { icon: userIcon }).addTo(map);
  }, [userLocation]);

  // Render hazard markers on map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const filtered = hazards.filter(h => {
      if (selectedCategory !== 'all' && h.category !== selectedCategory) return false;
      if (filterSeverity === 'high' && h.severity !== 'high') return false;
      if (filterRadius !== 'all') {
        const distKm = parseFloat(calculateDistanceNumber(h.lat, h.lng));
        if (distKm > parseFloat(filterRadius)) return false;
      }
      return true;
    });

    filtered.forEach(h => {
      const catConfig = CATEGORIES.find(c => c.id === h.category) || CATEGORIES[1];
      
      const markerIcon = L.divIcon({
        className: 'custom-hazard-pin',
        html: `
          <div class="cursor-pointer transform hover:scale-115 transition-transform flex flex-col items-center">
            <div style="background-color: ${catConfig.color};" class="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-xl border-2 border-[#131B2A]">
              <span class="text-sm font-bold">${catConfig.symbol}</span>
            </div>
            <div class="w-1.5 h-1.5 rounded-full mt-0.5" style="background-color: ${catConfig.color};"></div>
          </div>
        `,
        iconSize: [36, 42],
        iconAnchor: [18, 40]
      });

      const marker = L.marker([h.lat, h.lng], { icon: markerIcon }).addTo(map);
      marker.on('click', () => {
        setSelectedHazard(h);
        map.panTo([h.lat, h.lng], { animate: true, duration: 0.5 });
      });

      markersRef.current.push(marker);
    });
  }, [hazards, selectedCategory, filterRadius, filterSeverity]);

  // Zoom controls
  function handleZoomIn() {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  }

  function handleZoomOut() {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  }

  // Pan to user location
  function handleRecenter() {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(userLocation, 14, { duration: 0.8 });
    }
  }

  // Calculate distance in number (km)
  function calculateDistanceNumber(lat, lng) {
    const [uLat, uLng] = userLocation;
    const rad = Math.PI / 180;
    const dLat = (lat - uLat) * rad;
    const dLng = (lng - uLng) * rad;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(uLat * rad) * Math.cos(lat * rad) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (6371 * c).toFixed(1);
  }

  // Formatted distance display string
  function calculateDistance(lat, lng) {
    const d = parseFloat(calculateDistanceNumber(lat, lng));
    return d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`;
  }

  // Upvote hazard
  function handleUpvote(id, e) {
    e?.stopPropagation();
    const updated = StorageService.upvoteHazard(id);
    if (updated) {
      setHazards([...StorageService.getHazards()]);
      if (selectedHazard && selectedHazard.id === id) {
        setSelectedHazard({ ...selectedHazard, upvotes: updated.upvotes });
      }
    }
  }

  // Post comment
  function handleAddComment(e) {
    e.preventDefault();
    if (!newComment.trim() || !selectedHazard) return;
    const updated = StorageService.addComment(selectedHazard.id, newComment.trim(), 'You');
    if (updated) {
      setHazards([...StorageService.getHazards()]);
      setSelectedHazard({ ...updated });
      setNewComment('');
    }
  }

  // Handle report submission
  function handleSubmitReport(e) {
    e.preventDefault();
    const [lat, lng] = userLocation;
    const jitterLat = lat + (Math.random() - 0.5) * 0.01;
    const jitterLng = lng + (Math.random() - 0.5) * 0.01;

    const catObj = CATEGORIES.find(c => c.id === reportForm.category) || CATEGORIES[1];

    const newH = StorageService.addHazard({
      category: reportForm.category,
      title: reportForm.title || `${catObj.label} Reported`,
      locationName: reportForm.locationName || 'Near Current Location',
      lat: jitterLat,
      lng: jitterLng,
      description: reportForm.description || 'Observed hazard on roadway.',
      severity: reportForm.severity,
      imageUrl: reportForm.imageUrl
    });

    setHazards([...StorageService.getHazards()]);
    setIsReporting(false);
    setSelectedHazard(newH);
    setReportForm({
      category: 'accident',
      title: '',
      locationName: '',
      description: '',
      severity: 'high',
      imageUrl: null
    });

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([jitterLat, jitterLng], 15);
    }
  }

  // Handle mock photo upload
  function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setReportForm(prev => ({ ...prev, imageUrl: ev.target.result }));
      };
      reader.readAsDataURL(file);
    }
  }

  // Share report via Web Share or clipboard
  function handleShare(hazard) {
    const text = `⚠️ Road Hazard Alert: ${hazard.title} at ${hazard.locationName}. Verified on RoadSync!`;
    if (navigator.share) {
      navigator.share({ title: 'RoadSync Alert', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Alert details copied to clipboard!');
    }
  }

  const filteredHazards = hazards.filter(h => {
    if (selectedCategory !== 'all' && h.category !== selectedCategory) return false;
    if (filterSeverity === 'high' && h.severity !== 'high') return false;
    if (filterRadius !== 'all') {
      const distKm = parseFloat(calculateDistanceNumber(h.lat, h.lng));
      if (distKm > parseFloat(filterRadius)) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col h-screen w-full bg-[#0B0F17] relative select-none">
      {/* Top Header matching reference screen 2 */}
      <div className="z-20 bg-[#0B0F17] px-4 pt-3 pb-2 border-b border-[#1E2B40] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')} 
            className="p-1.5 rounded-lg bg-[#162032] text-slate-300 hover:text-white active:scale-95 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              Live Hazard Radar
            </h1>
            <p className="text-[11px] text-slate-400">
              {filteredHazards.length} active road reports nearby
            </p>
          </div>
        </div>

        {/* Filter Pill Button (Screen 2 Mockup Match) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10B981] text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
          >
            <Filter size={13} />
            <span>Filter</span>
          </button>

          <button
            onClick={() => setIsReporting(true)}
            className="flex items-center gap-1 p-1.5 rounded-xl bg-[#162032] border border-[#1E2B40] text-slate-200 hover:text-white active:scale-95 transition-all"
            title="Report Hazard"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Category Filter Pills (Horizontal Scroll matching Screen 2) */}
      <div className="z-20 bg-[#0B0F17] px-3 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none border-b border-[#1E2B40]/60">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all active:scale-95 ${
                isSelected
                  ? 'bg-[#10B981] text-white font-semibold shadow-md'
                  : 'bg-[#141C2B] text-slate-300 border border-[#1E2B40] hover:bg-[#1B2538]'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Map Canvas */}
      <div className="flex-1 w-full relative">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Map Controls on Right (Mockup Screen 2) */}
        <div className="absolute right-3.5 top-4 z-[1000] flex flex-col gap-2">
          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            className="w-9 h-9 rounded-xl bg-[#131B2A] text-white shadow-xl border border-[#1E2B40] flex items-center justify-center active:scale-90 transition-transform"
            title="Zoom In"
          >
            <Plus size={18} />
          </button>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            className="w-9 h-9 rounded-xl bg-[#131B2A] text-white shadow-xl border border-[#1E2B40] flex items-center justify-center active:scale-90 transition-transform"
            title="Zoom Out"
          >
            <Minus size={18} />
          </button>

          {/* Recenter GPS */}
          <button
            onClick={handleRecenter}
            className="w-9 h-9 rounded-xl bg-[#131B2A] text-white shadow-xl border border-[#1E2B40] flex items-center justify-center active:scale-90 transition-transform mt-2"
            title="Recenter GPS"
          >
            <Crosshair size={18} className="text-[#10B981]" />
          </button>
        </div>
      </div>

      {/* Bottom Nearby Reports Drawer (Mockup Screen 2 Bottom) */}
      <div className="z-20 bg-[#101726] border-t border-[#1E2B40] max-h-64 flex flex-col shadow-2xl rounded-t-3xl">
        <div className="w-12 h-1 bg-slate-600 rounded-full mx-auto mt-2 mb-1" />

        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white">Nearby Reports</h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#162032] text-[#10B981] font-semibold">
              {filteredHazards.length}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Tap card to inspect</span>
        </div>

        {/* Reports Scroll List */}
        <div className="overflow-y-auto px-4 pb-4 space-y-2.5">
          {filteredHazards.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No reports matching your filter. Road is clear!
            </div>
          ) : (
            filteredHazards.map(h => {
              const catConfig = CATEGORIES.find(c => c.id === h.category) || CATEGORIES[1];
              const CatIcon = catConfig.icon;

              return (
                <div
                  key={h.id}
                  onClick={() => {
                    setSelectedHazard(h);
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.flyTo([h.lat, h.lng], 15);
                    }
                  }}
                  className="p-3 rounded-2xl bg-[#141C2B] border border-[#1E2B40] hover:border-[#10B981]/50 cursor-pointer transition-all active:scale-[0.99] flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      {h.imageUrl ? (
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-[#1E2B40]">
                          <img src={h.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div 
                          style={{ backgroundColor: `${catConfig.color}20`, borderColor: catConfig.color }}
                          className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0"
                        >
                          <CatIcon size={18} style={{ color: catConfig.color }} />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span 
                            style={{ color: catConfig.color }} 
                            className="text-[11px] font-bold uppercase tracking-wider block"
                          >
                            {catConfig.label}
                          </span>
                          <span className="text-[10px] text-slate-500">• 2 min ago</span>
                        </div>
                        <h3 className="text-xs font-semibold text-slate-100 line-clamp-1">
                          {h.locationName}
                        </h3>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400 shrink-0 font-medium bg-[#1B2538] px-2 py-0.5 rounded-full">
                      {calculateDistance(h.lat, h.lng)} away
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 line-clamp-2">
                    {h.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-[#1E2B40]/50 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-300 font-medium">{h.author}</span>
                      {h.verifiedAuthor && (
                        <CheckCircle2 size={13} className="text-[#10B981]" />
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={(e) => handleUpvote(h.id, e)}
                        className="flex items-center gap-1 text-slate-300 hover:text-[#10B981] transition-colors"
                      >
                        <ThumbsUp size={13} />
                        <span>{h.upvotes}</span>
                      </button>

                      <div className="flex items-center gap-1 text-slate-400">
                        <MessageSquare size={13} />
                        <span>{h.comments?.length || 0}</span>
                      </div>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(h);
                        }}
                        className="text-slate-400 hover:text-white"
                      >
                        <Share2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* DETAILED HAZARD BOTTOM SHEET MODAL (Mockup Screen 3 Match) */}
      {selectedHazard && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end justify-center p-0">
          <div className="w-full max-w-md bg-[#111827] rounded-t-3xl border-t border-[#1E2B40] max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
            {/* Modal Header */}
            <div className="p-3 border-b border-[#1E2B40] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase">
                  {selectedHazard.category}
                </span>
                <span className="text-xs text-slate-400">
                  {calculateDistance(selectedHazard.lat, selectedHazard.lng)} away
                </span>
              </div>
              <button 
                onClick={() => setSelectedHazard(null)}
                className="p-1 rounded-full bg-[#1F2937] text-slate-300 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto space-y-4">
              {/* Image banner */}
              {selectedHazard.imageUrl ? (
                <div className="w-full h-44 rounded-2xl overflow-hidden border border-[#1E2B40]">
                  <img 
                    src={selectedHazard.imageUrl} 
                    alt="Hazard Evidence" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-24 rounded-2xl bg-[#162032] border border-[#1E2B40] flex items-center justify-center text-slate-400 text-xs">
                  <MapPin size={20} className="mr-2 text-rose-500" />
                  <span>Road incident reported on map</span>
                </div>
              )}

              <div>
                <h2 className="text-base font-bold text-white">
                  {selectedHazard.locationName}
                </h2>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {selectedHazard.description}
                </p>
              </div>

              {/* Reporter Info */}
              <div className="p-3 rounded-2xl bg-[#162032] border border-[#1E2B40] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[#10B981] font-bold text-xs">
                    {selectedHazard.author?.[0] || 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-white">
                      <span>{selectedHazard.author}</span>
                      {selectedHazard.verifiedAuthor && (
                        <CheckCircle2 size={13} className="text-[#10B981]" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">Verified Reporter</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleUpvote(selectedHazard.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-xs font-semibold active:scale-95"
                  >
                    <ThumbsUp size={14} />
                    <span>{selectedHazard.upvotes} Upvotes</span>
                  </button>

                  <button 
                    onClick={() => handleShare(selectedHazard)}
                    className="p-2 rounded-xl bg-[#1E2B40] text-slate-200 hover:text-white active:scale-95"
                  >
                    <Share2 size={15} />
                  </button>
                </div>
              </div>

              {/* View on Map Button (Screen 3 Mockup Match) */}
              <button
                onClick={() => {
                  const lat = selectedHazard.lat;
                  const lng = selectedHazard.lng;
                  setSelectedHazard(null);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 0.8 });
                  }
                }}
                className="w-full py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                <span>View on Map</span>
              </button>

              {/* Community Comments / Recent Reports */}
              <div className="space-y-2 pt-2 border-t border-[#1E2B40]">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-[#10B981]" />
                  <span>Recent Reports & Updates</span>
                </h3>

                <div className="space-y-2">
                  {selectedHazard.comments && selectedHazard.comments.length > 0 ? (
                    selectedHazard.comments.map(c => (
                      <div key={c.id} className="p-2.5 rounded-xl bg-[#141C2B] border border-[#1E2B40] text-xs">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                          <span className="font-semibold text-slate-200">{c.author}</span>
                          <span>{c.time}</span>
                        </div>
                        <p className="text-slate-300">{c.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-1">No comments yet. Be the first to confirm!</p>
                  )}
                </div>

                {/* Add Comment Input */}
                <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add an update (e.g. Cleared, Police on site)..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 bg-[#162032] border border-[#1E2B40] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-[#10B981]"
                  />
                  <button 
                    type="submit" 
                    className="px-3 py-2 rounded-xl bg-[#10B981] text-white text-xs font-semibold active:scale-95 shrink-0"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FILTER MODAL */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#111827] rounded-3xl border border-[#1E2B40] p-5 space-y-4 animate-in fade-in-50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Filter size={15} className="text-[#10B981]" />
                <span>Filter Radar</span>
              </h3>
              <button onClick={() => setShowFilterModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Distance Radius */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Distance Radius</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: '2', label: 'Within 2 km' },
                  { id: '5', label: 'Within 5 km' },
                  { id: '10', label: 'Within 10 km' },
                  { id: 'all', label: 'All Distances' },
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setFilterRadius(r.id)}
                    className={`p-2 rounded-xl text-xs font-medium border transition-all ${
                      filterRadius === r.id
                        ? 'bg-[#10B981]/20 border-[#10B981] text-white font-semibold'
                        : 'bg-[#162032] border-[#1E2B40] text-slate-400'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Severity</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'all', label: 'All Severities' },
                  { id: 'high', label: 'High Danger Only' },
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setFilterSeverity(s.id)}
                    className={`p-2 rounded-xl text-xs font-medium border transition-all ${
                      filterSeverity === s.id
                        ? 'bg-[#10B981]/20 border-[#10B981] text-white font-semibold'
                        : 'bg-[#162032] border-[#1E2B40] text-slate-400'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowFilterModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#10B981] text-white text-xs font-bold shadow-lg active:scale-95 transition-all"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}

      {/* REPORT HAZARD MODAL (SCREEN 4 IN USER MOCKUP) */}
      {isReporting && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-end justify-center p-0">
          <div className="w-full max-w-md bg-[#111827] rounded-t-3xl border-t border-[#1E2B40] max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-[#1E2B40] flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Report Hazard</h2>
                <p className="text-[11px] text-slate-400">Help fellow drivers stay safe on the road</p>
              </div>
              <button 
                onClick={() => setIsReporting(false)}
                className="p-1 rounded-full bg-[#1F2937] text-slate-300 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitReport} className="p-4 overflow-y-auto space-y-4">
              {/* Category Grid (Matching Mockup 4) */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Select Hazard Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.filter(c => c.id !== 'all').map(cat => {
                    const isSelected = reportForm.category === cat.id;
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setReportForm(prev => ({ ...prev, category: cat.id }))}
                        className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all border ${
                          isSelected
                            ? 'bg-[#162032] border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                            : 'bg-[#141C2B] border-[#1E2B40] hover:border-slate-600'
                        }`}
                      >
                        <div 
                          style={{ backgroundColor: `${cat.color}25` }}
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                        >
                          <Icon size={20} style={{ color: cat.color }} />
                        </div>
                        <span className={`text-[11px] font-semibold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location Input / Auto GPS */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Location / Landmark
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-[#10B981]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Outer Ring Road, Near Flyover"
                    value={reportForm.locationName}
                    onChange={(e) => setReportForm(prev => ({ ...prev, locationName: e.target.value }))}
                    className="w-full bg-[#141C2B] border border-[#1E2B40] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981]"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-[#10B981]" />
                  <span>Coordinates automatically tagged using your GPS</span>
                </p>
              </div>

              {/* Details Textarea */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Add details (optional)
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {reportForm.description.length}/200
                  </span>
                </div>
                <textarea
                  maxLength={200}
                  placeholder="Describe what you see (lanes blocked, police present, alternate routes)..."
                  value={reportForm.description}
                  onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-[#141C2B] border border-[#1E2B40] rounded-xl p-3 text-xs text-white placeholder-slate-500 min-h-[80px] resize-none focus:outline-hidden focus:border-[#10B981]"
                />
              </div>

              {/* Add Photo / Evidence */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Add photo (optional)
                </label>
                <label className="border-2 border-dashed border-[#1E2B40] hover:border-[#10B981]/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-[#141C2B]/50 transition-colors">
                  {reportForm.imageUrl ? (
                    <div className="relative w-full h-28 rounded-xl overflow-hidden">
                      <img src={reportForm.imageUrl} alt="Uploaded" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setReportForm(prev => ({ ...prev, imageUrl: null }));
                        }}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Camera className="w-7 h-7 text-slate-400 mb-1" />
                      <span className="text-xs font-medium text-slate-300">Tap to take photo or upload</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">JPG, PNG up to 10MB</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload} 
                    className="hidden" 
                  />
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Submit Report</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
