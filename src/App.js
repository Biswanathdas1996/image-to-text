import { useCallback, useEffect, useState } from "react";
import { createWorker } from "tesseract.js";
import "./App.css";

function App() {
  const [selectedImages, setSelectedImages] = useState([]); // Change to an array
  const [textResults, setTextResults] = useState([]); // Change to an array
  const [loader, setLoader] = useState(false);
  const worker = createWorker();

  const convertImageToText = useCallback(async () => {
    setLoader(true);
    const results = [];
    for (let image of selectedImages) {
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const { data } = await worker.recognize(image);
      results.push(data.text);
    }
    setTextResults(results);
    setLoader(false);
  }, [worker, selectedImages]);

  useEffect(() => {
    if (selectedImages.length > 0) {
      convertImageToText();
    }
  }, [selectedImages, convertImageToText]);

  const handleChangeImage = (e) => {
    if (e.target.files.length > 0) {
      setSelectedImages([...e.target.files]);
    } else {
      setSelectedImages([]);
      setTextResults([]);
    }
  };

  return (
    <div className="App">
      <h1>ImText</h1>
      <p>Gets words in images!</p>
      <div className="input-wrapper">
        <label htmlFor="upload">Upload Images</label>
        <input
          type="file"
          id="upload"
          accept="image/*"
          onChange={handleChangeImage}
          multiple // Allow multiple file selection
        />
      </div>

      <div className="result">
        {selectedImages.map((image, index) => (
          <div key={index}>
            <div className="box-image">
              <img src={URL.createObjectURL(image)} alt="thumb" />
            </div>
            {loader && "Please wait..."}
            {textResults[index] && (
              <div className="box-p">
                <p>{textResults[index]}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
