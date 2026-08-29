import type { Slot } from "../types";

interface SlotListProps {
  slots: Slot[];
  selectedSlotId: string | null;
  onSelect: (slotId: string) => void;
}

export function SlotList({ slots, selectedSlotId, onSelect }: SlotListProps) {
  if (slots.length === 0) {
    return <p className="empty-state">No hay horarios disponibles por el momento.</p>;
  }

  return (
    <ul className="slot-list">
      {slots.map((slot) => {
        const isSelected = slot.id === selectedSlotId;
        return (
          <li key={slot.id}>
            <button
              type="button"
              className={`slot-item ${isSelected ? "slot-item--selected" : ""}`}
              onClick={() => onSelect(slot.id)}
              aria-pressed={isSelected}
            >
              <span className="slot-item__professional">{slot.professional}</span>
              <span className="slot-item__datetime">
                {slot.date} · {slot.time}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
