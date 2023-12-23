import React, { useEffect, useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import './SubmitPage.css';

const apiUrl = process.env.REACT_APP_API_URL || 'http://backend';


const SubmitPage: React.FC = () => {
    const [toolName, setToolName] = useState<string>('');
    const [toolUrl, setToolUrl] = useState<string>('');
    const [toolCategory, setToolCategory] = useState([]);
    const [customTag, setCustomTag] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [mitreCategories] = useState(['vulnerability', 'exploit','malware','tool','tactic','technique','procedure','execution','warning','precaution','collection','caution','recommendation','observation','unknown','information','other']);
    const [selectedMitreCategories, setSelectedMitreCategories] = useState<string[]>([]);
    const [toolTags, setToolTags] = useState<string[]>([]);
    const [existingToolTags, setExistingToolTags] = useState<string[]>([]);
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${apiUrl}/tags`)
            .then(response => response.json())
            .then(data => setExistingToolTags(data.tags));
    }, []);

    const handleCategoryBadgeClick = (category: string) => {
        setSelectedMitreCategories((prevCategories: string[]) => {
            if (prevCategories.includes(category)) {
                return prevCategories.filter(cat => cat !== category);
            } else {
                return [...prevCategories, category];
            }
        });
    };

    const handleTagBadgeClick = (tag: string) => {
        setToolTags(prevToolTags => 
            prevToolTags.includes(tag) ? prevToolTags.filter(t => t !== tag) : [...prevToolTags, tag]
        );
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (recaptchaValue === null) {
            alert("Please verify that you are not a robot.");
            return;
        }


        if (!toolName || !toolUrl || !toolCategory) {
            setErrorMessage('All fields are required.');
            return;
        }

        setErrorMessage('');

        const toolData = {
            name: toolName,
            url: toolUrl,
            mitre_cat: selectedMitreCategories,
            tags: toolTags,
            'g-recaptcha-response': recaptchaValue
        };

        console.log('Sending tool data:', toolData);


        try {
            const response = await fetch(`${apiUrl}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(toolData),
            });

            if (!response.ok) {
                const err = await response.json();
                throw err;
            }

            const data = await response.json();

            if (data.error) {
                setErrorMessage(data.error);
            } else {
                setToolName('');
                setToolUrl('');
                setToolCategory([]);
                setToolTags([]);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred while submitting the tool.');
        }
    };

    return (
            <div className="submit-page">
            <h1>Submit a Tool</h1>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <form onSubmit={handleSubmit} className="submit-form">
                <label className="form-label">
                    Tool Name:
                    <input
                        type="text"
                        value={toolName}
                        onChange={(event) => setToolName(event.target.value)}
                        className="form-input"
                    />
                </label>

                <label className="form-label">
                    Tool URL:
                    <input
                        type="url"
                        value={toolUrl}
                        onChange={(event) => setToolUrl(event.target.value)}
                        className="form-input"
                    />
                </label>

                <label className="form-label">
                    MITRE Categories:

                    <div className="badge-container">
                        {mitreCategories.map((category) => (
                            <span
                                key={category}
                                className={`submit-badge ${selectedMitreCategories.includes(category) ? 'badge-selected' : ''}`}
                                onClick={() => handleCategoryBadgeClick(category)}
                            >
                                {category}
                            </span>
                        ))}
                    </div>
                </label>

                <label className="form-label">
                    Tool Tags:
                    <div className="badge-container">
                        {existingToolTags.map((tag) => (
                            <div 
                                key={tag} 
                                className={`submit-badge ${toolTags.includes(tag) ? 'badge-selected' : ''}`}
                                onClick={() => handleTagBadgeClick(tag)}
                            >
                                {tag}
                            </div>
                        ))}
                    </div>
                </label>

                <label className="form-label">
                    Add a new tag:
                    <input
                        value={customTag}
                        onChange={(event) => setCustomTag(event.target.value)}
                        className="form-input"
                    />
                    <button
                        onClick={(event) => {
                            event.preventDefault();
                            setToolTags((prevTags: string[]) => [...prevTags, customTag] as never[]);
                            setCustomTag('');
                        }}
                    >
                        Add Tag
                    </button>
                </label>

                <label className="form-label">
                    <ReCAPTCHA
                        sitekey="key"
                        onChange={setRecaptchaValue}
                    />
                </label>
                <button type="submit" className="submit-button">Submit this awesome tool</button>
            </form>
        </div>
    );
};

export default SubmitPage;