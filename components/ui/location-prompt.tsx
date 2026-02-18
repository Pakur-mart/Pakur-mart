"use client";

import { useState } from "react";
import {
    MapPin,
    Navigation,
    Search,
    Loader2,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface LocationPromptProps {
    onLocationSetAction: (fullAddress: string, city: string, state: string) => void;
}

export function LocationPrompt({ onLocationSetAction }: LocationPromptProps) {
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleLiveLocation = async () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

                    if (!apiKey) {
                        console.warn("Google Maps API Key missing, using fallback");
                        setAddress("Pakur Town, Jharkhand");
                        setLoading(false);
                        return;
                    }

                    const response = await fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
                    );
                    const data = await response.json();

                    if (data.status === "OK" && data.results.length > 0) {
                        const result = data.results[0];
                        const fullAddress = result.formatted_address;
                        setAddress(fullAddress);

                        // Extract components
                        const cityComp = result.address_components.find((c: any) =>
                            c.types.includes("locality") || c.types.includes("administrative_area_level_2")
                        );
                        const stateComp = result.address_components.find((c: any) =>
                            c.types.includes("administrative_area_level_1")
                        );

                        const cityName = cityComp ? cityComp.long_name : "Pakur";
                        const stateName = stateComp ? stateComp.long_name : "Jharkhand";

                        setCity(cityName);
                        setRegion(stateName);
                    } else {
                        console.error("Geocoding failed:", data.status, data.error_message);
                        setAddress("Pakur, Jharkhand");
                        setCity("Pakur");
                        setRegion("Jharkhand");
                    }
                } catch (err: any) {
                    console.error("Live location error:", err);
                    setError("Failed to fetch address. Please check your internet or GPS.");
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                console.error("Geolocation error:", err);
                if (err.code === 1) {
                    setError("Location permission denied. Please allow location access or type manually.");
                } else {
                    setError("Could not detect location. Please type manually.");
                }
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const [city, setCity] = useState("Pakur");
    const [region, setRegion] = useState("Jharkhand");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!address.trim()) {
            setError("Please enter your delivery address.");
            return;
        }

        // If manual entry, try to extract last parts as city/state
        const parts = address.split(',').map(p => p.trim());
        let finalCity = city;
        let finalState = region;

        if (parts.length >= 2) {
            // Very simple heuristic: last part is state, second to last is city
            finalState = parts[parts.length - 1];
            finalCity = parts[parts.length - 2];
        } else if (parts.length === 1) {
            finalCity = parts[0];
        }

        onLocationSetAction(address, finalCity, finalState);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/95 backdrop-blur-md overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20"
                    >
                        <MapPin className="text-primary w-8 h-8" />
                    </motion.div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Delivery Location</h1>
                    <p className="text-muted-foreground">Select how you want to set your delivery address</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {/* Live Location Section */}
                    <Card
                        className={`relative overflow-hidden border-2 transition-all cursor-pointer group hover:border-primary/50 shadow-lg ${loading ? 'opacity-80' : ''}`}
                        onClick={!loading ? handleLiveLocation : undefined}
                    >
                        <CardHeader className="pb-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Navigation className="w-5 h-5" />
                            </div>
                            <CardTitle className="text-xl">Live Location</CardTitle>
                            <CardDescription>Automatically detect your current spot</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <Button
                                variant="secondary"
                                className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                {loading ? "Detecting..." : "Use GPS"}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Manual Address Section */}
                    <Card className="border-2 shadow-lg">
                        <CardHeader className="pb-2">
                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-2">
                                <Search className="w-5 h-5 text-secondary-foreground" />
                            </div>
                            <CardTitle className="text-xl">Enter Address</CardTitle>
                            <CardDescription>Type your full delivery details</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    placeholder="Enter full address..."
                                    value={address}
                                    onChange={(e) => {
                                        setAddress(e.target.value);
                                        if (error) setError(null);
                                    }}
                                    className="h-10 text-sm"
                                />
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={!address.trim() || loading}
                                >
                                    Confirm & Start
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3"
                        >
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-8 text-center">
                    <p className="text-xs text-muted-foreground bg-muted/30 py-2 px-4 rounded-full inline-block border">
                        Delivery available across all areas in Pakur
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
