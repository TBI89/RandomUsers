/// <reference path="jquery-3.7.0.js" />

"use strict";

(() => {

    // Get json from REST API:
    async function getJson(url) {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }

    // When the page is loaded display the first 40 users:
    $(document).ready(async () => {
        const userContainer = await getJson("https://randomuser.me/api/?results=40");
        displayUsers(userContainer.results);
    });

    // Display 40 random users via bootstrap cards:
    function displayUsers(users) {
        let html = "";
        for (const user of users) {
            html +=
                `<div class="card" style="width: 18rem;">
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault_${user.id.value}">
                </div>
                <img src="${user.picture.thumbnail}" class="rounded-circle">
                <div class="card-body">
                    <p class="card-text">First Name: ${user.name.first}</p>
                    <p class="card-text">Last Name: ${user.name.last}</p>
                    <p class="card-text">Gender: ${user.gender}</p>
                    <p class="card-text">Email: ${user.email}</p>
                    <p class="card-text">Age: ${user.dob.age}</p>
                </div>
            </div>`;
        }
        $("#clientContainer").html(html);
    }

    // Empty array to store the toggled users:
    let favoriteUsers = [];

    // On click, display & count the toggled users:
    $(document).on("click", ".form-check-input", function () {
        const checkboxId = $(this).attr("id");
        const userId = checkboxId.split("_")[1];

        if ($(this).is(":checked")) {
            favoriteUsers.push(userId);
        } else {
            const index = favoriteUsers.indexOf(userId);
            if (index !== -1) {
                favoriteUsers.splice(index, 1);
            }
        }

        const count = favoriteUsers.length;
        $("#counterDiv span").text("Your Favorite Users: " + count); // Update the count in the span

        console.log(favoriteUsers); // Log the array in the console

        // Save the updated favoriteUsers array to local storage
        localStorage.setItem("favoriteUsers", JSON.stringify(favoriteUsers));
    });

    // Function to retrieve saved favoriteUsers array from local storage:
    function getSavedFavoriteUsers() {
        const savedFavoriteUsers = localStorage.getItem("favoriteUsers");
        if (savedFavoriteUsers) {
            return JSON.parse(savedFavoriteUsers);
        }
        return [];
    }

    // Load the saved favoriteUsers array from local storage
    favoriteUsers = getSavedFavoriteUsers();

    // Display the count of saved favoriteUsers on page load
    const count = favoriteUsers.length;
    $("#counterDiv span").text(count);

    // Button click event handler to remove all favorites from local storage
    $(document).on("click", "#removeButton", () => {
        // Clear the favoriteUsers array
        favoriteUsers = [];

        // Remove the "favoriteUsers" item from local storage
        localStorage.removeItem("favoriteUsers");

        // Update the count display
        const count = favoriteUsers.length;
        $("#counterDiv span").text("Your Favorite Users: " + count);
    });

    // Function to check if the user has scrolled to the bottom of the page
    function isScrollAtBottom() {
        const windowHeight = $(window).height();
        const windowScrollTop = $(window).scrollTop();
        const documentHeight = $(document).height();

        return windowHeight + windowScrollTop >= documentHeight;
    }

    // Scroll event handler
    $(window).on("scroll", async () => {
        if (isScrollAtBottom()) {
            // User has scrolled to the bottom, render the page:
            const userContainer = await getJson("https://randomuser.me/api/?results=40");
            displayUsers(userContainer.results);
        }
    });

})();
