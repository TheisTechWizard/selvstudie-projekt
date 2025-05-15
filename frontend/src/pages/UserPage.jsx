import React, { useState, useEffect, useCallback } from "react"
import Input from "../components/input.jsx"
import Button from "../components/button.jsx"
import Card from "../components/card.jsx"
import CardContent from "../components/cardContent.jsx"
import "../../src/assets/scss/pages/userPage.scss"

const user = {
  name: "Andreas Sigvald Møller Steffensen",
  email: "123456789@gmail.com",
  annonces: 2,
  image: "https://upload.wikimedia.org/wikipedia/en/2/2e/Shrek_%28character%29.png",
};

const myListings = Array(2).fill({
  title: "GTA VI",
  description: "Description of item, that is being sold on the website",
  price: "5400kr.",
  image: "https://upload.wikimedia.org/wikipedia/en/7/7f/Grand_Theft_Auto_VI_cover_art.png",
});

const User = () => {
  return (
    <div className="user-page">
      
      <section className="profile-card">
        <img src={user.image} alt="User" className="profile-img" />
        <div className="user-info">
          <p>{user.name}</p>
          <p>Email: {user.email}</p>
          <p>Antal annoncer: {user.annonces}</p>
        </div>
      </section>

      <div className="search-bar">
        <Input placeholder="Søg" />
        <Button><i className="fas fa-search"></i></Button>
        <Button><i className="fas fa-list"></i></Button>
      </div>

      <section className="annonce-section">
        <h3>Mine Annoncer</h3>
        <div className="annonce-list">
          {myListings.map((item, index) => (
            <Card key={index}>
              <CardContent>
                <img src={item.image} alt={item.title} className="annonce-img" />
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <p>{item.price}</p>
                <Button> Edit announce </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default User;