const express = require('express')
const router = express.Router()

const connection = require('../config/database')
const {body, validationResult} = require('express-validator')

const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null,'public/images')
    }, filename: (req,file,cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})

// const authenticateToken = require('./auth/middleware/authenticateToken');
const authenticateToken = require('../routes/auth/middleware/authenticateToken');

router.get('/', authenticateToken,function(req,res){
    connection.query('SELECT mahasiswa.id_m, mahasiswa.nrp, mahasiswa.nama, jurusan.nama_jurusan, mahasiswa.gambar, mahasiswa.swa_foto from mahasiswa join jurusan ON mahasiswa.id_jurusan=jurusan.id_j order by mahasiswa.id_m desc', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server failed',
                error: err
            })
        } else {
            return res.status(200).json({
                status: true,
                message:'Data mahasiswa',
                data: rows
            })
        }
    })
})

router.post('/store', authenticateToken,
    upload.fields([
        {name: 'gambar', maxCount: 1},
        {name: 'swa_foto', maxCount: 1},
    ]), (req, res) => {
    const error = validationResult(req)
        if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        })
    }
    let Data = {
        nama: req.body.nama,
        nrp:req.body.nrp,
        id_jurusan:req.body.id_jurusan,
        gambar: req.files.gambar[0].filename,
        swa_foto: req.files.swa_foto[0].filename
    }
    connection.query('insert into mahasiswa set ? ', Data, function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server failed',
                error: err
            })
        } else {
            return res.status(201).json({
                status: true,
                message:'Success',
                data: rows[0]
            })
        }
    })
})

router.get('/(:id)', authenticateToken, function(req,res) {
    let id= req.params.id
    connection.query(`select * from mahasiswa where id_m = ${id}`, function(err,rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server error'
            })
        }
        if(rows.length <=0){
            return res.status(404).json({
                status: false,
                message: 'Not Found'
            })
        } else {
            return res.status(200).json({
                status: true,
                message:'data mahasiswa',
                data: rows[0]
            })
        }
    })
})

router.patch('/update/:id', authenticateToken,upload.fields([
        {name: 'gambar', maxCount: 1},
        {name: 'swa_foto', maxCount: 1},
    ]), 
    [
        body('nama').notEmpty(),
        body('nrp').notEmpty(),
        body('id_jurusan').notEmpty(),
    ], (req,res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        })
    }
    let id = req.params.id

    let gambar = req.files['gambar'] ? req.files['gambar'][0].filename : null;
    let swa_foto = req.files['swa_foto'] ? req.files['swa_foto'][0].filename : null;
    
    connection.query(`select * from mahasiswa where id_m = ${id}`, function(err,rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server error'
            })
        }
        if(rows.length === 0){
            return res.status(404).json({
                status: false,
                message: 'Not Found'
            })
        }
        const gambarLama = rows[0].gambar
        const swa_fotoLama = rows[0].swa_foto
        
        if(gambarLama && gambar){
            const pathGambar = path.join(__dirname, '../public/images', gambarLama)
            fs.unlinkSync(pathGambar)
        }
        if(swa_fotoLama && swa_foto){
            const pathSwaFoto = path.join(__dirname, '../public/images', swa_fotoLama)
            fs.unlinkSync(pathSwaFoto)
        }
        
        let data = {
            nama:req.body.nama,
            nrp:req.body.nrp,
            id_jurusan:req.body.id_jurusan,
        }
        if(gambar){
            data.gambar = gambar;
        }
        if(swa_foto){
            data.swa_foto = swa_foto;
        }

        connection.query(`update mahasiswa set ? where id_m = ${id}`, data, function(err,rows){
            if(err){
                return res.status(500).json({
                    status: false,
                    message: 'server error'
                })
            } else {
                return res.status(200).json({
                    status: true,
                    message: 'update'
                })
            }
        })
    })
})

router.delete('/delete/(:id)', authenticateToken, function(req, res){
    let id = req.params.id
    connection.query(`select * from mahasiswa where id_m = ${id}`, function(err,rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server error'
            })
        }
        if(rows.length <=0){
            return res.status(404).json({
                status: false,
                message: 'Not Found'
            })
        }
        const gambarLama = rows[0].gambar
        const swa_fotoLama = rows[0].swa_foto
        
        if(gambarLama){
            const pathGambar = path.join(__dirname, '../public/images', gambarLama)
            fs.unlinkSync(pathGambar)
        }
        if(swa_fotoLama){
            const pathSwaFoto = path.join(__dirname, '../public/images', swa_fotoLama)
            fs.unlinkSync(pathSwaFoto)
        }
        
        connection.query(`delete from mahasiswa where id_m = ${id}`, function(err, rows){
            if(err){
                return res.status(500).json({
                    status: false,
                    message: 'server error'
                })
            } else {
                return res.status(200).json({
                    status: true,
                    message: 'Data di hapus'
                })
            }
        })
    })
})

module.exports = router