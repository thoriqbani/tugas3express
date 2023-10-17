const express = require('express')
const router = express.Router()

const connection = require('../config/database')
const {body, validationResult} = require('express-validator')

router.get('/', function(req,res){
    connection.query('select * from kartu_keluarga order by no_kk desc', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server failed'
            })
        } else {
            return res.status(200).json({
                status: true,
                message:'Data Keluarga',
                data: rows
            })
        }
    })
})

router.post('/store', [ 
    body('no_kk').notEmpty(),
    body('alamat').notEmpty(),
    body('rt').notEmpty(),
    body('rw').notEmpty(),
    body('kode_pos').notEmpty(),
    body('desa_kelurahan').notEmpty(),
    body('kecamatan').notEmpty(),
    body('kabupaten_kota').notEmpty(),
    body('provinsi').notEmpty()
], (req, res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        })
    }
    let Data = {
        no_kk: req.body.no_kk,
        alamat: req.body.alamat,
        rt: req.body.rt,
        rw: req.body.rw,
        kode_pos: req.body.kode_pos,
        desa_kelurahan: req.body.desa_kelurahan,
        kecamatan: req.body.kecamatan,
        kabupaten_kota: req.body.kabupaten_kota,
        provinsi: req.body.provinsi
    }
    connection.query('insert into kartu_keluarga set ? ', Data, function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server failed',
                error : err
            })
        } else {
            return res.status(201).json({
                status: true,
                message:'KK Create',
                data: rows[0]
            })
        }
    })
})

router.get('/(:no_kk)', function(req,res) {
    let no_kk = req.params.no_kk
    connection.query(`select * from kartu_keluarga where no_kk = ${no_kk}`, function(err,rows){
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
                message:'data Keluarga',
                data: rows[0]
            })
        }
    })
})

router.patch('/update/:no_kk',[
    body('no_kk').notEmpty(),
    body('alamat').notEmpty(),
    body('rt').notEmpty(),
    body('rw').notEmpty(),
    body('kode_pos').notEmpty(),
    body('desa_kelurahan').notEmpty(),
    body('kecamatan').notEmpty(),
    body('kabupaten_kota').notEmpty(),
    body('provinsi').notEmpty()
], (req,res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        })
    }
    let no_kk = req.params.no_kk
    let data = {
        no_kk: req.body.no_kk,
        alamat: req.body.alamat,
        rt: req.body.rt,
        rw: req.body.rw,
        kode_pos: req.body.kode_pos,
        desa_kelurahan: req.body.desa_kelurahan,
        kecamatan: req.body.kecamatan,
        kabupaten_kota: req.body.kabupaten_kota,
        provinsi: req.body.provinsi
    }
    connection.query(`update kartu_keluarga set ? where no_kk = ${no_kk}`, data, function(err,rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server error',
                error: err
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'update',
                data:rows[0]
            })
        }
    })
})

router.delete('/delete/(:no_kk)', function(req, res){
    let no_kk = req.params.no_kk
    connection.query(`delete from kartu_keluarga where no_kk = ${no_kk}`, function(err, rows){
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

module.exports = router