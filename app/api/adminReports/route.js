import { NextResponse } from "next/server";
import { Pool } from "pg";

// Database connection pool
const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "1293", // Ensure this matches your DB credentials
    database: "CarRentalDB",
    port: 5432,
});

// GET: Fetch all reports with reporter info and car name
export async function GET() {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT 
                r.*, 
                CASE 
                    WHEN r.Reporter_Type = 'Customer' THEN c.CustomerName
                    WHEN r.Reporter_Type = 'Owner' THEN o.OwnerName
                    ELSE 'Unknown'
                END AS reporter_name,
                CASE 
                    WHEN r.Reported_Type = 'Car' THEN cars.model
                    ELSE NULL
                END AS car_name,
                u.email AS reporter_email
            FROM Report r
            LEFT JOIN Customer c ON r.Reporter_Customer_ID = c.Customer_ID
            LEFT JOIN CarOwner o ON r.Reporter_Owner_ID = o.Owner_ID
            LEFT JOIN Cars cars ON r.Car_ID = cars.Car_ID  -- Added car join
            LEFT JOIN Users u ON r.Reporter_ID = u.User_ID
            ORDER BY r.Report_ID DESC
        `);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("❌ Error fetching reports:", error);
        return NextResponse.json({ error: "Failed to fetch reports." }, { status: 500 });
    } finally {
        client.release();
    }
}

// PUT: Update report status
export async function PUT(req) {
    const { reportId, status } = await req.json();

    if (!reportId || !status) {
        return NextResponse.json({ error: "Report ID and status are required." }, { status: 400 });
    }

    const client = await pool.connect();
    try {
        const result = await client.query(
            `UPDATE Report SET Status = $1 WHERE Report_ID = $2 RETURNING *`,
            [status, reportId]
        );
        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Report not found." }, { status: 404 });
        }
        return NextResponse.json({ message: "Report updated successfully.", report: result.rows[0] });
    } catch (error) {
        console.error("❌ Error updating report:", error);
        return NextResponse.json({ error: "Failed to update report." }, { status: 500 });
    } finally {
        client.release();
    }
}

// DELETE: Remove a report
export async function DELETE(req) {
    const { reportId } = await req.json();

    if (!reportId) {
        return NextResponse.json({ error: "Report ID is required." }, { status: 400 });
    }

    const client = await pool.connect();
    try {
        const result = await client.query(
            `DELETE FROM Report WHERE Report_ID = $1 RETURNING *`,
            [reportId]
        );
        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Report not found." }, { status: 404 });
        }
        return NextResponse.json({ message: "Report deleted successfully." });
    } catch (error) {
        console.error("❌ Error deleting report:", error);
        return NextResponse.json({ error: "Failed to delete report." }, { status: 500 });
    } finally {
        client.release();
    }
}
