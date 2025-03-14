import React, { useState } from 'react';
import { createTheme, ThemeProvider, Grid2, Accordion, AccordionDetails}from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import MissionForm from './components/MissionForm';
import MissionList from './components/MissionList';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CategoryCard from './components/CategoryCard';
import images from './components/images';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
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
///enum Priority {
///  BAJA = "Baja", 
///  MEDIA = "Media", 
///  ALTA = "Alta" 
///}
const theme = createTheme({
  palette: {
    mode: 'light', // Puedes cambiar a 'dark' si prefieres un tema oscuro
    primary: {
      main: '#80d8ff', // Color principal
    },
    secondary: {
      main: '#7F1F02', // Color secundario
    },
    success: {
      main: '#00796b',
    },
    background: {
      default: '#0759a6',
      paper: '#00796b',
    },
  },
});
const categories = [
  { name: 'Tameos', image: images.tameo },
  { name: 'Farmeos', image: images.farmeo },
  { name: 'Exploracion', image: images.exploracion },
  { name: 'Artefacto', image: images.artefacto },
  { name: 'Bosses', image: images.bosses },
  { name: 'Crianza', image: images.crianza },
  { name: 'Construccion', image: images.construccion },
  { name: 'Botin', image: images.botin },
];
const categoryDependencies: Record<string, string> = { 
  "Crianza": "Tameos", 
  "Construccion": "Farmeos", 
  "Bosses": "Artefacto",
  "Botin":"Exploracion"
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Estado para la categoría seleccionada
  //const [editing, setEditing] = useState<boolean>(false);
  const [currentMission, setCurrentMission] = useState<Partial<Mission>&{index?: number}>({});
  const [newCategory, setNewCategory] = useState<string | undefined>(currentMission.category);


  const addMission = async (mission: Omit<Mission, 'id' | 'dependencies' | 'priority' | 'isCompleted'>) => {
    
    if (!mission.value || mission.value.trim() === "") {
      alert("La misión no puede estar vacía.");
      return;
    }

// logica dependencias
    let dependencies: number[] = [];
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
    let priority: Priority = priorityMap[mission.category] || Priority.BAJA;
//implementacion de axios| conexion Backend
    try{
      const response = await axios.post('http://localhost:5000/mission',{
        value: mission.value,
        category: mission.category,
        map: mission.map,
        notes: mission.notes,
        dependencies,
        priority,
        isCompleted: false
      });
      setMissions([...missions, response.data.mission]);
      alert('Mision creada');
    } catch (error: any) {
      if (error.response) {
          // El servidor respondió con un estado fuera del rango 2xx
          console.error('Error en la respuesta del servidor:', error.response.data);
          alert(`Error en la creación: ${error.response.data.error}`);
      } else if (error.request) {
          // La solicitud se hizo, pero no hubo respuesta
          console.error('No hubo respuesta del servidor:', error.request);
          alert('No se recibió respuesta del servidor.');
      } else {
          // Error al configurar la solicitud
          console.error('Error al configurar la solicitud:', error.message);
          alert(`Error al configurar la solicitud: ${error.message}`);
      }
  }
  
  };

  const completeMission = (id: number) => {
    console.log(`🔹 Se hizo clic en "Completada" para la misión ${id}`);

    const missionToComplete = missions.find(mission => mission.id === id);

    if (!missionToComplete) {
      console.error(`❌ Error: No se encontró la misión con ID ${id}`);
      return;
  }
    console.log("🔹 Misión antes de completarla:", missionToComplete);

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

    setMissions(prevMissions => {
      console.log("🔹 Misiones antes de actualizar:", prevMissions);
      
      const updatedMissions = prevMissions.map((mission, i) =>
        mission.id === id
          ? { ...mission, isCompleted: !mission.isCompleted } // Cambia solo la misión seleccionada
          : mission
      );

      console.log("🔹 Misiones después de actualizar:", updatedMissions);
      
      return updatedMissions;
    });
};

  const deleteMission = (id:number) => {
    const missionToDelete = missions.find(mission =>mission.id === id);
    if (!missionToDelete) {
      console.error(`❌ Error: No se encontró la misión con ID ${id}`);
      return;
    }
    const isDependencyForOthers = missions.some(m => m.dependencies.includes(missionToDelete.id));
    if (isDependencyForOthers) {
      if (!window.confirm("Estás eliminando una misión necesaria para completar otra misión. ¿Estás seguro?")) {
        return;
      }
    }
    const newMissions = missions.filter(mission => mission.id !== id);
    setMissions(newMissions);
  };

  const editMission = (id:number) => {
   // setEditing(true);
    const missionToEdit = missions.find(mission => mission.id === id);
      if(missionToEdit){
        setCurrentMission({ ...missionToEdit});
      }
  }


  const updateMission = (
    id: number, newMissionText: string, 
    newCategory: string, newMap: string, 
    newNotes: string                    ) => {
    let dependencies: number[] = [];
    let priority: Priority = priorityMap[newCategory] || Priority.BAJA;

    const requiredCategory = categoryDependencies[newCategory];
    if (requiredCategory) { 
      const missionsInRequiredCategory = missions.filter(
                      m => m.category === requiredCategory);
       if (missionsInRequiredCategory.length === 0) {
        alert(`Debe existir al menos una misión de '${requiredCategory}' 
                      antes de cambiar la categoría a '${newCategory}'.`); 
        return;
      } else { 
      dependencies = missionsInRequiredCategory.map(m => m.id); 
      } 
    }

    const newMissions = missions.map(mission =>
      mission.id === id
        ? {...mission, 
            value: newMissionText, 
            category: newCategory, 
            map: newMap, 
            priority, 
            notes: newNotes, 
            dependencies 
          }
        : mission
    ) ;
    setMissions(newMissions);
    
  };
  const filteredMissions = missions.filter(mission => mission.category === selectedCategory);

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    openDialogHandler();
  };
  const [openDialog, setOpenDialog] = useState(false); // Estado del modal
  const openDialogHandler = () => setOpenDialog(true); // Función para abrir el modal
  const closeDialogHandler = () => setOpenDialog(false); // Función para cerrar el modal

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <AppBar position="static" sx={{backgroundColor: theme.palette.background.paper}}>
        <Toolbar>
          <Typography variant="h6" 
          component="div" 
          sx={{ flexGrow: 10, 
                textAlign:'center',
                color: theme.palette.primary.main,
                textShadow: '2px 2px 0 black, -2px -2px 0 black, 2px -2px 0 black, -2px 2px 0 black',
              }}
          style={{ fontFamily: 'Protest Revolution, Arial, sans-serif', fontSize: '3rem' }}
          >
        Misiones Ark
          </Typography>
        </Toolbar>
      </AppBar>
          <Grid2 container spacing={2}  sx={{ //Grid de Formulario
              display: 'grid',
              gridTemplateColumns: '1fr 4fr',
              alignItems: 'flex-start',
              marginTop: '0.5rem',
              overflow: 'hidden',
              margin: 0.5,
              minHeight: 'calc(100vh - 120px)',
              gap: '20px',
              }} >
            <Grid2  sx={{
              display:'grid',
              gridTemplateColumns: '1fr'
            }} >
                <Accordion sx={{margin: 1, marginTop: 0.5}}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{
                  color: theme.palette.primary.main 
                  }}>
                    Agregar misiones
                  </AccordionSummary>
                  <AccordionDetails>
                    <MissionForm onSubmit={addMission} buttonText='Añadir'/>
                  </AccordionDetails>
                </Accordion>
            </Grid2>
            <Grid2 container spacing={2} sx={{ 
              display:'grid',
              margin: 0.5,
              gridTemplateColumns: '1fr 1fr '
              }}> 
              {categories.map((category, index) => ( 
                <Grid2 key={index} sx={{ 
                  overflow: 'hidden',
                  maxHeight: 'calc(100vh / 2)', 
                  marginBottom: '1px' 
                }}>                
                  <CategoryCard key={index} 
                    category={category} 
                    onSelect={handleSelectCategory} 
                  />
                </Grid2>
                ))} 
            </Grid2>      
          </Grid2>

        <Dialog open={openDialog} onClose={closeDialogHandler} fullWidth maxWidth="md">
          <DialogTitle sx={{ flexGrow: 10, 
                color: theme.palette.primary.main,
                textShadow: '2px 2px 0 black, -2px -2px 0 black, 2px -2px 0 black, -2px 2px 0 black',
              }}
              style={{ fontFamily: 'Protest Revolution, Arial, sans-serif', fontSize: '1.5rem' }}
              >{selectedCategory} </DialogTitle>
            <DialogContent>
              <MissionList
                missions={filteredMissions} // Pasamos solo las misiones filtradas
                completeMission={completeMission}
                deleteMission={deleteMission}
                editMission={editMission}
                updateMission={updateMission}
                currentMission={currentMission}
                setCurrentMission={setCurrentMission}
                //editing={editing}
                //setEditing={setEditing}
                newCategory={newCategory}
                setNewCategory={setNewCategory}
              />
            </DialogContent >
            <DialogActions>
              <Button onClick={closeDialogHandler} color="primary">Mostrar otros</Button>
            </DialogActions>
        </Dialog>


    </ThemeProvider>
  );
}

export default App;