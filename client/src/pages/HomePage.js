import React, { useState } from 'react';
import stories from '../data/stories';
import StoryPlayer from '../components/StoryPlayer';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedStory, setSelectedStory] = useState(null);

  const filteredStories = stories.filter(story => {
    const titleMatch = story.title.toLowerCase().includes(searchTerm.toLowerCase());
    const ageMatch = selectedAge ? story.age === parseInt(selectedAge) : true;
    return titleMatch && ageMatch;
  });

  const handleStoryClick = (story) => {
    setSelectedStory(story);
  };

  if (selectedStory) {
    return <StoryPlayer story={selectedStory} />;
  }

  return (
    <div>
      <h2>Story Library</h2>
      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select value={selectedAge} onChange={(e) => setSelectedAge(e.target.value)}>
        <option value="">All Ages</option>
        <option value="2">2 years</option>
        <option value="3">3 years</option>
        <option value="4">4 years</option>
        <option value="5">5 years</option>
        <option value="6">6 years</option>
        <option value="7">7 years</option>
      </select>
      <ul>
        {filteredStories.map(story => (
          <li key={story.id} onClick={() => handleStoryClick(story)}>
            <h3>{story.title}</h3>
            <p>Age: {story.age}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
