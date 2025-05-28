import { useEffect, useRef, useState } from "react";
import HotelCard from "./HotelCard";
import React from "react";

type Hotel = {
  id: number;
  name: string;
  image: string;
  price: number;
  stars: number;
  location: string;
};

type Props = {
  onAdd: (hotel: Hotel) => void;
};

const allHotels: Hotel[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Hotel ${i + 1}`,
  image: `https://picsum.photos/seed/hotel${i}/300/200`,
  price: Math.floor(Math.random() * 500) + 100,
  stars: [3, 4, 5][Math.floor(Math.random() * 3)],
  location: ["Cartagena", "Bogotá", "Medellín", "Cali"][
    Math.floor(Math.random() * 4)
  ],
}));

export default function HotelList({ onAdd }: Props) {
  const [visibleHotels, setVisibleHotels] = useState<Hotel[]>([]);
  const [page, setPage] = useState(1);
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [locationFilter, setLocationFilter] = useState<string>("");

  const loader = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, []);

  useEffect(() => {
    const filtered = allHotels.filter(
      (hotel) =>
        (!starFilter || hotel.stars === starFilter) &&
        (!locationFilter ||
          hotel.location.toLowerCase().includes(locationFilter.toLowerCase()))
    );
    const hotelsToShow = filtered.slice(0, page * 10);
    setVisibleHotels(hotelsToShow);
  }, [page, starFilter, locationFilter]);

  return (
    <div>
      <h2>Hoteles Disponibles</h2>

      {/* Filtros */}
      <div style={{ marginBottom: 20 }}>
        <label>Filtrar por estrellas: </label>
        <select
          onChange={(e) =>
            setStarFilter(e.target.value ? parseInt(e.target.value) : null)
          }
          value={starFilter || ""}
        >
          <option value="">Todas</option>
          <option value="3">3 estrellas</option>
          <option value="4">4 estrellas</option>
          <option value="5">5 estrellas</option>
        </select>

        <label style={{ marginLeft: 20 }}>Ubicación: </label>
        <input
          type="text"
          placeholder="Ciudad..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
      </div>

      {/* Lista de hoteles con cuadrícula 4 columnas */}
      <div className="hotel-grid">
        {visibleHotels.map((hotel) => (
          <HotelCard key={hotel.id} {...hotel} onAdd={() => onAdd(hotel)} />
        ))}
        <div ref={loader} style={{ height: 1 }}></div>
      </div>
    </div>
  );
}
