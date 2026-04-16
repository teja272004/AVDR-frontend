import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Shirt } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
        <Shirt /> AI Try-On
      </Link>
      <UserButton afterSignOutUrl="/login" />
    </nav>
  );
}