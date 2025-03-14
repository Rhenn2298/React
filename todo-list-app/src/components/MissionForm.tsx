import React, { useEffect, useState } from 'react';  
import { Mission } from '../App';
import { Paper,Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import {  } from '@mui/icons-material';

export interface MissionFormProps {
  initialMission?: Partial<Mission>;
  onSubmit: (mission: Omit<Mission, 'id' | 'dependencies' | 'priority' | 'isCompleted'>) => void;
  buttonText: string;
}

const MissionForm: React.FC<MissionFormProps> = ({ initialMission,onSubmit,buttonText }) =>{
  const [value, setValue] = useState(initialMission?.value || '');  
  const [category, setCategory] = useState(initialMission?.category || '');
  const [map, setMap] = useState(initialMission?.map || '');
  const [notes, setNotes] = useState(initialMission?.notes || '');

  useEffect(()=> {
    if(initialMission){
      setValue(initialMission.value || '' );
      setCategory(initialMission.category || 'Tameos');
      setMap(initialMission.map || 'General');
      setNotes(initialMission.notes || '');
    }
  }, [initialMission]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();  // Evitar el comportamiento por defecto del formulario (recargar la página)
    if (value.trim() === '') {
      alert('La descripción de la misión no puede estar vacía.'); 
      return;
    }
   onSubmit({value, category, map, notes});

   if(!initialMission){
    setValue('');
    setCategory('Tameos');
    setMap('General');
    setNotes('');
   }
  };

  return (
    <Paper elevation={1} sx={{ padding: '0.1rem', marginBottom: '0.5rem', backgroundColor: '#CED2BC' }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{display: 'flex', 
                  flexDirection: 'column', 
                  marginBottom: '0.5rem',
                '& .MuiTextField-root': { width: '20ch' }}}>
          
          <Box   //nombre de la mision
            sx={{ display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center' ,
                  fontSize: 14,
                '& > :not(style)': { m: 1, width: '20ch' } }}
          >          
            <TextField  
              label="Nombre de la misión"
              id="outlined-basic"
              variant='outlined'
              value={value}
              onChange={(e) => setValue(e.target.value)} 
              required
              size="small"
              color='secondary'
              sx={{ '& .MuiFormLabel-root': { fontSize: '0.8rem', }, }}            
            />
          </Box>
          <Box //categoria   
            sx={{ display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  fontSize: 14, 
                  '& > :not(style)': { m: 1, width: '20ch' } }}>
            <FormControl fullWidth>
              <InputLabel id="category-label" color='secondary'>Categoría</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  label="Categoría" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  size="small"
                  color='secondary'
                  sx={{ '& .MuiFormLabel-root': { fontSize: '0.8rem', }, }}
                >
                  <MenuItem value="Tameos">Tameos</MenuItem> 
                  <MenuItem value="Farmeos">Farmeos</MenuItem> 
                  <MenuItem value="Exploracion">Exploración</MenuItem> 
                  <MenuItem value="Artefacto">Artefacto</MenuItem> 
                  <MenuItem value="Bosses">Bosses</MenuItem> 
                  <MenuItem value="Crianza">Crianza</MenuItem> 
                  <MenuItem value="Construccion">Construcción</MenuItem>
                  <MenuItem value="Botin">Botín</MenuItem>
                </Select>
              </FormControl>
          </Box>
          <Box //mapa
            sx={{ display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  fontSize: 14, 
                  '& > :not(style)': { m: 1, width: '20ch'} }}>
            <FormControl fullWidth >
              <InputLabel id="map-label" color='secondary'>Mapa</InputLabel>
                <Select  
                  labelId="map-label"
                  id="map"
                  label="Mapa"
                  value={map} 
                  onChange={(e) => setMap(e.target.value)}
                  size="small"
                  color='secondary' 
                  sx={{ '& .MuiFormLabel-root': { fontSize: '0.8rem', }, }}

                >
                  <MenuItem value="General">General</MenuItem>
                  <MenuItem value="The Island">The Island</MenuItem>
                  <MenuItem value="Scorched Earth">Scorched Earth</MenuItem>
                  <MenuItem value="Aberration">Aberration</MenuItem>
                  <MenuItem value="Extinction">Extinction</MenuItem>
                  <MenuItem value="Genesis: Part 1">Genesis: Part 1</MenuItem>
                  <MenuItem value="Genesis: Part 2">Genesis: Part 2</MenuItem>
                  <MenuItem value="Ragnarok">Ragnarok</MenuItem>
                  <MenuItem value="Valguero">Valguero</MenuItem>
                  <MenuItem value="Crystal Isles">Crystal Isles</MenuItem>
                  <MenuItem value="Fjordur">Fjordur</MenuItem>
                  <MenuItem value="Lost Island">Lost Island</MenuItem>
                  <MenuItem value="The Center">The Center</MenuItem>
                </Select>
            </FormControl>
          </Box>
          <Box //Notas
            sx={{ display: 'flex',
                  flexDirection: 'column', 
                  alignItems: 'center',
                  fontSize: 14,
                  '& .MuiTextField-root': { width: '20ch' } }}
          >
            <TextField
              id="outlined-multiline-static" 
              label="Notas adicionales"
              multiline 
              rows={2}
              variant='filled'
              value={notes}
              size='small'
              color='secondary'
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas adicionales"
              sx={{ '& .MuiFormLabel-root': { fontSize: '0.8rem', }, }}
            />
            <Button type="submit"
                    variant="contained" 
                    color='success' 
                    size="small"
                    sx={{ width: '22ch', mt: 1 }}
                    >Añadir</Button>
          </Box>
        </Box>    
      </form>
    
    </Paper>

  );
}

export default MissionForm;
