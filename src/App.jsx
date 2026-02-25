import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import StudentPage from './pages/StudentPage';
import AdminPage from './pages/AdminPage';
import IndexPage from './pages/IndexPage';
import { classesData as initialClassesData } from './data/teachersData';
import { supabase } from './lib/supabase';

function App() {
  const [allRatings, setAllRatings] = useState([]);
  const [classesData, setClassesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Supabase on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Classes
        let { data: classes, error: classesError } = await supabase
          .from('classes')
          .select('*');

        if (classesError) throw classesError;

        // Seed data if DB is empty
        if (!classes || classes.length === 0) {
          const { data: seededClasses, error: seedError } = await supabase
            .from('classes')
            .insert(initialClassesData.map(c => ({
              id: c.id,
              name: c.name,
              access_code: c.accessCode,
              teachers: c.teachers
            })))
            .select();

          if (seedError) throw seedError;
          setClassesData(seededClasses.map(c => ({ ...c, accessCode: c.access_code })));
        } else {
          setClassesData(classes.map(c => ({ ...c, accessCode: c.access_code })));
        }

        // 2. Fetch Ratings
        const { data: ratings, error: ratingsError } = await supabase
          .from('ratings')
          .select('*');

        if (ratingsError) throw ratingsError;

        // Map DB ratings back to the app structure
        const formattedRatings = ratings.map(r => ({
          className: r.class_id,
          studentName: r.student_name,
          ratings: r.ratings,
          comments: r.comments,
          id: r.id
        }));

        setAllRatings(formattedRatings);
      } catch (e) {
        console.error("Error fetching data from Supabase:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function passed down to save a rating
  const handleSaveRating = async (ratingData) => {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .insert([{
          class_id: ratingData.className,
          student_name: ratingData.studentName,
          ratings: ratingData.ratings,
          comments: ratingData.comments,
          class_name: classesData.find(c => c.id === ratingData.className)?.name
        }])
        .select();

      if (error) throw error;

      if (data) {
        setAllRatings(prev => [...prev, {
          ...ratingData,
          id: data[0].id
        }]);
      }
    } catch (e) {
      console.error("Error saving rating to Supabase:", e);
    }
  };

  // Function to add a teacher to specific classes
  const handleAddTeacher = async (teacherName, selectedClassIds) => {
    try {
      const updatedClasses = classesData.map(c => {
        if (selectedClassIds.includes(c.id)) {
          if (!c.teachers.includes(teacherName)) {
            return { ...c, teachers: [...c.teachers, teacherName] };
          }
        }
        return c;
      });

      // Update in DB (Batch update)
      for (const classId of selectedClassIds) {
        const classToUpdate = updatedClasses.find(c => c.id === classId);
        const { error } = await supabase
          .from('classes')
          .update({ teachers: classToUpdate.teachers })
          .eq('id', classId);

        if (error) throw error;
      }

      setClassesData(updatedClasses);
    } catch (e) {
      console.error("Error updating teachers in Supabase:", e);
    }
  };

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
        <p style={{ color: '#64748b', fontWeight: '500' }}>Yuklanmoqda...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>;
  }

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
