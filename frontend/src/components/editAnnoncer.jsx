import React, { useEffect, useState } from "react"
import Modal from "./Modal"
import Input from "./input"
import Button from "./button"
import axios from "axios"

const EditAnnonceModal = ({ isOpen, onClose, annonceId, onUpdated }) => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [price, setPrice] = useState("")
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])

  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!annonceId || !isOpen) return

    const fetchAnnonce = async () => {
      try {
        const res = await axios.get(`/api/annoncer/${annonceId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const annonce = res.data
        setTitle(annonce.title)
        setContent(annonce.content)
        setPrice(annonce.price)
        setSelectedCategories(annonce.categories)
      } catch (err) {
        console.error("Fejl ved hentning:", err)
        alert("Kunne ikke hente annoncen.")
      }
    }

    fetchAnnonce()
  })

  useEffect(() => {
    axios
      .get("/api/categories/")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Fejl ved kategorier:", err))
  }, [])

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.put(
        `/api/annoncer/${annonceId}/`,
        {
          title,
          content,
          price,
          categories: selectedCategories,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      onUpdated(res.data)
      onClose()
    } catch (err) {
      console.error("Fejl ved opdatering:", err)
      alert("Kunne ikke opdatere annoncen.")
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Rediger annonce</h2>
      <form onSubmit={handleUpdate}>
        <Input
          type="text"
          placeholder="Titel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
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
        <Button type="submit">Opdater</Button>
      </form>
    </Modal>
  )
}

export default EditAnnonceModal
