import React, { useState } from 'react';
import axios from 'axios';
import './style.css';

const Content = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('Aguardando envio de CSV');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file) => {
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/api/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const results = response.data.map(row => ({
        name: row[0],
        city: row[1],
        country: row[2],
        favorite_sport: row[3]
      }));

      setData(results);
      setFilteredData(results);
      setUploadStatus('CSV Recieved!');
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Failed to Upload CSV');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    const filtered = data.filter(item =>
      Object.values(item).some(value =>
        value.toLowerCase().includes(query.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  return (
    <div className="content">
      <div className="status">
        <div>Status: {uploadStatus}</div>
        {loading && <div>Loading...</div>}
      </div>
      <label className="send" for="arquivo">Send .CSV</label>
      <input className="inputfile" type="file" name="arquivo" id="arquivo" onChange={(e) => handleFileUpload(e.target.files[0])} />
      <div className="search-bar">
        <input type="text" placeholder="Search..." onChange={(e) => handleSearch(e.target.value)} />
      </div>
      <div className="card-container">
        {filteredData.map((item, index) => {
          if (!item.name && !item.city && !item.country && !item.favorite_sport) {
            return null;
          }

          return (
            <div className="card" key={index}>
              {item.name && <div><strong>Name:</strong> {item.name}</div>}
              {item.city && <div><strong>City:</strong> {item.city}</div>}
              {item.country && <div><strong>Country:</strong> {item.country}</div>}
              {item.favorite_sport && <div><strong>Favorite Sport:</strong> {item.favorite_sport}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Content;
