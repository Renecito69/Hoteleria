import React from "react";


type Props = {
  name: string;
  image: string;
  price: number;
  stars: number;
  location: string;
  onAdd: () => void;
};

export default function HotelCard({
  name,
  image,
  price,
  stars,
  location,
  onAdd,
}: Props) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
      <img
        src={image}
        alt={name}
        style={{ width: "100%", height: 150, objectFit: "cover" }}
      />
      <h3>{name}</h3>
      <p>Precio: ${price}</p>
      <p>⭐ {stars} estrellas</p>
      <p>📍 {location}</p>
      <button onClick={onAdd}>Agregar al carrito</button>
    </div>
  );
}
