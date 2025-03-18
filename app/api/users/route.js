import { NextResponse } from "next/server";
import { Client } from "pg";

// GET: Fetch users based on user_type
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const userType = searchParams.get("userType");

    if (!userType) {
        return NextResponse.json({ error: "User type is required." }, { status: 400 });
    }

    const client = new Client({
        host: "localhost",
        user: "postgres",
        password: "1293", // Ensure this is your actual password
        database: "CarRentalDB",
        port: 5432,
    });

    try {
        await client.connect();

        // Ensure table name matches your DB schema
        const result = await client.query(
            `SELECT user_id, user_type FROM users WHERE user_type = $1`,
            [userType]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: `No users found for type: ${userType}` }, { status: 404 });
        }

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("❌ User API error:", error.message);
        return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
    } finally {
        await client.end();
    }
}
