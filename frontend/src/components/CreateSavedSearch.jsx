// CreateSavedSearch.jsx
import { useState } from "react"
import axios from "axios"

const CreateSavedSearch = ({ isOpen, onClose, categories }) => {
  const [keyword, setKeyword] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])

  const token = localStorage.getItem("token")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(
        "/api/saved-searches/",
        {
          keyword,
          max_price: maxPrice,
          categories: selectedCategories,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      alert("Annonceagent oprettet!")
      onClose()
    } catch (error) {
      console.error("Fejl ved oprettelse af søgning:", error)
      alert("Kunne ikke oprette søgning")
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Opret annonceagent</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Søgeord"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max pris"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

          <select
            multiple
            value={selectedCategories}
            onChange={(e) =>
              setSelectedCategories(
                Array.from(e.target.selectedOptions, (option) =>
                  parseInt(option.value)
                )
              )
            }
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <button type="submit">Gem søgning</button>
          <button type="button" onClick={onClose}>
            Luk
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateSavedSearch
