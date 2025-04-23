import React, { useState } from 'react';

export default function Modal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <>
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Bem-vindo à sua Carteira de Imóveis</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
          onClick={openModal}
        >
          Nova Transação
        </button>
      </header>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">Cadastrar Novo Imóvel</h3>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nome do Imóvel</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Digite o nome do imóvel"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Valor</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Digite o valor"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}