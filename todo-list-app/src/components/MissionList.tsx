import React, {useState} from 'react';  // Importar React
import { Mission } from '../App';  // Importar interfaz Mission desde App.tsx
import MissionForm from './MissionForm';
import { Card, CardContent, Typography, Box, Dialog ,DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

interface MissionListProps {
  missions: Mission[];  // Propiedad missions de tipo Mission[]
  completeMission: (id:number) => void;  // Propiedad completeMission de tipo función que recibe un número y no retorna nada
  deleteMission: (id:number) => void;  // Propiedad deleteMission de tipo función que recibe un número y no retorna nada
  editMission: (id:number) => void;  // Propiedad editMission de tipo función que recibe un número y no retorna nada
  updateMission: (id: number, newMissionText: string, 
                  newCategory: string, newMap: string, 
                  newNotes: string                    )=>void;
  currentMission: Partial<Mission>;
  setCurrentMission: React.Dispatch<React.SetStateAction<Partial<Mission>>>;
  newCategory: string|undefined;
  setNewCategory: React.Dispatch<React.SetStateAction<string | undefined>>;
  //editing: boolean;
  //setEditing: React.Dispatch<React.SetStateAction<boolean>>;

}

const MissionList: React.FC<MissionListProps> = ({
  missions, 
  completeMission, 
  deleteMission, 
  editMission,
  updateMission,
  currentMission,
  setCurrentMission,
  newCategory,
  setNewCategory,
  //editing,
  //setEditing,

  }) => 
    {
      //const para visualizacion de las misiones
      const incompleteMissions = missions.filter(mission => !mission.isCompleted);
      const completedMissions = missions.filter(mission => mission.isCompleted);
      const revertMissionCompletion = (id: number) => {
        if (window.confirm("¿Quieres marcar esta misión como sin completar?")){
          completeMission(id);
        }
      }
   
      const handleEditMission = (id: number) => {
        editMission(id); // Llama a la función de edición
        setOpenEditDialog(true); // Abre el Dialog
      };
      const [openEditDialog, setOpenEditDialog] = useState(false);      
      const handleCloseEditDialog = () => {
        setOpenEditDialog(false); // Cierra el diálogo de edición
      };
      return (
      <>
        {/* Sección de Misiones por Completar */}
        <Box sx={{
          overflow: "auto",
          display: "flex",
          gap:"10px",
          padding:"10px",
          "&::-webkit-scrollbar": { height: "8px" },
          "&::-webkit-scrollbar-thumb": { background: "#888", borderRadius: "4px" },
          }}>   
          {incompleteMissions.map((mission, index) => (
            <Card 
              key={index}
              sx={{
                backgroundColor: "#CED2BC",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "350px",
                width: "300px",
                gap: "25px",
                boxShadow: 5,
                padding: "5px",
                flexShrink: 0,
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  backgroundColor: "#80d8ff",
                }                
              }}
            >
              <CardContent>  
                <Typography variant="h4" color='secondary' fontWeight="bold">{mission.value}</Typography>
                <Typography variant="body2"  fontStyle="italic" color="textSecondary" >{mission.map}</Typography>  

                <Box
                  sx={{
                    background: "rgb(248, 248, 248)",
                    width: "250px",
                    height: "200px",
                    border: "2px solid #ccc",
                    boxShadow: "3px 2px 6px rgb(117, 107, 10)",
                    overflow: "auto",
                    padding: "2px",
                  }}
                >
                  {mission.notes && (
                    <Typography variant="body1" 
                      sx={{ 
                        background: `repeating-linear-gradient(white, white 22px,rgba(166, 168, 158, 0.29) 23px)`,
                        fontSize: "16px",
                        lineHeight: "23px",
                        paddingTop: "3px",
                        paddingLeft: "5px", 
                        textAlign: "left",
                        }}>
                      Notas: {mission.notes}
                    </Typography>
                  )}
                </Box>
                <button onClick={() => completeMission(mission.id)}>Completada</button>
                <button onClick={() => handleEditMission(mission.id)}>Editar</button>
                <button onClick={() => deleteMission(mission.id)}>Eliminar</button>
              </CardContent>
            </Card>
            ))}
          </Box>
          
        {/* Sección de Misiones Completadas */}
        {completedMissions.length > 0 && (
          <Box sx={{ marginTop: "20px" }}>
            <Typography variant="body1"  fontStyle="italic" color="#80d8d0" sx={{ marginBottom: "0px" }}>
                Completadas:
          </Typography>
            <Box sx={{
                    display: "flex",
                    overflowX: "auto",
                    gap: "10px",
                    padding: "10px",
                    "&::-webkit-scrollbar": { height: "8px" },
                    "&::-webkit-scrollbar-thumb": { background: "#888", borderRadius: "4px" },
                  }}>
              {completedMissions.map((mission)=>(
                    
                <Card key={mission.id}
                onClick={() => revertMissionCompletion(mission.id)}
                sx={{
                  backgroundColor: "#A2D0FF",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100px",
                  width: "300px",
                  gap: "25px",
                  boxShadow: 5,
                  padding: "5px",
                  flexShrink: 0,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    backgroundColor: "#80d8ff",
                    }                
                  }}
                > 
                <CardContent>  
                  <Typography variant="h4" color='secondary' fontWeight="bold">{mission.value}</Typography>

                  <Typography variant="body2"  fontStyle="italic" color="textSecondary" >{mission.map}</Typography>  
                </CardContent>     
              </Card>   
              ))}
            </Box>
          </Box>  
        )}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth= "md">
          <DialogTitle> Editar </DialogTitle>
          <DialogContent>
            <MissionForm
            initialMission={currentMission}
            onSubmit={({value, category, map, notes}) => {
              updateMission(
                currentMission.id!,
                value,
                category,
                map,
                notes
              );
              setOpenEditDialog(false);
            }}
            buttonText="Actualizar"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} color="secondary">Cancelar</Button>
          </DialogActions>
        </Dialog>
      </>
  )}                             

export default MissionList;  // Exportar componente MissionList
