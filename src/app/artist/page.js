"use client";
import ArtistList from "@/components/ArtistList";

export default function ArtistsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">🎭 Artist Management</h1>
      <ArtistList />
    </div>
  );
}
