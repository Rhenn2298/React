import React from 'react';  // Importar React
import { Mission } from '../App';  // Importar interfaz Mission desde App.tsx


interface MissionListProps {
  missions: Mission[];  // Propiedad missions de tipo Mission[]
  completeMission: (index: number) => void;  // Propiedad completeMission de tipo función que recibe un número y no retorna nada
  deleteMission: (index: number) => void;  // Propiedad deleteMission de tipo función que recibe un número y no retorna nada
  editMission: (index: number) => void;  // Propiedad editMission de tipo función que recibe un número y no retorna nada
}

const MissionList: React.FC<MissionListProps> = ({ missions, completeMission, deleteMission, editMission }) => {
  return (
    <ul>  {/* Contenedor principal para la lista de misiones */}
      {missions.map((mission, index) => (
        <li key={index}>  {/* Cada misión se renderiza dentro de un div con una clave única */}
          <span style={{ textDecoration: mission.isCompleted ? 'line-through' : '' }}>
          {mission.value} - {mission.category} - {mission.map} - Prioridad: {mission.priority} - Notas: {mission.notes}
          </span>
          <button onClick={() => completeMission(index)}>Completada</button>
          <button onClick={() => editMission(index)}>Editar</button>
          <button onClick={() => deleteMission(index)}>Eliminar</button>
        </li>
      ))}
    </ul>
  );
}                             

export default MissionList;  // Exportar componente MissionList
