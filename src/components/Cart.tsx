import React, { useState } from "react";
import "../styles.css";

type Hotel = {
  id: number;
  name: string;
  price: number;
  stars: number;
  location: string;
  image: string;
};

type Props = {
  items: Hotel[];
  budget: number;
  onRemove: (id: number) => void;
  onClear: () => void;
  onClose: () => void;
};

export default function Cart({
  items,
  budget,
  onRemove,
  onClear,
  onClose,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSecurityCode, setShowSecurityCode] = useState(false);

  // Calcular el total del carrito
  const total = items.reduce((sum, item) => sum + item.price, 0);

  const validateForm = () => {
    setError(null);
    if (!/^\d{16}$/.test(cardNumber.replace(/\s+/g, ""))) {
      setError("Número de tarjeta inválido.");
      return false;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      setError("Fecha de expiración inválida.");
      return false;
    }
    if (!/^\d{3}$/.test(securityCode)) {
      setError("Código de seguridad inválido.");
      return false;
    }
    if (cardHolder.trim() === "") {
      setError("Nombre del titular es obligatorio.");
      return false;
    }
    if (total > budget) {
      setError("El total excede tu presupuesto.");
      return false;
    }
    return true;
  };

  const handleConfirmPurchase = () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulamos un proceso de compra con éxito o error
    new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() < 0.5;
        success ? resolve() : reject(new Error("Error en el procesamiento"));
      }, 2000);
    })
      .then(() => {
        alert("✅ ¡Compra realizada con éxito!");
        onClear(); // Limpiar el carrito
        onClose(); // Regresar a la lista de hoteles
        setShowModal(false); // Cerrar el modal
        setCardNumber(""); // Resetear los valores de la tarjeta
        setExpiry("");
        setSecurityCode("");
        setCardHolder("");
      })
      .catch((error) => {
        console.error("Fallo en la compra:", error);
        alert("❌ La compra falló. Intenta nuevamente.");
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  return (
    <div className="cart-container">
      <h2>Carrito</h2>
      <p>Total: ${total.toLocaleString("es-CO")}</p>

      {/* Tabla con los detalles del carrito */}
      <table className="cart-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Ubicación</th>
            <th>Estrellas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>${item.price.toLocaleString("es-CO")}</td>
                <td>{item.location}</td>
                <td>{item.stars} estrellas</td>
                <td>
                  <button onClick={() => onRemove(item.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No hay artículos en el carrito.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Botones de acción */}
      <button onClick={onClear}>Vaciar carrito</button>
      <button onClick={onClose}>Cancelar</button>
      <button onClick={() => setShowModal(true)}>Finalizar compra</button>

      {/* Modal de pago */}
      {showModal && (
        <div className="modal-overlay active">
          <div className="modal-content payment-modal">
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ×
            </button>
            <h2>Detalles del Pago</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <label>Número de Tarjeta</label>
              <input
                type="text"
                maxLength={19}
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(
                    e.target.value
                      .replace(/\D/g, "")
                      .replace(/(.{4})/g, "$1 ")
                      .trim()
                  )
                }
                placeholder="1234 5678 9012 3456"
              />

              <label>Fecha de Expiración (MM/AA)</label>
              <input
                type="text"
                maxLength={5}
                value={expiry}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "");
                  if (val.length > 2)
                    val = val.slice(0, 2) + "/" + val.slice(2, 4);
                  setExpiry(val);
                }}
                placeholder="MM/AA"
              />

              <label>Código de Seguridad (CVC)</label>
              <div className="input-inline">
                <input
                  type={showSecurityCode ? "text" : "password"}
                  maxLength={3}
                  value={securityCode}
                  onChange={(e) =>
                    setSecurityCode(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="CVC"
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() => setShowSecurityCode(!showSecurityCode)}
                >
                  {showSecurityCode ? "🙈" : "👁️"}
                </button>
              </div>

              <label>Nombre del Titular</label>
              <input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                placeholder="Nombre completo"
              />

              {error && <p className="form-error">{error}</p>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn primary"
                  disabled={isProcessing}
                  onClick={handleConfirmPurchase}
                >
                  {isProcessing ? "Procesando..." : `Pagar $${total}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
