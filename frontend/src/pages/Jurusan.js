import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Jurusan() {
  const [jrs, setJrsn] = useState([]);
  const url = "http://localhost:3000/static/";
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response1 = await axios.get("http://localhost:3000/api/jurusan");
    const data1 = await response1.data.data;
    setJrsn(data1);
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [namaJurusan, setNama_jurusan] = useState("");
  const [validation, setValidation] = useState({});

  const handleNamaJurusanChange = (e) => {
    setNama_jurusan(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(namaJurusan);

    try {
      const response = await axios.post("http://localhost:3000/api/jurusan/store", {
        nama_jurusan : namaJurusan
      });
      navigate("/jrsn");
      fetchData();
    } catch (error) {
      console.error("Kesalahan: ", error);
      setValidation(error.response.data);
    }
  };

  const [editData, setEditData] = useState({
    id_j: null,
    nama_jurusan: "",
  });

  const [showEditModal, setShowEditModal] = useState(false);

  const handleShowEditModal = (data) => {
    setEditData(data);
    setShowEditModal(true);
    setShow(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditData(null);
  };

  const handleEditDataChange = (field, value) => {
    setEditData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("id_j", editData.id_j);
    formData.append("nama_jurusan", editData.nama_jurusan);

    try {
      await axios.patch(
        `http://localhost:3000/api/jurusan/update/${editData.id_j}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/jurusan");
      fetchData();
      setShowEditModal(false);
    } catch (error) {
      console.error("Kesalahan:", error);
      setValidation(error.response.data);
    }
  };

  const handleDelete = (id_j) => {
    axios
      .delete(`http://localhost:3000/api/jurusan/delete/${id_j}`)
      .then((response) => {
        console.log("Data Berhasil Dihapus");

        const updateJrs = jrs.filter((item) => item.id_j !== id_j);
        setJrsn(updateJrs);
      })
      .catch((error) => {
        console.error("Gagal menghapus data", error);
        alert(
          "Gagal menghapus data. Silahkan coba lagi atau hubungi administrator."
        );
      });
  };

  return (
    <Container>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nama jurusan :</label>
              <input
                type="text"
                className="form-control"
                value={namaJurusan}
                onChange={handleNamaJurusanChange}
              />
            </div>
            <button onClick={handleClose} type="submit" className="btn btn-primary">
              Kirim
            </button>
          </form>
        </Modal.Body>
      </Modal>
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Data jurusan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label className="form-label">Nama jurusan :</label>
              <input
                type="text"
                className="form-control"
                value={editData ? editData.nama_jurusan : ""}
                onChange={(e) =>
                  handleEditDataChange("nama_jurusan", e.target.value)
                }
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Simpan Perubahan
            </button>
          </form>
        </Modal.Body>
      </Modal>
      <Row>
        <Col>
          <h2>Data jurusan</h2>
          <Button variant="primary" onClick={handleShow}>
            Tambah
          </Button>
        </Col>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Nama jurusan</th>
              <th scope="col" colSpan={2}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {jrs.map((jrs, index) => (
              <tr key={jrs.id_j}>
                <td>{index + 1}</td>
                <td>{jrs.nama_jurusan}</td>
                <td>
                  <button
                    onClick={() => handleShowEditModal(jrs)}
                    className="btn btn-sm btn-info"
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(jrs.id_j)}
                    className="btn btn-sm btn-danger"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Row>
    </Container>
  );
}

export default Jurusan;