import { useState } from "react";
import "./App.css";

function App() {
  const [singleFile, setSingleFile] = useState(null);
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [fetchedSingleFile, setFetchedSingleFile] = useState(null);
  const [fetchedMultipleFiles, setFetchedMultipleFiles] = useState([]);
  const [randomDogImage, setRandomDogImage] = useState("");

  // Handle file input for single upload
  const handleSingleFileChange = (e) => {
    setSingleFile(e.target.files[0]);
  };

  // Handle file input for multiple uploads
  const handleMultipleFilesChange = (e) => {
    setMultipleFiles(e.target.files);
  };

  // Upload a single file to the server
  const uploadSingleFile = async () => {
    const formData = new FormData();
    formData.append("file", singleFile);

    try {
      const response = await fetch("http://localhost:8000/save/single", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error uploading single file:", error);
    }
  };

  // Upload multiple files to the server
  const uploadMultipleFiles = async () => {
    const formData = new FormData();
    for (let i = 0; i < multipleFiles.length; i++) {
      formData.append("files", multipleFiles[i]);
    }

    try {
      const response = await fetch("http://localhost:8000/save/multiple", {
        method: "POST",
        body: formData,
      });
      const data = await response.text();
      alert(data); // Alerts with the file paths
    } catch (error) {
      console.error("Error uploading multiple files:", error);
    }
  };

  // Fetch a random single file from the server
  const fetchSingleFile = async () => {
    try {
      const response = await fetch("http://localhost:8000/fetch/single");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setFetchedSingleFile(url);
    } catch (error) {
      console.error("Error fetching single file:", error);
    }
  };

  // Fetch multiple images from the server and display them
  const fetchMultipleImages = async () => {
    try {
      const response = await fetch("http://localhost:8000/fetch/multiple");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json(); // Get array of image URLs
      //response structure is { files: [{ filename, data }] }
      const imageUrls = data.files.map(
        (file) => `data:image/jpeg;base64,${file.data}`
      );
      setFetchedMultipleFiles(imageUrls); // Store the URLs in state
    } catch (error) {
      console.error("Error fetching multiple images:", error);
    }
  };

  // Fetch random dog image
  const fetchRandomDogImage = async () => {
    try {
      const response = await fetch("https://dog.ceo/api/breeds/image/random");
      const data = await response.json();
      setRandomDogImage(data.message); // Set the random dog image URL
    } catch (error) {
      console.error("Error fetching random dog image:", error);
    }
  };

  // Upload random dog image to the server
  const uploadRandomDogImage = async () => {
    try {
      const response = await fetch(randomDogImage);
      const blob = await response.blob();
      const file = new File([blob], "random-dog.jpg", { type: blob.type });

      const formData = new FormData();
      formData.append("file", file); // Attach the dog image blob as a file

      const uploadResponse = await fetch("http://localhost:8000/save/single", {
        method: "POST",
        body: formData,
      });
      const data = await uploadResponse.json();
      alert(data.message);
    } catch (error) {
      console.error("Error uploading random dog image:", error);
    }
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <h1>File Upload and Fetch App</h1>

        <div className="section">
          <h2>Upload Single File</h2>
          <input
            type="file"
            onChange={handleSingleFileChange}
            className="input"
          />
          <button onClick={uploadSingleFile} className="button">
            Upload Single File
          </button>
        </div>

        <div className="section">
          <h2>Upload Multiple Files</h2>
          <input
            type="file"
            multiple
            onChange={handleMultipleFilesChange}
            className="input"
          />
          <button onClick={uploadMultipleFiles} className="button">
            Upload Multiple Files
          </button>
        </div>

        <div className="section">
          <h2>Fetch Single File</h2>
          <button onClick={fetchSingleFile} className="button">
            Fetch Single File
          </button>
          {fetchedSingleFile && (
            <div>
              <h3>Single File</h3>
              <img
                src={fetchedSingleFile}
                alt="Fetched Single"
                className="image"
              />
            </div>
          )}
        </div>

        <div className="section">
          <h2>Fetch Multiple Files</h2>
          <button onClick={fetchMultipleImages} className="button">
            Fetch Multiple Files
          </button>
          {fetchedMultipleFiles.length > 0 && (
            <div>
              <h3>Multiple Files</h3>
              {fetchedMultipleFiles.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Fetched Image ${index}`}
                  className="image"
                />
              ))}
            </div>
          )}
        </div>

        <div className="section">
          <h2>Random Dog Image</h2>
          <button onClick={fetchRandomDogImage} className="button">
            Get Random Dog Image
          </button>
          {randomDogImage && (
            <>
              <div className="dog-image-container">
                <h3>Random Dog</h3>
                <img src={randomDogImage} alt="Random Dog" className="image" />
              </div>
              <button onClick={uploadRandomDogImage} className="button">
                Upload Random Dog Image
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
