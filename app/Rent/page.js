"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Card from "@/components/reportCard";

export default function Rent() {
    const [filter, setFilter] = useState("All");
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [carTypes, setCarTypes] = useState(["All"]);

    // Fetch available cars from the API
    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch("/api/cars"); // API endpoint
                if (!response.ok) {
                    throw new Error("Failed to fetch available cars.");
                }
                const data = await response.json();
                setCars(data);

                // Extract unique car types for filters
                const types = ["All", ...new Set(data.map((car) => car.car_type))];
                setCarTypes(types);
            } catch (error) {
                console.error("❌ Fetch error:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    // Filter cars by car_type
    const filteredCars = filter === "All"
        ? cars
        : cars.filter((car) => car.car_type === filter);

    return (
        <div className="bg-blue-800 text-white min-h-screen flex flex-col">
            <Navbar />

            <section className="flex-grow text-center py-10">
                <h1 className="text-4xl font-bold mb-4">Available Cars for Rent</h1>
            </section>

            {/* Filter Section */}
            <section className="bg-gray-900 py-6">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-semibold text-white mb-4">Filter by Car Type</h2>
                    <div className="flex justify-center space-x-4">
                        {carTypes.map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-4 py-2 rounded-lg ${filter === type ? "bg-blue-500" : "bg-gray-700 hover:bg-gray-600"} text-white transition duration-300`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Car List Section */}
            <section className="bg-gray-900 py-12">
                <div className="container mx-auto text-center">
                    {loading ? (
                        <p className="text-gray-400">Loading available cars...</p>
                    ) : filteredCars.length === 0 ? (
                        <p className="text-gray-400">No cars available for the selected type.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCars.map((car) => (
                                <Card
                                    key={car.car_id}
                                    title={`${car.brand} ${car.model}`}
                                    description={`Year: ${car.manufacturedyear}`}
                                    ownername={`Owner: ${car.ownername}`}
                                    imageUrl="https://via.placeholder.com/150"
                                    buttonText={`Price: $${car.price_per_day}/day`}
                                    onClick={() => setSelectedCar(car)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Car Detail Modal */}
            {selectedCar && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-lg w-full relative">
                        <button
                            onClick={() => setSelectedCar(null)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
                        >
                            ✕
                        </button>

                        <img className="w-full h-48 object-cover rounded-lg" src="https://via.placeholder.com/300" alt={selectedCar.model} />
                        <h2 className="text-2xl font-bold mt-4 text-gray-800">{selectedCar.brand} {selectedCar.model}</h2>
                        <p className="text-gray-600 mt-2">Owner: {selectedCar.ownername}</p>
                        <p className="text-gray-600 mt-2">Type: {selectedCar.car_type}</p>
                        <p className="text-gray-600 mt-2">Year: {selectedCar.manufacturedyear}</p>
                        <p className="text-gray-600 mt-2">Price: ${selectedCar.price_per_day}/day</p>

                        <div className="mt-4 flex justify-start">
                            <button
                                onClick={() => alert(`Proceeding with ${selectedCar.model}`)}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                                Proceed to Rent
                            </button>

                            <button
                                onClick={() => setSelectedCar(null)}
                                className="ml-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <footer className="bg-gray-900 py-6 text-center text-sm">
                <p>&copy; 2025 Rent Co. All rights reserved.</p>
            </footer>
        </div>
    );
}
