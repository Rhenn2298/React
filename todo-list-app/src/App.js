import React, { useState } from 'react';
import MissionForm from './components/MissionForm';
import MissionList from './components/MissionList';

function App() {
  const [missions, setMissions] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentMission, setCurrentMission] = useState({});
  const [newCategory, setNewCategory] = useState(currentMission.category);


  const addMission = (mission) => {
    let dependencies = [];
    let priority;

    if (mission.category === "Tameos" || mission.category === "Farmeos") { 
      priority = "Alta"; 
    } else if (mission.category === "Artefacto" || mission.category === "Exploracion") {
      priority = "Media"; 
    } else if (mission.category === "Crianza" || mission.category === "Construccion" || mission.category === "Bosses") { 
      priority = "Baja"; 
    }
    
    if (mission.category === "Crianza") {
      const tameoMissions = missions.filter(m => m.category === "Tameos" && !m.isCompleted);
      if (tameoMissions.length === 0) {
        alert("Debe existir al menos una misión de Tameos antes de crear una misión de Crianza.");
        return;
      } else {
        dependencies = tameoMissions.map(m => m.id);
      }
    }

    if (mission.category === "Construccion") {
      const farmeoMissions = missions.filter(m => m.category === "Farmeos" && !m.isCompleted);
      if (farmeoMissions.length === 0) {
        alert("Debe existir al menos una misión de Farmeos antes de crear una misión de Construcción.");
        return;
      } else {
        dependencies = farmeoMissions.map(m => m.id);
      }
    }

    if (mission.category === "Bosses") {
      const artefactoMissions = missions.filter(m => m.category === "Artefacto" && !m.isCompleted);
      if (artefactoMissions.length === 0) {
        alert("Debe existir al menos una misión de Artefacto antes de crear una misión de Bosses.");
        return;
      } else {
        dependencies = artefactoMissions.map(m => m.id);
      }
    }

    const newMissions = [...missions, { ...mission, id: Date.now(), dependencies, priority, isCompleted: false }];
    setMissions(newMissions);
  };

  const completeMission = (index) => {
    const missionToComplete = missions[index];

    const allDependenciesCompleted = missionToComplete.dependencies.every(depId =>
      missions.find(m => m.id === depId)?.isCompleted
    );

    if (!allDependenciesCompleted) {
      if (!window.confirm("Estás intentando completar una misión sin haber cumplido los requisitos previos. ¿Quieres completarla de todos modos?")) {
        return;
      }
    }

    const newMissions = [...missions];
    newMissions[index].isCompleted = !newMissions[index].isCompleted;
    setMissions(newMissions);
  };

  const deleteMission = (index) => {
    const missionToDelete = missions[index];

    const isDependencyForOthers = missions.some(m => m.dependencies.includes(missionToDelete.id));
    if (isDependencyForOthers) {
      if (!window.confirm("Estás eliminando una misión necesaria para completar otra misión. ¿Estás seguro?")) {
        return;
      }
    }

    const newMissions = missions.filter((_, i) => i !== index);
    setMissions(newMissions);
  };

  const editMission = (index) => {
    setEditing(true);
    setCurrentMission({ ...missions[index], index });
  };

  const updateMission = (newMissionText, newCategory, newMap, newPriority, newNotes) => {
    const newMissions = [...missions];
    newMissions[currentMission.index] = {
      ...newMissions[currentMission.index],
      text: newMissionText,
      category: newCategory,
      map: newMap,
      priority: newPriority,
      notes: newNotes
    };
    setMissions(newMissions);
    setEditing(false);
    setCurrentMission({});
  };

  return (
    <div className="App">
      <h1>Misiones de Ark</h1>
      <MissionForm addMission={addMission} />
      <MissionList
        missions={missions}
        completeMission={completeMission}
        deleteMission={deleteMission}
        editMission={editMission}
      />
{editing && (
  <div>
    <input 
      type="text" 
      value={currentMission.text}
      onChange={(e) => setCurrentMission({ ...currentMission, text: e.target.value })}
    />
    <select //categoria
      value={currentMission.category}
      onChange={(e) => {
        const selectedCategory = e.target.value;
        const currentCategory = currentMission.category;
        let affectedCategory;

        // Verificar si la categoría actual es una de las que afectan a otras
        if (currentCategory === "Tameos" || currentCategory === "Farmeos" || currentCategory === "Artefacto") {
          if (currentCategory === "Tameos") {
            affectedCategory = "Crianza";
          } else if (currentCategory === "Farmeos") {
            affectedCategory = "Construcción";
          } else if (currentCategory === "Artefacto") {
            affectedCategory = "Bosses";
          }

          if (selectedCategory !== currentCategory) {
            if (window.confirm(`¿Estás seguro de cambiar la categoría de "${currentCategory}" a "${selectedCategory}"? Esto puede afectar a la categoría dependiente "${affectedCategory}".`)) {
              setCurrentMission({ ...currentMission, category: selectedCategory });
              setNewCategory(selectedCategory);
            } else {
              setCurrentMission({ ...currentMission, category: currentCategory });
            }
          }
        } else {
          setCurrentMission({ ...currentMission, category: selectedCategory });
          setNewCategory(selectedCategory);
        }
      }}
    > 
      <option value="Tameos">Tameos</option>
      <option value="Farmeos">Farmeos</option>
      <option value="Exploracion">Exploracion</option>
      <option value="Artefacto">Artefacto</option>
      <option value="Bosses">Bosses</option>
      <option value="Crianza">Crianza</option>
      <option value="Construccion">Construccion</option>
    </select>
    <select //mapas
      value={currentMission.map}
      onChange={(e) => setCurrentMission({ ...currentMission, map: e.target.value })}
    >
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
      value={currentMission.notes}
      onChange={(e) => setCurrentMission({ ...currentMission, notes: e.target.value })}
      placeholder="Notas adicionales"
    />
    <div> 
      <strong>Prioridad Asignada:</strong> 
      <input type="text" value={currentMission.priority} readOnly /> 
    </div>
    <button onClick={() => updateMission(currentMission.text, newCategory, currentMission.map, currentMission.priority, currentMission.notes)}>Actualizar</button>
  </div>
)}

    </div>
  );
}

export default App;
