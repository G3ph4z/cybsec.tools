import React from 'react';
import Lists from './Lists';

interface ContentProps {
  activeOption: string;
}

const Content: React.FC<ContentProps> = ({ activeOption }) => {
  let content: JSX.Element;

  switch (activeOption) {
    case 'Tools':
      content = <Lists />;
      break;
    case 'Submit':
      content = <div className="content"><p>Submit a new tool</p></div>;
      break;
    case 'Contact':
      content = <div className="content"><p>Contact Us Content</p></div>;
      break;
    case 'Home':
    default:
      content = <div className="content"><p>Welcome to the Home Page</p></div>;
      break;
  }

  return content;
};

export default Content;