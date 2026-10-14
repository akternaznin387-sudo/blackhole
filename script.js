// Blackhole - Video Upscaler App Logic

const API_URL = "YOUR_COLAB_API_URL_HERE"; // Will be added later

const uploadBox = document.getElementById("uploadBox");
const videoInput = document.getElementById("videoInput");
const controls = document.getElementById("controls");
const scaleSelect = document.getElementById("scaleSelect");
const startBtn = document.getElementById("startBtn");
const progress = document.getElementById("progress");
const statusText = document.getElementById("statusText");
const progressFill = document.getElementById("progressFill");
const result = document.getElementById("result");
const downloadLink = document.getElementById("downloadLink");

let selectedFile = null;

// Tap upload box to open file picker
uploadBox.addEventListener("click", () => {
    videoInput.click();
});

// When file is selected
videoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    selectedFile = file;
    uploadBox.innerHTML = `<p>Selected: ${file.name}</p>`;
    uploadBox.classList.add("active");
    controls.style.display = "flex";
});

// Start upscaling
startBtn.addEventListener("click", async () => {
    if (!selectedFile) {
        alert("Please select a video first.");
        return;
    }

    if (API_URL === "YOUR_COLAB_API_URL_HERE") {
        alert("API URL not configured yet. Please set it in script.js");
        return;
    }

    controls.style.display = "none";
    progress.style.display = "block";
    result.style.display = "none";
    statusText.textContent = "Uploading video...";
    progressFill.style.width = "10%";

    try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("scale", scaleSelect.value);

        statusText.textContent = "Processing on server...";
        progressFill.style.width = "40%";

        const response = await fetch(`${API_URL}/upscale`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        progressFill.style.width = "80%";
        statusText.textContent = "Finalizing...";

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        progressFill.style.width = "100%";
        statusText.textContent = "Complete!";

        setTimeout(() => {
            progress.style.display = "none";
            result.style.display = "block";
            downloadLink.href = url;
            downloadLink.download = `blackhole_${selectedFile.name}`;
        }, 500);

    } catch (error) {
        console.error(error);
        progress.style.display = "none";
        controls.style.display = "flex";
        alert("Error: " + error.message);
    }
});
