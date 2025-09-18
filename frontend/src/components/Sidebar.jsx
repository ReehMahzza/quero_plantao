// src/components/Sidebar.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // Importa o Link

// Remove a prop 'setActivePage' que não é mais necessária
function Sidebar() {
  const navItemClasses = "block px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200";

  return (
    <aside className="bg-gray-800 text-white w-64 h-screen fixed">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-center">Quero Plantão</h2>
      </div>
      <nav className="p-4">
        <ul>
          <li className="mb-2">
            {/* Substitui o <a> por <Link> */}
            <Link
              to="/"
              className={navItemClasses}
            >
              Dashboard
            </Link>
          </li>
          <li className="mb-2">
            {/* Substitui o <a> por <Link> */}
            <Link
              to="/plantoes"
              className={navItemClasses}
            >
              Plantões
            </Link>
          </li>
          {/* Mantém os links desabilitados como estão por enquanto */}
          <li className="mb-2">
            <a href="#" className={navItemClasses + " opacity-50 cursor-not-allowed"}>
              Candidatos
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className={navItemClasses + " opacity-50 cursor-not-allowed"}>
              Financeiro
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;