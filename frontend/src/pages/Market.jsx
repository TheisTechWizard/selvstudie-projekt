// import React, { useState, useEffect, useCallback } from "react"
// import axios from "axios"
// import Input from "../components/input.jsx"
// import Button from "../components/button.jsx"
// import Card from "../components/card.jsx"
// import CardContent from "../components/cardContent.jsx"
// import EditAnnonceModal from "../components/editAnnoncer.jsx"
// import CreateAnnonceModal from "../components/createAnnonce.jsx"
// import "../../src/assets/scss/pages/Market.scss"

// const products = Array(8).fill({
//   title: "GTA VI",
//   description: "Description of item, that is being sold on the website",
//   price: "5400kr.",
//   image: "/gta-vi.jpg",
// })

// const MarketPage = () => {
//   const [products, setProducts] = useState([])
//   const [categories, setCategories] = useState([])
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedCategory, setSelectedCategory] = useState("")
//   const [selectedProduct, setSelectedProduct] = useState(null)
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false)
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
//   const [currentUser, setCurrentUser] = useState(null)

//   useEffect(() => {
//     const user = localStorage.getItem("user")
//     if (user) {
//       setCurrentUser(JSON.parse(user))
//     }
//   }, [])

//   useEffect(() => {
//     axios.get("/api/categories/").then((res) => {
//       console.log("API-respons for kategorier:", res.data)
//       setCategories(res.data)
//     })
//   }, [])

//   // Bruger useCallback for at sikre, at handleSearch kun opdateres når searchTerm eller selectedCategory ændres.
//   // Dette forhindrer unødvendige re-renders og undgår dependency-advarsler i useEffect, da man ikke sender api-kald hvergang bugeren indtaster et tegn.
//   const handleSearch = useCallback(() => {
//     const params = {}
//     if (searchTerm) params.search = searchTerm
//     if (selectedCategory) params.categories = selectedCategory

//     axios
//       .get("/api/annoncer/", { params })
//       .then((res) => setProducts(res.data))
//       .catch((err) => console.error("Fejl ved hentning af annoncer:", err))
//   }, [searchTerm, selectedCategory])

//   // Det venter 500ms efter sidste tastetryk/ændring, før det søger.
//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       handleSearch()
//     }, 500)

//     return () => clearTimeout(delayDebounceFn)
//   }, [handleSearch])

//   const openEditModal = (product) => {
//     setSelectedProduct(product)
//     setIsEditModalOpen(true)
//   }

//   const handleDeleteAnnonce = async (id) => {
//     const confirmDelete = window.confirm(
//       "Er du sikker på, at du vil slette annoncen?"
//     )
//     if (!confirmDelete) return

//     const token = localStorage.getItem("token")

//     try {
//       const res = await axios.delete(
//         `http://127.0.0.1:8000/api/annoncer/${id}/`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       )

//       if (res.status === 204) {
//         alert("Annonce slettet!")

//         // Fjern annoncen fra listen uden at reloade
//         setProducts((prev) => prev.filter((p) => p.id !== id))
//         setSelectedProduct(null)
//       }
//     } catch (err) {
//       if (err.response?.status === 403) {
//         alert("Du har ikke tilladelse til at slette denne annonce.")
//       } else {
//         console.error("Fejl ved sletning:", err)
//         alert("Fejl opstod.")
//       }
//     }
//   }
//   return (
//     <div className="market-page">
//       <header className="market-header">
//         <nav>
//           <a href="#">Markedsplads</a>
//           <a href="#">Mine Annoncer</a>
//           <a href="#">Login</a>
//           <img src="/avatar.png" alt="avatar" className="avatar" />
//         </nav>
//       </header>

//       {/* <div className="search-bar">
//         <Input placeholder="Søg" />
//         <Button className="search-btn">🔍</Button>
//         <Button className="list-btn">📋</Button>
//       </div> */}
//       <div className="search-bar">
//         <Input
//           placeholder="Søg"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <select
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//         >
//           <option value="">Alle Kategorier</option>
//           {categories.map((cat) => (
//             <option key={cat.id} value={cat.id}>
//               {cat.name}
//             </option>
//           ))}
//         </select>
//         <Button className="search-btn" onClick={handleSearch}>
//           🔍
//         </Button>
//         {currentUser && (
//           <Button
//             className="create-btn"
//             onClick={() => setIsCreateModalOpen(true)}
//           >
//             + Opret Annonce
//           </Button>
//         )}
//       </div>

