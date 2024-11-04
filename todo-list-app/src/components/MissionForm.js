import React, { useState } from 'react';  // Importar React y el Hook useState

function MissionForm({ addMission }) {
  const [value, setValue] = useState('');  // Inicializar estado value con una cadena vacía
  const [category, setCategory] = useState('Tameos');
  const [map, setMap] = useState('General');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();  // Evitar el comportamiento por defecto del formulario (recargar la página)
    if (!value) return;  // Evitar añadir una misión vacía
    addMission({ text: value, category, map, notes });  // Llamar a la función addMission pasada como prop para añadir la nueva misión
    setValue('');  // Restablecer el valor del campo de entrada
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)} 
        placeholder="Añadir nueva misión"
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Tameos">Tameos</option>
        <option value="Farmeos">Farmeos</option>
        <option value="Exploracion">Exploracion</option>
        <option value="Artefacto">Artefacto</option>
        <option value="Bosses">Bosses</option>
        <option value="Crianza">Crianza</option>
        <option value="Construccion">Construccion</option>
      </select>
      <select value={map} onChange={(e) => setMap(e.target.value)}>
        <option value="General">General</option>
        <option value="The Island">The Island</option>
        <option value="Scorched Earth">Scorched Earth</option>
        <option value="Aberration">Aberration</option>
        <option value="Extinction">Extinction</option>
        <option value="Genesis: Part 1">Genesis: Part 1</option>
        <option value="Genesis: Part 2">Genesis: Part 2</option>
        <option value="Ragnarok">Ragnarok</option>
        <option value="Valguero">Valguero</option>
        <option value="Crystal Isles">Crystal Isles</option>
        <option value="Fjordur">Fjordur</option>
        <option value="Lost Island">Lost Island</option>
        <option value="The Center">The Center</option>
      </select>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notas adicionales"
      />
      <button type="submit">Añadir</button>
    </form>
  );
}

export default MissionForm;
