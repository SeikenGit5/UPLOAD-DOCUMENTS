const express = require('express')
const multer = require('multer')
const cors = require('cors')
const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')},
    filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)}
})

const fileFilter = (req, file, cb) => {
    const tiposPermitidos = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]

    if (tiposPermitidos.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Tipo de archivo no permitido'), false)
    }}

const upload = multer({ 
    storage, fileFilter 
})

app.post('/upload', upload.single('archivo'), (req, res) => {
    try {
        res.status(200).send({ mensaje: 'Archivo subido exitosamente' })
    } catch (error) {
        console.error('Error al subir el archivo:', error)
        res.status(500).send({ mensaje: 'Falló la subida del archivo' })
    }
})

app.use((err, req, res, next) => {
    if (err) {
        res.status(400).send({ mensaje: err.message })
    } else {
        next()
    }
})

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
})