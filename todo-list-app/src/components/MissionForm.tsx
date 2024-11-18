import React, { useState } from 'react';  
import { Mission } from '../App';
interface MissionFormProps {
  addMission: (mission: Omit<Mission, 'id' | 'dependencies' | 'priority' | 'isCompleted'>) => void;
}

const MissionForm: React.FC<MissionFormProps> = ({ addMission }) =>{
  const [value, setValue] = useState<string>('');  
  const [category, setCategory] = useState<string>('Tameos');
  const [map, setMap] = useState<string>('General');
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();  // Evitar el comportamiento por defecto del formulario (recargar la página)
    if (value.trim() === '') {
      alert('La descripción de la misión no puede estar vacía.'); 
      return;
    }
    addMission({ value, category, map, notes });  // Llamar a la función addMission pasada como prop para añadir la nueva misión
    setValue(''); // Limpiar el campo de texto
    setNotes(''); // Limpiar el campo de notas
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)} 
        placeholder="Añadir nueva misión"
        required
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
