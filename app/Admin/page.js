"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Card from "@/components/reportCard";

export default function Admin() {
    const [reports, setReports] = useState([]);
    const [typeFilter, setTypeFilter] = useState("All"); // Filter by reported type (Car, Owner, Customer)
    const [statusFilter, setStatusFilter] = useState("All"); // Filter by report status (Pending, Resolved, Rejected)
    const [selectedReport, setSelectedReport] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch reports from the new adminReports API
    const fetchReports = async () => {
        try {
            const response = await fetch("/api/adminReports");
            if (!response.ok) throw new Error("Failed to fetch reports.");
            const data = await response.json();
            setReports(data);
        } catch (error) {
            console.error("❌ Error fetching reports:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    // Update report status
    const updateReportStatus = async (reportId, status) => {
        try {
            const response = await fetch(`/api/adminReports`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reportId, status }),
            });

            if (response.ok) {
                alert("✅ Report status updated successfully!");
                fetchReports(); // Refresh reports
                setSelectedReport(null);
            } else {
                const errorData = await response.json();
                alert(errorData.error || "❌ Failed to update report status.");
            }
        } catch (error) {
            console.error("❌ Error updating report status:", error.message);
        }
    };

    // Filter reports by type and status
    const filteredReports = reports.filter((report) => {
        const typeMatch = typeFilter === "All" || report.reported_type === typeFilter;
        const statusMatch = statusFilter === "All" || report.status === statusFilter;
        return typeMatch && statusMatch;
    });

    return (
        <div className="bg-purple-800 text-white min-h-screen flex flex-col">
            <Navbar />

            {/* Header */}
            <section className="text-center py-10">
                <h1 className="text-4xl font-bold mb-4">Admin Dashboard - Manage Reports</h1>
            </section>

            {/* Filter Section */}
            <section className="bg-gray-900 py-6">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-semibold text-white mb-6">Filter Reports</h2>

                    <div className="flex justify-center gap-4 mb-6">

                        {/* Status Filter */}
                        <div>
                            <label className="block text-white mb-2">Filter by Status:</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 rounded-lg bg-gray-700 text-white"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Open">Open</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reported List */}
            <section className="bg-gray-900 py-12">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-semibold text-white mb-6">Reported Items</h2>

                    {loading ? (
                        <p className="text-gray-400">Loading reports...</p>
                    ) : filteredReports.length === 0 ? (
                        <p className="text-gray-400">No reports found for the selected filters.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredReports.map((report) => (
                                <Card
                                    key={report.report_id}
                                    title={(() => {
                                        if (report.reported_type === "Car") {
                                            return `Car: ${report.car_name || "Unknown Car"}`;
                                        }
                                        return `${report.reported_type}: ${report.reported_name || "N/A"}`;
                                    })()}
                                    description={`Reason: ${report.reason}`}
                                    ownername={`Reported by: ${report.reporter_name || "Unknown"}`}
                                    imageUrl="https://via.placeholder.com/150"
                                    buttonText="View Report"
                                    onClick={() => setSelectedReport(report)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Report Detail Modal */}
            {selectedReport && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-lg w-full relative">
                        <button
                            onClick={() => setSelectedReport(null)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
                        >
                            ✕
                        </button>

                        <h2 className="text-2xl font-bold mt-4 text-gray-800">Report Details</h2>
                        <p className="text-gray-600 mt-2">🚨 Reason: {selectedReport.reason}</p>
                        <p className="text-gray-600">📌 Reported By: {selectedReport.reporter_name}</p>
                        <p className="text-gray-600">📝 Description: {selectedReport.description || "No description provided."}</p>
                        <p className={`mt-4 text-lg font-semibold ${selectedReport.status === "Resolved" ? "text-green-500" : "text-red-500"}`}>
                            Status: {selectedReport.status}
                        </p>

                        <div className="mt-4 flex justify-end space-x-4">
                            <button
                                onClick={() => updateReportStatus(selectedReport.report_id, "Resolved")}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                                Mark as Resolved
                            </button>
                            <button
                                onClick={() => updateReportStatus(selectedReport.report_id, "Rejected")}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Reject Report
                            </button>
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-gray-900 py-6 text-center text-sm">
                <p>&copy; 2025 Rent Co. All rights reserved.</p>
            </footer>
        </div>
    );
}
