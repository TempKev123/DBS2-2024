import { NextResponse } from "next/server";
import { Client } from "pg";

export async function POST(req) {
    const { email, password } = await req.json();

    const client = new Client({
        host: "localhost",
        user: "postgres",
        password: "1293",  // Update with your actual DB password
        database: "CarRentalDB",
        port: 5432,
    });

    try {
        await client.connect();

        // 🟢 Verify user credentials from Users table
        const userResult = await client.query(
            `SELECT * FROM Users WHERE email = $1 AND loginpassword = $2`,
            [email, password]
        );

        if (userResult.rows.length === 0) {
            return NextResponse.json({ error: "❌ Invalid email or password" }, { status: 401 });
        }

        const user = userResult.rows[0];
        let userDetails = {};

        // 🔍 Fetch user details based on userType
        switch (user.user_type) {
            case "Customer":
                const customerResult = await client.query(
                    `SELECT * FROM Customer WHERE user_id = $1`,
                    [user.user_id]
                );
                userDetails = customerResult.rows[0] || {};
                break;

            case "Owner":
                const ownerResult = await client.query(
                    `SELECT * FROM CarOwner WHERE user_id = $1`,
                    [user.user_id]
                );
                userDetails = ownerResult.rows[0] || {};
                break;

            case "Admin":
                const adminResult = await client.query(
                    `SELECT * FROM PageAdmin WHERE user_id = $1`,
                    [user.user_id]
                );
                userDetails = adminResult.rows[0] || {};
                break;

            default:
                return NextResponse.json({ error: "❌ Invalid user type" }, { status: 400 });
        }

        // 🔑 Return user information, including Owner ID for ownership linking
        return NextResponse.json({
            message: "✅ Login successful",
            user: {
                id: user.user_id,
                email: user.email,
                userType: user.user_type,
                name: userDetails.customername || userDetails.ownername || userDetails.adminname || user.username || "User",
                ownerId: userDetails.owner_id || null,  // Ensure Owner ID is passed for car management
            },
        });

    } catch (error) {
        console.error("❌ Login error:", error.message);
        return NextResponse.json({ error: "Failed to login due to server error" }, { status: 500 });
    } finally {
        await client.end();
    }
}
