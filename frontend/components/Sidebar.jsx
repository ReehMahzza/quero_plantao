import React from 'react';

const IconPlaceholder = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>;

function Sidebar() {
  const navItems = ['Dashboard', 'Plantões', 'Candidatos', 'Financeiro'];

  return (
    <aside className="bg-gray-800 text-white w-64 h-screen fixed top-0 left-0 flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-teal-400">Quero Plantão</h2>
        <p className="text-sm text-gray-400">Visão Instituição</p>
      </div>
      <nav className="flex-1 p-4">
        <ul>
          {navItems.map((item) => (
            <li key={item} className="mb-2">
              <a href="#" className="flex items-center p-3 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200">
                <IconPlaceholder />
                <span>{item}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-6 border-t border-gray-700">
        <p className="text-sm text-gray-500">© 2025 Quero Plantão</p>
      </div>
    </aside>
  );
}

export default Sidebar;