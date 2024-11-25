import React, { useState } from 'react';
import MissionForm from './components/MissionForm';
import MissionList from './components/MissionList';

export interface Mission { 
  id: number; 
  value: string; 
  category: string;
  map: string;
  notes: string; 
  dependencies: number[]; 
  priority: Priority;
  isCompleted: boolean; 
}
enum Priority {
  BAJA = "Baja", 
  MEDIA = "Media", 
  ALTA = "Alta" 
}
const categoryDependencies: Record<string, string> = { 
  "Crianza": "Tameos", 
  "Construccion": "Farmeos", 
  "Bosses": "Artefacto" 
};
const priorityMap: Record<string, Priority> = { 
  Tameos: Priority.ALTA, 
  Farmeos: Priority.ALTA, 
  Artefacto: Priority.MEDIA, 
  Exploracion: Priority.MEDIA, 
  Crianza: Priority.BAJA, 
  Construccion: Priority.BAJA, 
  Bosses: Priority.BAJA 
};

function App() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [editing, setEditing] = useState<boolean>(false);
  const [currentMission, setCurrentMission] = useState<Partial<Mission>&{index?: number}>({});
  const [newCategory, setNewCategory] = useState<string | undefined>(currentMission.category);

  const addMission = (mission: Omit<Mission, 'id' | 'dependencies' | 'priority' | 'isCompleted'>) => {
    
    if (!mission.value || mission.value.trim() === "") {
      alert("La misión no puede estar vacía.");
      return;
    }

    let dependencies: number[] = [];
    let priority: Priority = priorityMap[mission.category] || Priority.BAJA;;
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
    const newMission: Mission = { 
      ...mission, 
      id: Date.now(), 
      dependencies, 
      priority, 
      isCompleted: false 
    };
    setMissions([...missions, newMission]);
    
  };

  const completeMission = (index: number) => {
    const missionToComplete = missions[index];

    const allDependenciesCompleted = missionToComplete.dependencies.every(depId =>
      missions.find(m => m.id === depId)?.isCompleted
    );
    if (!missionToComplete.isCompleted) {
      if (!allDependenciesCompleted) {
        if (!window.confirm("Estás intentando completar una misión sin haber cumplido los requisitos previos. ¿Quieres completarla de todos modos?")) {
          return;
        }
      }
    }
    const newMissions = [...missions];
    newMissions[index].isCompleted = !newMissions[index].isCompleted;
    setMissions(newMissions);
  };

  const deleteMission = (index:number) => {
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

  const editMission = (index:number) => {
    setEditing(true);
    setCurrentMission({ ...missions[index], index });
  };

  const updateMission = (newMissionText: string, newCategory: string, newMap: string, newNotes: string) => {
    let dependencies: number[] = [];
    let priority: Priority = priorityMap[newCategory] || Priority.BAJA;

    const requiredCategory = categoryDependencies[newCategory];
    if (requiredCategory) { 
      const missionsInRequiredCategory = missions.filter(m => m.category === requiredCategory);
       if (missionsInRequiredCategory.length === 0) {
        alert(`Debe existir al menos una misión de '${requiredCategory}' antes de cambiar la categoría a '${newCategory}'.`); 
        return;
      } else { 
      dependencies = missionsInRequiredCategory.map(m => m.id); 
      } 
    }

    const newMissions = [...missions];
    newMissions[currentMission.index!] = {
      ...newMissions[currentMission.index!],
      value: newMissionText,
      category: newCategory,
      map: newMap,
      priority: priority,
      notes: newNotes,
      dependencies: dependencies
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
      value={currentMission.value}
      onChange={(e) => setCurrentMission({ ...currentMission, value: e.target.value })}
    />
    <select //categoria
      value={currentMission.category}
      onChange={(e) => {
        const selectedCategory = e.target.value;
        const currentCategory = currentMission.category;
        let affectedCategory;
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
    <button onClick={() => updateMission(
      currentMission.value as string,
      newCategory as string, 
      currentMission.map as string, 
      currentMission.notes as string)
    }>Actualizar</button>
  </div>
)}

    </div>
  );
}

export default App;