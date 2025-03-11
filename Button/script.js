const title = document.getElementById("title");
const button = document.getElementById("button");

button.addEventListener("click", () => {
	if (title.textContent === "Hello World!") {
		title.textContent = "Goodbye World!";
	}
	else {
		title.textContent = "Hello World!";
	}
});