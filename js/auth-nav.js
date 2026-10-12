(function () {
  const authLink = document.getElementById("auth-link");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!authLink || !currentUser) {
    return;
  }

  authLink.textContent = "Logout (" + currentUser.name.split(" ")[0] + ")";
  authLink.href = "#";

  authLink.addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.removeItem("currentUser");
    window.location.reload();
  });

  const bookName = document.getElementById("book-name");
  const bookEmail = document.getElementById("book-email");

  if (bookName) {
    bookName.value = currentUser.name;
  }
  if (bookEmail) {
    bookEmail.value = currentUser.email;
  }
})();