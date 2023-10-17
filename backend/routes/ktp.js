const express = require('express')
const router = express.Router()

const connection = require('../config/database')
const {body, validationResult} = require('express-validator')

router.get('/', function(req,res){
    connection.query('select * from ktp order by nik desc', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server failed'
            })
        } else {
            return res.status(200).json({
                status: true,
                message:'Data KTP',
                data: rows
            })
        }
    })
})

router.post('/store', [
    body('nik').notEmpty(),
    body('nama_lengkap').notEmpty(),
    body('jenis_kelamin').notEmpty(),
    body('tempat_lahir').notEmpty(),
    body('tanggal_lahir').notEmpty(),
    body('agama').notEmpty(),
    body('pendidikan').notEmpty(),
    body('jenis_pekerjaan').notEmpty(),
    body('golongan_darah').notEmpty(),
    body('kewarganegaraan').notEmpty()
], (req, res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        })
    }
    let Data = {
        nik: req.body.nik,
        nama_lengkap: req.body.nama_lengkap,
        jenis_kelamin: req.body.jenis_kelamin,
        tempat_lahir: req.body.tempat_lahir,
        tanggal_lahir: req.body.tanggal_lahir,
        agama: req.body.agama,
        pendidikan: req.body.pendidikan,
        jenis_pekerjaan: req.body.jenis_pekerjaan,
        golongan_darah: req.body.golongan_darah,
        kewarganegaraan: req.body.kewarganegaraan
    }
    connection.query('insert into ktp set ? ', Data, function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server failed',
                error : err
            })
        } else {
            return res.status(201).json({
                status: true,
                message:'KTP Create',
                data: rows[0]
            })
        }
    })
})

router.get('/(:nik)', function(req,res) {
    let nik = req.params.nik
    connection.query(`select * from ktp where nik = ${nik}`, function(err,rows){
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

router.patch('/update/:nik', [
    body('nik').notEmpty(),
    body('nama_lengkap').notEmpty(),
    body('jenis_kelamin').notEmpty(),
    body('tempat_lahir').notEmpty(),
    body('tanggal_lahir').notEmpty(),
    body('agama').notEmpty(),
    body('pendidikan').notEmpty(),
    body('jenis_pekerjaan').notEmpty(),
    body('golongan_darah').notEmpty(),
    body('kewarganegaraan').notEmpty()
], (req,res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        })
    }
    let nik = req.params.nik
    let Data = {
        nik: req.body.nik,
        nama_lengkap: req.body.nama_lengkap,
        jenis_kelamin: req.body.jenis_kelamin,
        tempat_lahir: req.body.tempat_lahir,
        tanggal_lahir: req.body.tanggal_lahir,
        agama: req.body.agama,
        pendidikan: req.body.pendidikan,
        jenis_pekerjaan: req.body.jenis_pekerjaan,
        golongan_darah: req.body.golongan_darah,
        kewarganegaraan: req.body.kewarganegaraan
    }
    connection.query(`update ktp set ? where nik = ${nik}`, Data, function(err,rows){
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
            })
        }
    })
})

router.delete('/delete/(:nik)', function(req, res){
    let nik = req.params.nik
    connection.query(`delete from ktp where nik = ${nik}`, function(err, rows){
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