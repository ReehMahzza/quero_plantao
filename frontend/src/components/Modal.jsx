// src/components/Modal.jsx

import React from 'react';

function Modal({ isOpen, onClose, children }) {
  // Se não estiver aberto, não renderiza nada.
  if (!isOpen) {
    return null;
  }

  return (
    // Backdrop: fundo semi-transparente que cobre a tela inteira.
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
      onClick={onClose} // Fecha o modal ao clicar no fundo
    >
      {/* Painel do Modal: container branco para o conteúdo. */}
      <div
        className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-2xl relative"
        onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do modal feche-o
      >
        {/* Botão de Fechar (X) no canto superior direito */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times; {/* Símbolo de 'X' */}
        </button>
        
        {/* Conteúdo dinâmico renderizado aqui */}
        {children}
      </div>
    </div>
  );
}

export default Modal;
