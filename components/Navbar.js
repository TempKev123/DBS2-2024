// File: components/Navbar.js
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-orange-400 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/Home">
          <span className="text-2xl font-bold cursor-pointer">Mikey's rentals!</span>
        </Link>
        <div className="space-x-4">
          <Link href="/Rent" className="hover:underline">
            Renter
          </Link>
          <Link href="/Owner" className="hover:underline">
            Owner
          </Link>
          <Link href="/Admin/login" className="hover:underline">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
