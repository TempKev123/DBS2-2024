import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Card from "@/components/Card";
export default function Rent() {
  return (
    <div className="bg-gray-800 text-white min-h-screen flex flex-col">
      <Navbar />
      <h1>In Your area:</h1>
      <div></div>
      <Card
        title="Ford Focus"
        description="2 Large Bags | 5 Seats"
        ownername="Mike Kyaw"
        imageUrl="https://cdn2.rcstatic.com/images/car_images/new_images/ford/focus.jpg"
        buttonText="$40/hr"
      />
    </div>
  );
}
