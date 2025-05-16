import React, { useState, useEffect, useCallback } from "react"
import axios from "axios"
import Input from "../components/input.jsx"
import Button from "../components/button.jsx"
import Card from "../components/card.jsx"
import CardContent from "../components/cardContent.jsx"
import EditAnnonceModal from "../components/editAnnoncer.jsx"
import CreateAnnonceModal from "../components/createAnnonce.jsx"
import "../../src/assets/scss/pages/Market.scss"

// const products = Array(8).fill({
//   title: "GTA VI",
//   description: "Description of item, that is being sold on the website",
//   price: "5400kr.",
//   image: "/gta-vi.jpg",
// })

const MarketPage = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
  }, [])

  useEffect(() => {
    axios.get("/api/categories/").then((res) => {
      console.log("API-respons for kategorier:", res.data)
      setCategories(res.data)
    })
  }, [])

  // Bruger useCallback for at sikre, at handleSearch kun opdateres når searchTerm eller selectedCategory ændres.
  // Dette forhindrer unødvendige re-renders og undgår dependency-advarsler i useEffect, da man ikke sender api-kald hvergang bugeren indtaster et tegn.
  const handleSearch = useCallback(() => {
    const params = {}
    if (searchTerm) params.search = searchTerm
    if (selectedCategory) params.categories = selectedCategory

    axios
      .get("/api/annoncer/", { params })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Fejl ved hentning af annoncer:", err))
  }, [searchTerm, selectedCategory])

  // Det venter 500ms efter sidste tastetryk/ændring, før det søger.
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch()
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [handleSearch])

  const openEditModal = (product) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  const handleDeleteAnnonce = async (id) => {
    const confirm = window.confirm(
      "Er du sikker på, at du vil slette annoncen?"
    )
    if (!confirm) return

    try {
      const token = localStorage.getItem("token")
      await axios.delete(`/api/annoncer/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error("Fejl ved sletning:", err)
      alert("Kunne ikke slette annoncen.")
    }
  }
  return (
    <div className="market-page">
      <header className="market-header">
        <nav>
          <a href="#">Markedsplads</a>
          <a href="#">Mine Annoncer</a>
          <a href="#">Login</a>
          <img src="/avatar.png" alt="avatar" className="avatar" />
        </nav>
      </header>

      {/* <div className="search-bar">
        <Input placeholder="Søg" />
        <Button className="search-btn">🔍</Button>
        <Button className="list-btn">📋</Button>
      </div> */}
      <div className="search-bar">
        <Input
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
        <Button className="search-btn" onClick={handleSearch}>
          🔍
        </Button>
        {currentUser && (
          <Button
            className="create-btn"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Opret Annonce
          </Button>
        )}
      </div>

      <main className="product-grid">
        {products.map((product) => (
          <Card key={product.id} className="product-card">
            <CardContent>
              <img
                src={product.image}
                alt={product.title}
                className="product-image"
              />
              <h3>{product.title}</h3>
              <p>{product.content}</p>
              <p className="price">{product.price}</p>

              <Button onClick={() => setSelectedProduct(product)}>
                Se annonce
              </Button>

              {currentUser?.username === product.user_username && (
                <div className="product-actions">
                  <Button onClick={() => openEditModal(product)}>
                    Rediger
                  </Button>
                  <Button onClick={() => handleDeleteAnnonce(product.id)}>
                    Slet
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </main>
      {/* {selectedProduct && (
        <div
          className="product-overlay"
          onClick={() => setSelectedProduct(null)}
        >
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedProduct.image} alt={selectedProduct.title} />
            <div className="overlay-details">
              <h2>{selectedProduct.title}</h2>
              <p>
                Grand Theft Auto VI er et kommende videospil under udvikling af{" "}
                <a href="#">Rockstar Games</a>. Det forventes at blive det
                ottende primære spil i <a href="#">Grand Theft Auto</a>-serien,
                det syvende i <a href="#">Grand Theft Auto V</a> (2013), og det
                sekstende spil i alt.
              </p>
              <p className="price">{selectedProduct.price}</p>
              <div className="rating">
                ⭐⭐⭐⭐⭐ <span>(5357)</span>
              </div>
              <Button>Køb</Button>
            </div>
          </div>
        </div>
      )} */}

      {selectedProduct && (
        <div
          className="product-overlay"
          onClick={() => setSelectedProduct(null)}
        >
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedProduct.image} alt={selectedProduct.title} />
            <div className="overlay-details">
              <h2>{selectedProduct.title}</h2>
              <p>{selectedProduct.content}</p>
              <p className="price">{selectedProduct.price}</p>

              {selectedProduct.user_username && (
                <p className="seller">
                  Oprettet af: {selectedProduct.user_username}
                </p>
              )}

              <div className="categories">
                {selectedProduct.category_details?.map((cat) => (
                  <span key={cat.id} className="category-tag">
                    {cat.name}
                  </span>
                ))}
              </div>

              <div className="rating">
                ⭐⭐⭐⭐⭐ <span>(5357)</span>
              </div>

              <Button>Køb</Button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedProduct && (
        <EditAnnonceModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          annonceId={selectedProduct.id}
          onUpdated={(updatedAnnonce) => {
            setProducts((prev) =>
              prev.map((p) => (p.id === updatedAnnonce.id ? updatedAnnonce : p))
            )
            setIsEditModalOpen(false)
          }}
        />
      )}

      {isCreateModalOpen && (
        <CreateAnnonceModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={(newAnnonce) => {
            setProducts((prev) => [newAnnonce, ...prev])
            setIsCreateModalOpen(false)
          }}
        />
      )}
    </div>
  )
}

export default MarketPage