//       <main className="product-grid">
//         {products.map((product) => (
//           <Card key={product.id} className="product-card">
//             <CardContent>
//               <img
//                 src={product.image}
//                 alt={product.title}
//                 className="product-image"
//               />
//               <h3>{product.title}</h3>
//               <p>{product.content}</p>
//               <p className="price">{product.price}</p>

//               <Button onClick={() => setSelectedProduct(product)}>
//                 Se annonce
//               </Button>

//               {currentUser?.username === product.user_username && (
//                 <div className="product-actions">
//                   <Button onClick={() => openEditModal(product)}>
//                     Rediger
//                   </Button>
//                   <Button onClick={() => handleDeleteAnnonce(product.id)}>
//                     Slet
//                   </Button>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         ))}
//       </main>
//       {/* {selectedProduct && (
//         <div
//           className="product-overlay"
//           onClick={() => setSelectedProduct(null)}
//         >
//           <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
//             <img src={selectedProduct.image} alt={selectedProduct.title} />
//             <div className="overlay-details">
//               <h2>{selectedProduct.title}</h2>
//               <p>
//                 Grand Theft Auto VI er et kommende videospil under udvikling af{" "}
//                 <a href="#">Rockstar Games</a>. Det forventes at blive det
//                 ottende primære spil i <a href="#">Grand Theft Auto</a>-serien,
//                 det syvende i <a href="#">Grand Theft Auto V</a> (2013), og det
//                 sekstende spil i alt.
//               </p>
//               <p className="price">{selectedProduct.price}</p>
//               <div className="rating">
//                 ⭐⭐⭐⭐⭐ <span>(5357)</span>
//               </div>
//               <Button>Køb</Button>
//             </div>
//           </div>
//         </div>
//       )} */}

//       {selectedProduct && (
//         <div
//           className="product-overlay"
//           onClick={() => setSelectedProduct(null)}
//         >
//           <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
//             <img src={selectedProduct.image} alt={selectedProduct.title} />
//             <div className="overlay-details">
//               <h2>{selectedProduct.title}</h2>
//               <p>{selectedProduct.content}</p>
//               <p className="price">{selectedProduct.price}</p>

//               {selectedProduct.user_username && (
//                 <p className="seller">
//                   Oprettet af: {selectedProduct.user_username}
//                 </p>
//               )}

//               <div className="categories">
//                 {selectedProduct.category_details?.map((cat) => (
//                   <span key={cat.id} className="category-tag">
//                     {cat.name}
//                   </span>
//                 ))}
//               </div>

//               <div className="rating">
//                 ⭐⭐⭐⭐⭐ <span>(5357)</span>
//               </div>

//               <Button>Køb</Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isEditModalOpen && selectedProduct?.id && (
//         <EditAnnonceModal
//           isOpen={isEditModalOpen}
//           onClose={() => {
//             setIsEditModalOpen(false)
//             setSelectedProduct(null)
//           }}
//           id={selectedProduct.id}
//           onUpdated={(updatedAnnonce) => {
//             setProducts((prev) =>
//               prev.map((p) => (p.id === updatedAnnonce.id ? updatedAnnonce : p))
//             )
//             setIsEditModalOpen(false)
//             setSelectedProduct(null)
//           }}
//         />
//       )}

//       {isCreateModalOpen && (
//         <CreateAnnonceModal
//           isOpen={isCreateModalOpen}
//           onClose={() => setIsCreateModalOpen(false)}
//           onSuccess={(newAnnonce) => {
//             setProducts((prev) => [newAnnonce, ...prev])
//             setIsCreateModalOpen(false)
//           }}
//         />
//       )}
//     </div>
//   )
// }

// export default MarketPage

//ny version der virker

// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"

// const Annoncer = () => {
//   const [annoncer, setAnnoncer] = useState([])
//   const [title, setTitle] = useState("")
//   const [content, setContent] = useState("")
//   const [price, setPrice] = useState("")
//   const [categories, setCategories] = useState([])
//   const [selectedCategories, setSelectedCategories] = useState([])
//   const [error, setError] = useState("")
//   const navigate = useNavigate()

