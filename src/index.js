let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.querySelector("#new-toy-btn");
    const toyFormContainer = document.querySelector(".container");
    const toyCollection = document.getElementById("toy-collection");
    const toyForm = document.querySelector(".add-toy-form");

    // Toggle Form Visibility
    addBtn.addEventListener("click", () => {
        addToy = !addToy;
        toyFormContainer.style.display = addToy ? "block" : "none";
    });

    // Fetch and display toys
    fetch("http://localhost:3000/toys")
        .then(response => response.json())
        .then(toys => {
            toys.forEach(toy => renderToy(toy));
        });

    // Function to render a toy in the DOM
    function renderToy(toy) {
        const toyCard = document.createElement("div");
        toyCard.className = "card";

        toyCard.innerHTML = `
            <h2>${toy.name}</h2>
            <img src="${toy.image}" class="toy-avatar" />
            <p>${toy.likes} Likes</p>
            <button class="like-btn" id="${toy.id}">Like ❤️</button>
        `;

        // Like button event listener
        toyCard.querySelector(".like-btn").addEventListener("click", () => updateLikes(toy));

        toyCollection.appendChild(toyCard);
    }

    // Handle adding a new toy
    toyForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const toyName = event.target.name.value;
        const toyImage = event.target.image.value;

        const newToy = {
            name: toyName,
            image: toyImage,
            likes: 0
        };

        // Send POST request
        fetch("http://localhost:3000/toys", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(newToy)
        })
        .then(response => response.json())
        .then(toy => {
            renderToy(toy);
            toyForm.reset();
        });
    });

    // Update toy likes
    function updateLikes(toy) {
        const newLikes = toy.likes + 1;

        fetch(`http://localhost:3000/toys/${toy.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ likes: newLikes })
        })
        .then(response => response.json())
        .then(updatedToy => {
            document.getElementById(updatedToy.id).parentElement.querySelector("p").textContent = `${updatedToy.likes} Likes`;
        });
    }
});
