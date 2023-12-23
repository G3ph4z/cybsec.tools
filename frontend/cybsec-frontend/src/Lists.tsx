import React, { useState, useEffect } from 'react';
import './Lists.css';
import axios from 'axios';


const apiUrl = process.env.REACT_APP_API_URL || 'http://backend';

interface Tool {
    id: number;
    name: string;
    url: string;
    mitre_cat: string;
    tags: string;
}

const categoryColors = {
    vulnerability: '#FF5733',
    exploit: '#3498DB',
    malware: '#9B59B6',
    tool: '#27AE60',
    tactic: '#F39C12',
    technique: '#1ABC9C',
    procedure: '#E74C3C',
    execution: '#E74C3C',
    warning: '#E67E22',
    precaution: '#2C3E50',
    collection: '#2C3E50',
    caution: '#16A085',
    recommendation: '#8E44AD',
    observation: '#D35400',
    unknown: '#BDC3C7',
    information: '#2980B9',
    other: '#95A5A6'
  } as const;


const getMitreCategoryColor = (category: string) => {
    if (categoryColors.hasOwnProperty(category)) {
        return categoryColors[category as keyof typeof categoryColors];
    }
    return '#000000';
};


const isMaintained = async (url: string) => {
    const isGitHub = url.includes('github.com');
    const isGitLab = url.includes('gitlab.com');

    if (isGitHub || isGitLab) {
        const [owner, repo] = url.split('/').slice(-2);
        const apiUrl = isGitHub
            ? `https://api.github.com/repos/${owner}/${repo}/commits/master`
            : `https://gitlab.com/api/v4/projects/${owner}%2F${repo}/repository/commits`;

        try {
            const response = await axios.get(apiUrl);
            const lastCommitDate = new Date(response.data.commit.author.date);
            const currentDate = new Date();
            const diffDays = Math.ceil((currentDate.getTime() - lastCommitDate.getTime()) / (1000 * 60 * 60 * 24));
            return diffDays <= 60;
        } catch (error) {
            console.error('Error fetching commit data:', error);
        }
    }

    return false;
};

const Lists: React.FC = () => {
    const [toolData, setToolData] = useState<Tool[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(20);

    const handleCategoryClick = (category: string) => {
        fetch('${apiUrl}/lists?mitre_cat=${category}')
            .then(response => response.json())
            .then(data => setToolData(data.items));
    };
    
    const handleTagClick = (tag: string) => {
        fetch('${apiUrl}/lists?tags=${tag}')
            .then(response => response.json())
            .then(data => setToolData(data.items));
    };

    useEffect(() => {
        setLoading(true);
        fetch('${apiUrl}/lists?page=${currentPage}&limit=${itemsPerPage}')
            .then((response) => response.json())
            .then((data) => {
                setToolData(data.items);
                setTotalItems(data.total_items);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, [currentPage, itemsPerPage]);

    const totalPages = Math.ceil(totalItems / itemsPerPage);


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
                            {Array.isArray(toolData) &&
                                toolData.map((tool) => (
                                    <tr key={tool.id}>
                                        <td>{tool.name}</td>
                                        <td>
                                            <a href={tool.url} target="_blank" rel="noopener noreferrer">
                                                {tool.url}
                                            </a>
                                        </td>
                                        <td className="text-center">
                                            {Array.isArray(tool.mitre_cat) && tool.mitre_cat.map((category: string, index: number) => (
                                                <button
                                                    key={index}
                                                    className="badge category-badge"
                                                    style={{ backgroundColor: getMitreCategoryColor(category) }}
                                                    onClick={() => handleCategoryClick(category)}
                                                >
                                                    {category}
                                                </button>
                                            ))}
                                        </td>
                                        <td className="text-center">
                                            {Array.isArray(tool.tags) && tool.tags.map((tag: string, index: number) => (
                                                <button key={index} className="badge tag-badge" onClick={() => handleTagClick(tag)}>
                                                    {tag}
                                                </button>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button 
                                className={`previous ${currentPage === 1 ? 'disabled' : ''}`} 
                                disabled={currentPage === 1} 
                                onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
                            >
                                Previous
                            </button>
                            <span>{currentPage}</span>
                            <button 
                                className={`next ${currentPage === totalPages ? 'disabled' : ''}`} 
                                disabled={currentPage === totalPages} 
                                onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Lists;
