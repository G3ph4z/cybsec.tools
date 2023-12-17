import React, { useState, useEffect } from 'react';
import './Lists.css';

const apiUrl = 'http://backend:5000';

const Lists: React.FC = () => {
  const [toolData, setToolData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(30);

  useEffect(() => {
    setLoading(true);
    fetch(`${apiUrl}/lists?page=${currentPage}&limit=${itemsPerPage}`)
      .then((response) => response.json())
      .then((data) => {
        setToolData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [currentPage, itemsPerPage]);

  return (
    <div className="tool-list-container">
      {loading ? ( 
        <div>Loading...</div>
      ) : (
        <>
          <table className="tool-list-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>URL</th>
                <th>Mitre Category</th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody>
              {toolData.map((tool) => (
                <tr key={tool.id}>
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

          {/* Pagination controls */}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
            >
              Previous
            </button>
            <span>{currentPage}</span>
            <button onClick={() => setCurrentPage((prevPage) => prevPage + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Lists;
