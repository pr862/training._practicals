document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.getElementById("uploadForm") as HTMLFormElement;
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    const progressBar = document.getElementById("progressBar") as HTMLDivElement;
    const progressPercent = document.getElementById("progressPercent") as HTMLSpanElement;
    const uploadButton = document.getElementById("uploadButton") as HTMLButtonElement;
    const messageArea = document.getElementById("messageArea") as HTMLDivElement;
    const progressBarContainer = document.getElementById("progressBarContainer") as HTMLDivElement;

    const MAX_FILE_SIZE: number = 10 * 1024 ; 

    uploadForm.addEventListener("submit", (e: SubmitEvent) => {
        e.preventDefault();
        
        const file: File | undefined = fileInput.files?.[0];

        if (!file) {
            showError("Please select a file.");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            showError("File size exceeds the limit (Max 10kB).");
            return;
        }

        const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        const filename = file.name.toLowerCase();

        const isPdfOrDoc = allowedTypes.includes(file.type) || filename.endsWith(".pdf") || filename.endsWith(".doc") || filename.endsWith(".docx");

        if (!isPdfOrDoc) {
            showError("Invalid file type. Only PDF and DOC files are allowed.");
            return;
        }

        uploadFile(file);
    });

    function uploadFile(file: File): void {
        const formData = new FormData();
        formData.append("image", file); 

        const xhr = new XMLHttpRequest();

        progressBarContainer.classList.remove('hidden');
        uploadButton.disabled = true;
        progressBar.style.width = '0%';
        progressPercent.textContent = '0%';

        xhr.upload.addEventListener("progress", (event: ProgressEvent) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                progressBar.style.width = `${percent}%`;
                progressPercent.textContent = `${percent}%`;
            }
        });

        xhr.addEventListener('load', () => {
            uploadButton.disabled = false;
            
            setTimeout(() => progressBarContainer.classList.add('hidden'), 800);

            try {
                const response = JSON.parse(xhr.responseText);
                if (xhr.status === 200) {
                    showSuccess(response.message || "Upload successful!");
                    uploadForm.reset();
                } else {
                    showError(response.message || "Upload failed.");
                }
            } catch (e) {
                showError("Server error: Invalid JSON response.");
            }
        });

        xhr.addEventListener('error', () => {
            progressBarContainer.classList.add('hidden');
            uploadButton.disabled = false;
            showError("Network error. Please check your connection.");
        });

        xhr.open("POST", 'http://localhost:3000/single', true);
        xhr.send(formData);
    }

    function showError(message: string): void {
        messageArea.classList.remove("hidden");
        messageArea.className = "mt-4 p-3 rounded-lg text-sm text-red-800 bg-red-100";
        messageArea.textContent = message;
    }

    function showSuccess(message: string): void {
        messageArea.classList.remove("hidden");
        messageArea.className = "mt-4 p-3 rounded-lg text-sm text-green-800 bg-green-100";
        messageArea.textContent = message;
    }
});
