import { useEffect, useState } from "react"
import axios from "axios"
import Card from "../components/card.jsx"
import CardContent from "../components/cardContent.jsx"
import CreateAnnonce from "../components/createAnnonce"
import EditAnnoncer from "../components/editAnnoncer"
import GoogleMaps from "../components/googleMaps.jsx"

const Annoncer = () => {
  const [annoncer, setAnnoncer] = useState([])
  const [selectedAnnonce, setSelectedAnnonce] = useState(null)
  const [categories, setCategories] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const token = localStorage.getItem("token")

  useEffect(() => {
    // Først hent kategorier
    axios
      .get("/api/categories/")
      .then((response) => {
        const fetchedCategories = response.data
        setCategories(fetchedCategories)

        // Når kategorier er hentet, hent annoncer
        axios
          .get("/api/annoncer/")
          .then((res) => {
            const annoncerWithDetails = res.data.map((annonce) => {
              // Håndter flere kategorier pr. annonce (annonce.categories er array)
              const matchedCategories = annonce.categories
                ? fetchedCategories.filter((cat) =>
                    annonce.categories.includes(cat.id)
                  )
                : []

              return {
                ...annonce,
                category_details: matchedCategories,
              }
            })

            console.log("Annonce med kategori:", annoncerWithDetails) // <-- HER

            setAnnoncer(annoncerWithDetails)
          })
          .catch((error) =>
            console.error("Fejl ved hentning af annoncer:", error)
          )
      })
      .catch((error) =>
        console.error("Fejl ved hentning af kategorier:", error)
      )
  }, [])

  const handleSearch = () => {
    const params = {}

    if (searchTerm) params.search = searchTerm
    if (selectedCategory) params.category = selectedCategory

    axios
      .get("/api/annoncer/", { params })
      .then((response) => setAnnoncer(response.data))
      .catch((error) => console.error("Fejl ved søgning i annoncer:", error))
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Er du sikker på, at du vil slette denne annonce?"))
      return

    const response = await fetch(`/api/annoncer/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })

    if (response.ok) {
      setAnnoncer((prev) => prev.filter((annonce) => annonce.id !== id))
    } else {
      alert("Du har ikke tilladelse til at slette denne annonce!")
    }
  }

  return (
    <div className="annoncer-container">
      <h2>Alle Annoncer</h2>

      {/* Søgefelt */}
      <div className="search-bar">
        <input
          placeholder="Søg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Alle Kategorier</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button className="search-btn" onClick={handleSearch}>
          🔍
        </button>
      </div>

      {token ? (
        <button onClick={() => setIsCreateModalOpen(true)}>
          + Opret Annonce
        </button>
      ) : (
        <p>Log ind for at oprette en annonce.</p>
      )}

      <main className="product-grid">
        {annoncer.map((annonce) => (
          <Card key={annonce.id} className="annonce-item">
            <CardContent>
              <div className="overlay-details"></div>
              <h2>{annonce.title}</h2>
              <div className="image-wrapper">
                {annonce.image && (
                  <img
                    className="product-image"
                    src={`${backendUrl}${annonce.image}`}
                    alt={annonce.title}
                  />
                )}
              </div>
              <p>{annonce.content}</p>
              <p>Pris: {annonce.price} kr.</p>
              <p>Oprettet af: {annonce.user_username}</p>
              <div className="kategori-tags">
                {annonce.category_details?.map((cat) => (
                  <span key={cat.id} className="category-tag">
                    {cat.name}
                  </span>
                ))}
              </div>

              <button
                onClick={() => {
                  setSelectedAnnonce(annonce)
                  setIsViewModalOpen(true)
                }}
              >
                Se mere
              </button>

              {String(localStorage.getItem("userId")) ===
                String(annonce.user_id) && (
                <>
                  <button
                    onClick={() => {
                      setSelectedAnnonce(annonce)
                      setIsEditModalOpen(true)
                    }}
                  >
                    Rediger
                  </button>
                  <button onClick={() => handleDelete(annonce.id)}>Slet</button>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </main>

      {/* Opret modal */}
      {isCreateModalOpen && (
        <CreateAnnonce
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={(newAnnonce) => {
            setAnnoncer((prev) => [newAnnonce, ...prev])
            setIsCreateModalOpen(false)
          }}
        />
      )}

      {/* Rediger modal */}
      {isEditModalOpen && selectedAnnonce && (
        <EditAnnoncer
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedAnnonce(null)
          }}
          id={selectedAnnonce.id}
          onUpdated={(updated) => {
            setAnnoncer((prev) =>
              prev.map((a) => (a.id === updated.id ? updated : a))
            )
            setIsEditModalOpen(false)
            setSelectedAnnonce(null)
          }}
        />
      )}

      {/* Se mere modal */}
      {isViewModalOpen && selectedAnnonce && (
        <div
          className="product-overlay"
          onClick={() => setIsViewModalOpen(false)}
        >
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedAnnonce.title}</h2>
            {selectedAnnonce.image && (
              <img
                className="product-image"
                src={`${backendUrl}${selectedAnnonce.image}`}
                alt={selectedAnnonce.title}
              />
            )}
            <p>{selectedAnnonce.content}</p>
            <p>Pris: {selectedAnnonce.price} kr.</p>
            <p>Oprettet af: {selectedAnnonce.user_username}</p>

            <div className="kategori-tags">
              {selectedAnnonce.category_details?.map((cat) => (
                <span key={cat.id} className="category-tag">
                  {cat.name}
                </span>
              ))}
            </div>

            <div className="rating">
              ⭐⭐⭐⭐☆ <span>(521)</span>
            </div>

            <button onClick={() => alert("Købsfunktion ikke implementeret")}>
              Køb
            </button>
          </div>
        <GoogleMaps address="Aalborg"/>
        </div>
      )}
    </div>
  )
}

export default Annoncer
