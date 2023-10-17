const express = require('express')
const app = express()
const port = 3000


const cors = require('cors')
app.use(cors())

const path = require('path')
app.use('/static', express.static(path.join(__dirname, 'public/images')))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended:false }))

const mhsRouter = require('./routes/mahasiswa')
app.use('/api/mhs', mhsRouter)

const jurusanRouter = require('./routes/jurusan')
app.use('/api/jurusan', jurusanRouter)

const ktp = require('./routes/ktp')
app.use('/api/ktp', ktp)

const detailKK = require('./routes/detailKK')
app.use('/api/detailKK', detailKK)

const kartuKeluarga = require('./routes/kartuKeluarga')
app.use('/api/kartuKeluarga', kartuKeluarga)

app.listen(port,() => {
    console.log(`http:://localhost:${port}`)
})