import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Owner() {
  return (
    <div className="bg-gray-800 text-white min-h-screen flex flex-col">
      <Navbar />
      <section className="flex-grow text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Welcome to own</h1>
        <p className="text-lg mb-8">Find the perfect place to call home. Browse our collection of rental properties and get started today.</p>
        <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600">Browse Listings</button>
      </section>
      
      <section className="bg-gray-700 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Featured Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* You can add Property Card components here */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold">Property 1</h3>
              <p className="mt-2">Description of the property.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold">Property 2</h3>
              <p className="mt-2">Description of the property.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold">Property 3</h3>
              <p className="mt-2">Description of the property.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 py-6 text-center text-sm">
        <p>&copy; 2025 Rent Co. All rights reserved.</p>
      </footer>
    </div>
  );
}
