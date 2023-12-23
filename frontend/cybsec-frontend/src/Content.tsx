import React from 'react';
import Lists from './Lists';
import SubmitPage from './SubmitPage';

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
      content = <SubmitPage />;
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
