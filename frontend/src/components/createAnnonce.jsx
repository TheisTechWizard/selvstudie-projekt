import React, { useState, useEffect } from "react"
import Modal from "./Modal"
import Input from "./input"
import Button from "./button"
import axios from "axios"

const CreateAnnonceModal = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState("")
  const [image, setImage] = useState(null)
  const [content, setContent] = useState("")
  const [price, setPrice] = useState("")
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [address, setAddress] = useState("")

  const token = localStorage.getItem("token")

  useEffect(() => {
    axios
      .get("/api/categories/")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Fejl ved kategorier:", err))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("title", title)
    formData.append("content", content)
    formData.append("price", price)
    formData.append("address", address)
    selectedCategories.forEach((cat) => formData.append("categories", cat))
    if (image) formData.append("image", image)

    try {
      const response = await axios.post("/api/annoncer/create/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      onSuccess(response.data)
      onClose()
    } catch (err) {
      console.error("Fejl:", err)
      alert("Kunne ikke oprette annoncen.")
    }
  }
  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   try {
  //     console.log("Bruger-token:", token)
  //     const response = await axios.post(
  //       "/api/annoncer/create/",
  //       {
  //         title,
  //         content,
  //         price,
  //         categories: selectedCategories,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     )
  //     onSuccess(response.data)
  //     onClose()
  //   } catch (err) {
  //     console.error("Fejl:", err.response?.data || err.message)
  //     alert(
  //       "Kunne ikke oprette annoncen: " + JSON.stringify(err.response?.data)
  //     )
  //   }
  // }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Opret annonce</h2>
      <form onSubmit={handleSubmit} className="annonce-form">
        <Input
          type="text"
          placeholder="Titel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="file-upload">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <textarea
          placeholder="Beskrivelse"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder="Pris"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <select
          multiple
          value={selectedCategories}
          onChange={(e) =>
            setSelectedCategories(
              Array.from(e.target.selectedOptions, (opt) => Number(opt.value))
            )
          }
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <Input
          type="text"
          placeholder="Adresse"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <div className="modal-buttons">
          <Button type="submit">Opret</Button>
          <Button type="button" onClick={onClose}>
            Annuller
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateAnnonceModal
