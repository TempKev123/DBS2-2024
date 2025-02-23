
"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import { useRouter } from "next/navigation";

export default function Owner() {
  const [filter, setFilter] = useState("All");
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [user, setUser] = useState(null);
  const [newCar, setNewCar] = useState({
    brand: "",
    model: "",
    manufacturedYear: "",
    pricePerDay: "",
    availability: true,
    carType: "",
    ownerId: null,
  });

  const router = useRouter();

  // Fetch user and cars on page load
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.userType !== "Owner") {
      alert("Access denied. Only owners can view this page.");
      router.push("/");
      return;
    }

    setUser(storedUser);
    setNewCar((prev) => ({ ...prev, ownerId: storedUser.id }));

    const fetchCars = async () => {
      try {
        const response = await fetch(`/api/cars?ownerId=${storedUser.id}`);
        if (!response.ok) throw new Error("Failed to fetch cars");

        const data = await response.json();
        setCars(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cars:", error.message);
        setLoading(false);
      }
    };

    fetchCars();
  }, [router]);

  // Filter cars by type
  const filteredCars =
    filter === "All" ? cars : cars.filter((car) => car.carType === filter);

  // Handle Add Car
  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCar),
      });

      if (!response.ok) throw new Error("Failed to add car.");

      alert("Car added successfully!");
      setShowAddCarModal(false);
      setNewCar({ brand: "", model: "", manufacturedYear: "", pricePerDay: "", availability: true, carType: "", ownerId: user?.id });

      // Refresh the car list
      const updatedCars = await fetch(`/api/cars?ownerId=${user.id}`);
      setCars(await updatedCars.json());
    } catch (error) {
      console.error("Error adding car:", error.message);
      alert("Failed to add car.");
    }
  };

  return (
    <div className="bg-green-800 text-white min-h-screen flex flex-col">
      <Navbar />

      <section className="flex-grow text-center py-10">
        <h1 className="text-4xl font-bold mb-4">Welcome, {user?.name}</h1>
      </section>

      {/* Add Car Button */}
      <div className="text-center mb-4">
        <button
          onClick={() => setShowAddCarModal(true)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg transition"
        >
          Add Vehicle
        </button>
      </div>

      {/* Filter Section */}
      <section className="bg-gray-900 py-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">Filter vehicles by Type</h2>
          <div className="flex justify-center space-x-4">
            {["Truck", "Van", "Car", "All"].map((type) => (
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
      <section className="bg-gray-900 py-10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold text-white mb-6">Your Vehicles</h2>

          {loading ? (
            <p className="text-gray-400">Loading your cars...</p>
          ) : filteredCars.length === 0 ? (
            <p className="text-gray-400">No cars found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <Card
                  key={car.car_id}
                  title={`${car.brand} ${car.model}`}
                  description={`Year: ${car.manufacturedyear}`}
                  ownername={`Price: $${car.price_per_day}/day`}
                  imageUrl="https://via.placeholder.com/150"
                  buttonText="View Details"
                  onClick={() => setSelectedCar(car)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Add Car Modal */}
      {showAddCarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={() => setShowAddCarModal(false)}>
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-lg w-full relative" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Car</h2>
            <form onSubmit={handleAddCar} className="space-y-4">
              <input
                type="text"
                placeholder="Brand"
                value={newCar.brand}
                onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
                className="w-full p-2 border rounded text-black"
                required
              />
              <input
                type="text"
                placeholder="Model"
                value={newCar.model}
                onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                className="w-full p-2 border rounded text-black"
                required
              />
              <input
                type="number"
                placeholder="Manufactured Year"
                value={newCar.manufacturedYear}
                onChange={(e) => setNewCar({ ...newCar, manufacturedYear: e.target.value })}
                className="w-full p-2 border rounded text-black"
                required
              />
              <input
                type="number"
                placeholder="Price Per Day"
                value={newCar.pricePerDay}
                onChange={(e) => setNewCar({ ...newCar, pricePerDay: e.target.value })}
                className="w-full p-2 border rounded text-black"
                required
              />
              <select
                value={newCar.carType}
                onChange={(e) => setNewCar({ ...newCar, carType: e.target.value })}
                className="w-full p-2 border rounded text-black"
                required
              >
                <option value="">Select Car Type</option>
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
                <option value="Car">Car</option>
              </select>
              <button type="submit" className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded-lg">Add Car</button>
              <button type="button" onClick={() => setShowAddCarModal(false)} className="ml-2 px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded-lg">Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 py-6 text-center text-sm">
        <p>&copy; 2025 Mikey's Co. All rights reserved.</p>
      </footer>
    </div>
  );
}
