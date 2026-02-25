import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import StudentPage from './pages/StudentPage';
import AdminPage from './pages/AdminPage';
import IndexPage from './pages/IndexPage';
import { classesData as initialClassesData } from './data/teachersData';

function App() {
  const [allRatings, setAllRatings] = useState(() => {
    // Load from local storage on initial render
    const saved = localStorage.getItem('fikrnoma_ratings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse ratings", e);
        return [];
      }
    }
    return [];
  });

  const [classesData, setClassesData] = useState(() => {
    const saved = localStorage.getItem('fikrnoma_classes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse classes", e);
        return initialClassesData;
      }
    }
    return initialClassesData;
  });

  // Save to local storage whenever ratings or classes change
  useEffect(() => {
    localStorage.setItem('fikrnoma_ratings', JSON.stringify(allRatings));
  }, [allRatings]);

  useEffect(() => {
    localStorage.setItem('fikrnoma_classes', JSON.stringify(classesData));
  }, [classesData]);

  // Function passed down to save a rating
  const handleSaveRating = (ratingData) => {
    setAllRatings(prev => [...prev, ratingData]);
  };

  // Function to add a teacher to specific classes
  const handleAddTeacher = (teacherName, selectedClasses) => {
    setClassesData(prev => prev.map(c => {
      if (selectedClasses.includes(c.id)) {
        // Prevent duplicates
        if (!c.teachers.includes(teacherName)) {
          return { ...c, teachers: [...c.teachers, teacherName] };
        }
      }
      return c;
    }));
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<IndexPage classesData={classesData} />}
        />
        <Route
          path="/:classId"
          element={<StudentPage onSaveRating={handleSaveRating} classesData={classesData} />}
        />
        <Route
          path="/admin"
          element={<AdminPage allRatings={allRatings} classesData={classesData} onAddTeacher={handleAddTeacher} />}
        />
        <Route
          path="/admin/class/:classId"
          element={<AdminPage allRatings={allRatings} classesData={classesData} onAddTeacher={handleAddTeacher} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
