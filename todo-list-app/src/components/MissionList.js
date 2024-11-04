import React from 'react';  // Importar React

function MissionList({ missions, completeMission, deleteMission, editMission }) {
  return (
    <div>  {/* Contenedor principal para la lista de misiones */}
      {missions.map((mission, index) => (
        <div key={index}>  {/* Cada misión se renderiza dentro de un div con una clave única */}
          <span style={{ textDecoration: mission.isCompleted ? 'line-through' : '' }}>
          {mission.text} - {mission.category} - {mission.map} - Prioridad: {mission.priority} - Notas: {mission.notes}
          </span>
          <button onClick={() => completeMission(index)}>Completada</button>
          <button onClick={() => editMission(index)}>Editar</button>
          <button onClick={() => deleteMission(index)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}

export default MissionList;  // Exportar componente MissionList
