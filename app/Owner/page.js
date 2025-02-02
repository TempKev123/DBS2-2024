"use client"; // Needed for state and interactivity
//FIX THE FLOATING REPORT
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";

const reportedItems = [
  { id: 1, type: "Van", name: "Ford Transit", rate: "$50/day", description: "A white van with a broken side mirror.", imageUrl: "https://media.istockphoto.com/id/1133431051/vector/car-line-icon-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=E9t9aitIGYdX-cggrORFCY1dZR-Y8ff37MbXXLDrv9I=", status: "Pending" },
  { id: 2, type: "Car", name: "Toyota Corolla", rate: "$30/day", description: "A red car with a flat tire.", imageUrl: "https://media.istockphoto.com/id/1133431051/vector/car-line-icon-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=E9t9aitIGYdX-cggrORFCY1dZR-Y8ff37MbXXLDrv9I=", status: "Pending" },
  { id: 3, type: "Truck", name: "Mack Anthem", rate: "$100/day", description: "A heavy-duty truck with engine issues.", imageUrl: "https://media.istockphoto.com/id/1133431051/vector/car-line-icon-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=E9t9aitIGYdX-cggrORFCY1dZR-Y8ff37MbXXLDrv9I=", status: "Pending" },
  { id: 4, type: "Car", name: "Honda Civic", rate: "$45/day", description: "A silver car with minor dents on the bumper.", imageUrl: "https://media.istockphoto.com/id/1133431051/vector/car-line-icon-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=E9t9aitIGYdX-cggrORFCY1dZR-Y8ff37MbXXLDrv9I=", status: "Pending" },
];
var username="Gregor Sinclair"

export default function Owner() {
  const [filter, setFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);

  // Filter reports based on the selected type
  const filteredReports = filter === "All" ? reportedItems : reportedItems.filter((item) => item.type === filter);

  return (
    <div className="bg-green-800 text-white min-h-screen flex flex-col">
      <Navbar />

      {/* Welcome Section */}
      <section className="flex-grow text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Welcome Owner, {username}</h1>
      </section>
      {/* add button */}
      <button
        onClick={() => { }}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#007BFF'}
      >
        Add
      </button>


      {/* Filter Section */}
      <section className="bg-gray-900 py-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">Filter vehicles by Type</h2>
          <div className="flex justify-center space-x-4">
            {["Truck", "Van", "Car", "All"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg ${filter === type ? "bg-blue-500" : "bg-gray-700 hover:bg-gray-600"
                  } text-white transition duration-300`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Reported List Section */}
      <section className="bg-gray-900 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold text-white mb-6">Your Vehicles</h2>

          {/* No reports message */}
          {filteredReports.length === 0 ? (
            <p className="text-gray-400">No reports found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((item) => (
                <Card
                  key={item.id}
                  title={`${item.type}: ${item.name}`}
                  description={`Description: ${item.description}`}
                  ownername={`Owner: ${item.rate}`}
                  imageUrl={item.imageUrl}
                  buttonText="View Report"
                  onClick={() => setSelectedReport(item)} // Open modal with report details
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Floating Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-lg w-full relative">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>

            <img className="w-full h-48 object-cover rounded-lg" src={selectedReport.imageUrl} alt={selectedReport.name} />
            <h2 className="text-2xl font-bold mt-4 text-gray-800">{selectedReport.type}: {selectedReport.name}</h2>
            <p className="text-gray-600 mt-2">💰 Rate: {selectedReport.rate}</p>
            <p className="text-gray-600 mt-2">📌 Description: {selectedReport.description}</p>
            <p className={`mt-4 text-lg font-semibold ${selectedReport.status === "Resolved" ? "text-green-500" : "text-red-500"}`}>
              Status: {selectedReport.status}
            </p>
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


