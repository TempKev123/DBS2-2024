import { NextResponse } from "next/server";
import { Client } from "pg";

// GET: Fetch cars for a specific owner
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get("ownerId");

    if (!ownerId) {
        return NextResponse.json({ error: "Owner ID is required" }, { status: 400 });
    }

    const client = new Client({
        host: "localhost",
        user: "postgres",
        password: "1293",
        database: "CarRentalDB",
        port: 5432,
    });

    try {
        await client.connect();
        console.log(`✅ Fetching cars for owner ID: ${ownerId}`);

        const result = await client.query(`
            SELECT * FROM Cars
            WHERE owner_id = $1
        `, [ownerId]);

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("❌ Error fetching cars:", error.message);
        return NextResponse.json({ error: "Failed to fetch owner cars." }, { status: 500 });
    } finally {
        await client.end();
    }
}

// POST: Add a new car for the logged-in owner
export async function POST(req) {
    const body = await req.json();
    const { brand, model, manufacturedYear, pricePerDay, availability, carType, ownerId } = body;

    if (!brand || !model || !manufacturedYear || !pricePerDay || !carType || !ownerId) {
        return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const client = new Client({
        host: "localhost",
        user: "postgres",
        password: "1293",
        database: "CarRentalDB",
        port: 5432,
    });

    try {
        await client.connect();

        await client.query(`
            INSERT INTO Cars (brand, model, manufacturedyear, price_per_day, availability, car_type, owner_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [brand, model, manufacturedYear, pricePerDay, availability, carType, ownerId]);

        return NextResponse.json({ message: "Car added successfully!" });
    } catch (error) {
        console.error("❌ Error adding car:", error.message);
        return NextResponse.json({ error: "Failed to add car." }, { status: 500 });
    } finally {
        await client.end();
    }
}
