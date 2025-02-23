import { NextResponse } from "next/server";
import { Client } from "pg";

export async function POST(req) {
  const { email, password } = await req.json();

  const client = new Client({
    host: "localhost",
    user: "postgres",
    password: "1293",  // Your DB password
    database: "CarRentalDB",
    port: 5432,
  });

  try {
    await client.connect();

    // Check user in the Users table
    const result = await client.query(
      "SELECT * FROM Users WHERE email = $1 AND loginpassword = $2",
      [email, password]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const user = result.rows[0];

    // Fetch user details based on userType
    let userDetails = {};
    if (user.user_type === "Customer") {
      const customerResult = await client.query(
        "SELECT * FROM Customer WHERE user_id = $1",
        [user.user_id]
      );
      userDetails = customerResult.rows[0] || {};
    } else if (user.user_type === "Owner") {
      const ownerResult = await client.query(
        "SELECT * FROM CarOwner WHERE user_id = $1",
        [user.user_id]
      );
      userDetails = ownerResult.rows[0] || {};
    } else if (user.user_type === "Admin") {
      const adminResult = await client.query(
        "SELECT * FROM Admin WHERE user_id = $1",
        [user.user_id]
      );
      userDetails = adminResult.rows[0] || {};
    }

    // Return user information with userType
    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.user_id,
        email: user.email,
        userType: user.user_type,
        name: userDetails.customername || userDetails.ownername || userDetails.adminname || "User",
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  } finally {
    await client.end();
  }
}