//   const token = localStorage.getItem("token")
//   const username = localStorage.getItem("username")

//   // Hent annoncer
//   useEffect(() => {
//     fetch("/api/annoncer/")
//       .then((response) => response.json())
//       .then((data) => {
//         setAnnoncer(data)
//       })
//       .catch((error) => console.error("Fejl ved hentning af annoncer:", error))
//   }, [])

//   // Hent kategorier
//   useEffect(() => {
//     fetch("/api/categories/")
//       .then((res) => res.json())
//       .then((data) => setCategories(data))
//       .catch((err) => console.error("Fejl ved kategorier:", err))
//   }, [])

//   // Opret annonce
//   const handleCreateAnnonce = async (e) => {
//     e.preventDefault()
//     if (!token) {
//       setError("Du skal være logget ind for at oprette en annonce.")
//       return
//     }

//     const response = await fetch("/api/annoncer/create/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         title,
//         content,
//         price,
//         categories: selectedCategories,
//       }),
//     })

//     if (response.ok) {
//       const newAnnonce = await response.json()
//       setAnnoncer([...annoncer, newAnnonce])
//       setTitle("")
//       setContent("")
//       setPrice("")
//       setSelectedCategories([])
//       alert("Annonce oprettet!")
//     } else {
//       const err = await response.json()
//       console.error("Fejl:", err)
//       setError("Kunne ikke oprette annonce. Tjek felterne og prøv igen.")
//     }
//   }

//   // Slet annonce
//   const handleDelete = async (id) => {
//     if (!window.confirm("Er du sikker på, at du vil slette denne annonce?"))
//       return

//     const response = await fetch(`/api/annoncer/${id}/`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     })

//     if (response.ok) {
//       setAnnoncer(annoncer.filter((annonce) => annonce.id !== id))
//     } else {
//       alert("Du har ikke tilladelse til at slette denne annonce!")
//     }
//   }

//   return (
//     <div className="annoncer-container">
//       <h2>Alle Annoncer</h2>

//       {token ? (
//         <form onSubmit={handleCreateAnnonce}>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Titel"
//             required
//           />
//           <textarea
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             placeholder="Beskrivelse"
//             required
//           />
//           <input
//             type="number"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             placeholder="Pris"
//             required
//           />

//           {/* Kategori-vælgning */}
//           <select
//             multiple
//             value={selectedCategories}
//             onChange={(e) =>
//               setSelectedCategories(
//                 Array.from(e.target.selectedOptions, (opt) => Number(opt.value))
//               )
//             }
//           >
//             {categories.map((cat) => (
//               <option key={cat.id} value={cat.id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>

//           <button type="submit">Opret Annonce</button>
//         </form>
//       ) : (
//         <p>Log ind for at oprette en annonce.</p>
//       )}

//       {error && <p className="error">{error}</p>}

//       <ul>
//         {annoncer.map((annonce) => (
//           <li key={annonce.id} className="annonce-item">
//             <h3>{annonce.title}</h3>
//             <p>{annonce.content}</p>
//             <p>Pris: {annonce.price} kr.</p>
//             <p>Oprettet af: {annonce.user_username}</p>

//             {username === annonce.user_username && (
//               <>
//                 <button
//                   onClick={() => navigate(`/rediger-annonce/${annonce.id}`)}
//                 >
//                   Rediger
//                 </button>
//                 <button onClick={() => handleDelete(annonce.id)}>Slet</button>
//               </>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }

// export default Annoncer

// test

import { useEffect, useState } from "react"
import axios from "axios"
import Card from "../components/card.jsx"
import CardContent from "../components/cardContent.jsx"
import CreateAnnonce from "../components/createAnnonce"
import EditAnnoncer from "../components/editAnnoncer"
import "../../src/assets/scss/pages/Market.scss"

const Annoncer = () => {
  const [annoncer, setAnnoncer] = useState([])
  const [selectedAnnonce, setSelectedAnnonce] = useState(null)
  const [categories, setCategories] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  const token = localStorage.getItem("token")
  const username = localStorage.getItem("username")

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

              {username === annonce.user_username && (
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
        </div>
      )}
    </div>
  )
}

export default Annoncer
