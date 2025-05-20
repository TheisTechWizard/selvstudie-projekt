import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Button from "../components/button.jsx"
import Card from "../components/card.jsx"
import CardContent from "../components/cardContent.jsx"
import EditAnnoncer from "../components/editAnnoncer"
import CreateAnnonce from "../components/createAnnonce"
import "../../src/assets/scss/pages/userPage.scss"

const UserPage = () => {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [listings, setListings] = useState([])
  const [categories, setCategories] = useState([])

  const [selectedAnnonce, setSelectedAnnonce] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const token = localStorage.getItem("token")
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(`/api/users/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser({
          name: data.username,
          email: data.email,
          annonces: data.annonces_count || 0,
          image: data.image,
        })
      } else {
        console.error("Kunne ikke hente brugerdata")
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setCategories(data)

          // Når vi har kategorier, henter vi annoncer
          fetchUserListings(data)
        } else {
          console.error("Kunne ikke hente kategorier")
        }
      } catch (err) {
        console.error("Fejl:", err)
      }
    }

    const fetchUserListings = async (fetchedCategories) => {
      const response = await fetch(`/api/users/${userId}/annoncer/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()

        // Tilføj kategori-info til hver annonce
        const enriched = data.map((annonce) => {
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

        setListings(enriched)
      } else {
        console.error("Kunne ikke hente brugerens annoncer")
      }
    }

    fetchUserData()
    fetchCategories()
  }, [userId, token])

  const handleDelete = async (id) => {
    if (!window.confirm("Er du sikker på, at du vil slette denne annonce?"))
      return

    const response = await fetch(`/api/annoncer/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })

    if (response.ok) {
      setListings((prev) => prev.filter((annonce) => annonce.id !== id))
    } else {
      alert("Du har ikke tilladelse til at slette denne annonce!")
    }
  }

  if (!user) return <p>Indlæser profil...</p>

  return (
    <div className="user-page">
      <section className="profile-card">
        <img src={user.image} alt="User" className="profile-img" />
        <div className="user-info">
          <p>{user.name}</p>
          <p>Antal annoncer: {user.annonces}</p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)}>
          + Opret Annonce
        </button>
      </section>

      <section className="annonce-section">
        <h3>Mine Annoncer</h3>
        <div className="annonce-list">
          {listings.map((item) => (
            <Card key={item.id} className="annonce-item">
              <CardContent>
                <div className="image-wrapper">
                  <img
                    src={item.image ? `${backendUrl}${item.image}` : ""}
                    alt={item.title}
                    className="product-image"
                  />
                </div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <p>{item.price} kr.</p>

                {/* VIS KATEGORIER */}
                <div className="kategori-tags">
                  {item.category_details?.map((cat) => (
                    <span key={cat.id} className="category-tag">
                      {cat.name}
                    </span>
                  ))}
                </div>

                <div className="footer">
                  <div className="actions">
                    <Button
                      onClick={() => {
                        setSelectedAnnonce(item)
                        setIsEditModalOpen(true)
                      }}
                    >
                      Rediger
                    </Button>
                    <Button onClick={() => handleDelete(item.id)}>Slet</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Opret modal */}
      {isCreateModalOpen && (
        <CreateAnnonce
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={(newAnnonce) => {
            setListings((prev) => [newAnnonce, ...prev])
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
            setListings((prev) =>
              prev.map((a) => (a.id === updated.id ? updated : a))
            )
            setIsEditModalOpen(false)
            setSelectedAnnonce(null)
          }}
        />
      )}
    </div>
  )
}

export default UserPage
