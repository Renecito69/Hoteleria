import { useState } from "react";
import React from "react";


type Props = {
  onSubmit: (name: string, budget: number) => void;
};

export default function CustomerForm({ onSubmit }: Props) {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numericBudget = parseFloat(budget);
    if (!name || isNaN(numericBudget) || numericBudget <= 0) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }

    onSubmit(name, numericBudget);
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <h2>Bienvenido</h2>
      <p>Ingresa tu nombre y el presupuesto que deseas gastar:</p>

      <div style={{ marginBottom: 10 }}>
        <label>Nombre:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Presupuesto ($):</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <button type="submit" style={{ padding: "10px 20px" }}>
        Ingresar
      </button>
    </form>
  );
}
