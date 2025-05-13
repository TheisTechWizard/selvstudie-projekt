import React, { useState } from "react";
import Input from "../components/input.jsx";
import Button from "../components/button.jsx";
import Card from "../components/card.jsx";
import CardContent from "../components/cardContent.jsx";
// import "../../assets/scss/pages/Market.scss";

const products = Array(8).fill({
  title: "GTA VI",
  description: "Description of item, that is being sold on the website",
  price: "5400kr.",
  image: "/gta-vi.jpg",
});

const MarketPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="market-page">
      <header className="market-header">
        <nav>
          <a href="#">Markested</a>
          <a href="#">Mine Annoncer</a>
          <a href="#">Login</a>
          <img src="/avatar.png" alt="avatar" className="avatar" />
        </nav>
      </header>

      <div className="search-bar">
        <Input placeholder="Søg" />
        <Button className="search-btn">🔍</Button>
        <Button className="list-btn">📋</Button>
      </div>

      <main className="product-grid">
        {products.map((product, idx) => (
          <Card key={idx} className="product-card">
            <CardContent>
              <img src={product.image} alt={product.title} className="product-image" />
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p className="price">{product.price}</p>
              <Button onClick={() => setSelectedProduct(product)}>Se annonce</Button>
            </CardContent>
          </Card>
        ))}
      </main>

      {selectedProduct && (
        <div className="product-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="overlay-content" onClick={e => e.stopPropagation()}>
            <img src={selectedProduct.image} alt={selectedProduct.title} />
            <div className="overlay-details">
              <h2>{selectedProduct.title}</h2>
              <p>
                Grand Theft Auto VI er et kommende videospil under udvikling af <a href="#">Rockstar Games</a>. Det
                forventes at blive det ottende primære spil i <a href="#">Grand Theft Auto</a>-serien, det syvende i{" "}
                <a href="#">Grand Theft Auto V</a> (2013), og det sekstende spil i alt.
              </p>
              <p className="price">{selectedProduct.price}</p>
              <div className="rating">
                ⭐⭐⭐⭐⭐ <span>(5357)</span>
              </div>
              <Button>Køb</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketPage;
