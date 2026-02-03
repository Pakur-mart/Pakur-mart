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
    onLocationSetAction: (city: string, state: string) => void;
}

export function LocationPrompt({ onLocationSetAction }: LocationPromptProps) {
    const [loading, setLoading] = useState(false);
    const [manualCity, setManualCity] = useState("");
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

                    const response = await fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
                    );
                    const data = await response.json();

                    if (data.results && data.results.length > 0) {
                        let city = "Pakur";
                        let state = "Jharkhand";

                        for (const result of data.results) {
                            const comps = result.address_components;
                            const locality = comps.find((c: any) => c.types.includes("locality"));
                            const adminArea = comps.find((c: any) => c.types.includes("administrative_area_level_1"));
                            if (locality) city = locality.long_name;
                            if (adminArea) state = adminArea.long_name;
                            if (locality) break;
                        }

                        onLocationSetAction(city, state);
                    } else {
                        setError("Could not determine your location. Please enter it manually.");
                    }
                } catch (err) {
                    setError("Failed to fetch location details.");
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setError("Location access denied. Please enter manually.");
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (manualCity.trim().length < 2) {
            setError("Please enter a valid city name.");
            return;
        }

        onLocationSetAction(manualCity.trim(), "");
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-2xl border-primary/20">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <MapPin className="text-primary w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Welcome to Pakur Mart</CardTitle>
                        <CardDescription>
                            Please select your delivery location to see available products in your area
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Button
                            onClick={handleLiveLocation}
                            disabled={loading}
                            className="w-full h-12 text-lg font-medium transition-all"
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <Navigation className="mr-2 h-5 w-5" />
                            )}
                            {loading ? "Finding location..." : "Use Live Location"}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or enter manually</span>
                            </div>
                        </div>

                        <form onSubmit={handleManualSubmit} className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder="Enter your city or area..."
                                    className="pl-10 h-12"
                                    value={manualCity}
                                    onChange={(e) => setManualCity(e.target.value)}
                                />
                            </div>
                            <Button type="submit" variant="secondary" className="w-full h-11">
                                Set Location
                            </Button>
                        </form>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                    <div className="bg-muted/50 py-3 text-center rounded-b-xl border-t">
                        <p className="text-[10px] text-muted-foreground w-full">
                            We need your location to show products supported in your area.
                        </p>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
