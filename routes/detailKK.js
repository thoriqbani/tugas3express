const express = require('express')
const router = express.Router()

const connection = require('../config/database')
const {body, validationResult} = require('express-validator')

router.get('/', function(req,res){
    connection.query('select * from detail_kk order by id_detail desc', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server failed'
            })
        } else {
            return res.status(200).json({
                status: true,
                message:'Data Detail KK',
                data: rows
            })
        }
    })
})

router.post('/store', [
    body('NIK').notEmpty(),
    body('ayah').notEmpty(),
    body('ibu').notEmpty(),
    body('no_kk').notEmpty(),
    body('status_hubungan_dalam_keluarga').notEmpty()
], (req, res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        })
    }
    let Data = {
        NIK: req.body.NIK,
        ayah: req.body.ayah,
        ibu: req.body.ibu,
        no_kk: req.body.no_kk,
        status_hubungan_dalam_keluarga: req.body.status_hubungan_dalam_keluarga
    }
    connection.query('insert into detail_kk set ? ', Data, function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server failed',
                error : err
            })
        } else {
            return res.status(201).json({
                status: true,
                message:'Detail KK',
                data: rows[0]
            })
        }
    })
})

router.get('/(:id_detail)', function(req,res) {
    let id_detail= req.params.id_detail
    connection.query(`select * from detail_kk where id_detail = ${id_detail}`, function(err,rows){
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

router.patch('/update/:id_detail',[
    body('NIK').notEmpty(),
    body('ayah').notEmpty(),
    body('ibu').notEmpty(),
    body('no_kk').notEmpty(),
    body('status_hubungan_dalam_keluarga').notEmpty()
], (req,res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        })
    }
    let id_detail = req.params.id_detail
    let data = {
        NIK: req.body.NIK,
        ayah: req.body.ayah,
        ibu: req.body.ibu,
        no_kk: req.body.no_kk,
        status_hubungan_dalam_keluarga: req.body.status_hubungan_dalam_keluarga
    }
    connection.query(`update detail_kk set ? where id_detail = ${id_detail}`, data, function(err,rows){
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

router.delete('/delete/(:id_detail)', function(req, res){
    let id_detail = req.params.id_detail
    connection.query(`delete from detail_kk where id_detail = ${id_detail}`, function(err, rows){
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