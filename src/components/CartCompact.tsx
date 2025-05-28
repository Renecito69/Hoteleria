import React from "react";

type Props = {
  itemCount: number;
  onClick: () => void;
};

export default function CartCompact({ itemCount, onClick }: Props) {
  return (
    <div className="cart-compact" onClick={onClick} title="Ver carrito">
      🛒 Carrito <span className="count">{itemCount}</span>
    </div>
  );
}
