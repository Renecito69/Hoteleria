import { useEffect, useRef, useState } from "react";
import HotelCard from "./HotelCard.tsx";
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
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

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

      {/* Lista de hoteles */}
      <div className="hotel-grid">
        {visibleHotels.map((hotel) => (
          <HotelCard
            key={hotel.id}
            {...hotel}
            onAdd={() => onAdd(hotel)}
            onViewDetail={() => setSelectedHotel(hotel)}
          />
        ))}
        <div ref={loader} style={{ height: 1 }}></div>
      </div>

      {/* Vista de detalle */}
      {selectedHotel && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 10,
              width: "80%",
              maxWidth: 500,
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            }}
          >
            <h3>{selectedHotel.name}</h3>
            <img
              src={selectedHotel.image}
              alt={selectedHotel.name}
              style={{ width: "100%", height: 200, objectFit: "cover" }}
            />
            <p>Precio: ${selectedHotel.price}</p>
            <p>Estrellas: {selectedHotel.stars}</p>
            <p>Ubicación: {selectedHotel.location}</p>
            <button onClick={() => setSelectedHotel(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
