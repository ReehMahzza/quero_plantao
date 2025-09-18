// src/components/FormularioPlantao.jsx

import React, { useState } from 'react';

function FormularioPlantao({ onCancel, onSave }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    valorOferecido: '',
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // AQUI ESTÁ A MUDANÇA: Agora chamamos a função onSave que recebemos via props.
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6">Publicar Novo Plantão</h2>

      {/* Dados Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input name="titulo" value={formData.titulo} onChange={handleChange} type="text" placeholder="Título do Plantão (Ex: Enfermeiro UTI 12h)" className="p-2 border rounded" required />
        <input name="valorOferecido" value={formData.valorOferecido} onChange={handleChange} type="number" placeholder="Valor Oferecido (R$)" className="p-2 border rounded" required />
        <input name="dataInicio" value={formData.dataInicio} onChange={handleChange} type="datetime-local" className="p-2 border rounded" required />
        <input name="dataFim" value={formData.dataFim} onChange={handleChange} type="datetime-local" className="p-2 border rounded" required />
      </div>
      <textarea name="descricao" value={formData.descricao} onChange={handleChange} placeholder="Descrição detalhada do plantão..." className="w-full p-2 border rounded mb-6" rows="4"></textarea>

      {/* Endereço */}
      <h3 className="text-xl font-semibold mb-4">Endereço do Plantão</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input name="cep" value={formData.cep} onChange={handleChange} type="text" placeholder="CEP" className="p-2 border rounded" />
        <input name="logradouro" value={formData.logradouro} onChange={handleChange} type="text" placeholder="Logradouro" className="p-2 border rounded col-span-2" />
        <input name="numero" value={formData.numero} onChange={handleChange} type="text" placeholder="Número" className="p-2 border rounded" />
        <input name="bairro" value={formData.bairro} onChange={handleChange} type="text" placeholder="Bairro" className="p-2 border rounded" />
        <input name="cidade" value={formData.cidade} onChange={handleChange} type="text" placeholder="Cidade" className="p-2 border rounded" />
        <input name="estado" value={formData.estado} onChange={handleChange} type="text" placeholder="Estado (UF)" className="p-2 border rounded" />
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end gap-4">
        <button type="button" onClick={onCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
          Cancelar
        </button>
        <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded">
          Salvar Plantão
        </button>
      </div>
    </form>
  );
}

export default FormularioPlantao;