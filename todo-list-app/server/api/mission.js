const express = require('express');
const router = express.Router();
const db = require('../server');

router.post('/',(req, res)=>{
    const {value, category, map, notes, dependencies, priority, isCompleted}=req.body;
//control de datos para BBDD
if (!value || !category || !map || !priority || typeof isCompleted === 'undefined') {
    return res.status(400).json({ error: 'Datos incompletos o inválidos' });
}
//creacion de la consulta a BBDD
const insertMissionQuery = `INSERT INTO mission (value, category, map, notes, dependencies, priority, isCompleted) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(insertMissionQuery, [value, category, map, notes, JSON.stringify(dependencies), priority, isCompleted], (err,result) =>{
    //control de errores con error 500
        if (err) {
            console.error('Error en la consulta:', err.message);
            return res.status(500).json({error:err.message});
        }
        res.status(201).json({
            message:'mision creada',
            mission: {
                id: result.insertId,
                value,
                category,
                map,
                notes,
                dependencies,
                priority,
                isCompleted
            }
        });
    });
});

//Rutas CRUD
module.exports = router;










