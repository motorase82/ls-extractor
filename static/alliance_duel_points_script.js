document.addEventListener("DOMContentLoaded", function () {
    let dropArea = document.getElementById("drop-area");
    let fileInput = document.getElementById("file-input");
    let uploadForm = document.getElementById("upload-form");
    let progressContainer = document.getElementById("progress-container");
    let progressBar = document.getElementById("progress-bar");
    let progressText = document.querySelector("#progress-container p"); // Select the progress text

    // Prevent default behavior (stop file from opening)
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    // Highlight drag area when file is dragged over
    dropArea.addEventListener("dragover", function () {
        dropArea.classList.add("highlight");
    });

    dropArea.addEventListener("dragleave", function () {
        dropArea.classList.remove("highlight");
    });

    // Handle dropped files
    dropArea.addEventListener("drop", function (e) {
        let files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            changeMessageAfterFileUpload(); // Change message as soon as the file is dropped
        }
    });

    // Handle file input change event
    fileInput.addEventListener("change", function () {
        console.log("File selected:", fileInput.files[0].name);
        changeMessageAfterFileUpload(); // Change message when file is selected from file input
    });

    // Function to change the message in drop area
    function changeMessageAfterFileUpload() {
        let dropAreaText = document.querySelector('#drop-area p');
        dropAreaText.textContent = "Log File Uploaded! Press Extract Data button to extract the Data";
    }

    // Handle form submission
    uploadForm.addEventListener("submit", function (event) {
        event.preventDefault();
        let formData = new FormData();
        formData.append("file", fileInput.files[0]);
		for (let i = 0; i < fileInput.files.length; i++) {
			formData.append("file", fileInput.files[i]);
		}
        formData.append("extraction_type", "alliance-duel-points");  // Specify extraction type

        // Show progress bar
        progressContainer.style.display = "block";
        progressBar.value = 0; // Reset progress bar
        progressText.textContent = "Processing, please wait..."; // Set initial text

        // Simulate progress animation (you can remove this later if the server supports real-time progress)
        let progress = 0;
        let interval = setInterval(() => {
            if (progress < 95) {
                progressBar.value = progress;
                progress += 1;
            }
        }, 700); // Simulate 5% increase every 0.25 seconds

        // Send the data for extraction
        fetch("/upload", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
			clearInterval(interval);
			progressBar.value = 100;
			progressText.textContent = "Processing 100%";
			alert(data.message);

			// Dynamically update the download button
			const downloadBtn = document.getElementById("download-alliance-duel-points-excel");
			downloadBtn.onclick = () => window.location.href = data.excel_file;
			downloadBtn.style.display = "inline-block";

			// Optional: also show the container
			document.getElementById("download-buttons").style.display = "block";
		})
        .catch(error => {
            clearInterval(interval); // Stop progress animation if there is an error
            console.error("Error during fetch:", error); // Handle fetch errors
        });
    });
});
