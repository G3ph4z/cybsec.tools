import React, { useState, useEffect } from 'react';
import './Lists.css'; // Import your Lists component CSS file

const apiUrl = process.env.BACKEND_API_ENDPOINT || 'http://localhost:5000/lists';

const Lists: React.FC = () => {
  const [toolData, setToolData] = useState<any[]>([]);

  useEffect(() => {
    // Fetch data from your API
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setToolData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="tool-list-container">
      <table className="tool-list-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>URL</th>
            <th>Mitre Category</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {toolData.map((tool) => (
            <tr key={tool.id}>
              <td>{tool.id}</td>
              <td>{tool.name}</td>
              <td><a href={tool.url} target="_blank" rel="noopener noreferrer">{tool.url}</a></td>
              <td>
                {/* Render category badges */}
                {tool.mitre_cat.split(', ').map((category: string, index: number) => (
                  <span key={index} className="badge category-badge">{category}</span>
                ))}
              </td>
              <td>
                {/* Render tag badges */}
                {tool.tags.split(', ').map((tag: string, index: number) => (
                  <span key={index} className="badge tag-badge">{tag}</span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Lists;
