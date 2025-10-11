'use client';
import { useState } from 'react';

const TOTAL_NUMBERS = 100;

export default function RifaPage() {
  const [selected, setSelected] = useState<number | null>(null);
  // Simulação de números já reservados
  const reservedNumbers = [5, 12, 23, 45, 67];

  const handleSelect = (num: number) => {
    if (reservedNumbers.includes(num)) return;
    setSelected(num);
  };

  const handlePayment = () => {
    if (selected) {
      alert(`Pagamento iniciado para o número ${selected}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold text-center mb-6">Rifa Solidária</h1>
      <p className="text-center mb-8">
        Escolha um número e participe da nossa rifa! Números já reservados estão
        desabilitados.
      </p>
      <div className="grid grid-cols-5 gap-3 mb-8">
        {Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`p-3 rounded border text-sm font-bold transition-colors duration-150
              ${
                reservedNumbers.includes(num)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : selected === num
                  ? 'bg-orange-500 text-white border-orange-700'
                  : 'bg-white hover:bg-orange-100 border-gray-300'
              }`}
            disabled={reservedNumbers.includes(num)}
            onClick={() => handleSelect(num)}
          >
            {num}
          </button>
        ))}
      </div>
      <div className="text-center">
        <button
          className="bg-orange-500 text-white px-6 py-2 rounded font-bold disabled:bg-gray-300"
          disabled={selected === null}
          onClick={handlePayment}
        >
          Pagar número {selected ?? ''}
        </button>
      </div>
    </div>
  );
}
