import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import './studentdetails.css';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import Navbar from "./navbar";
import './topnavbar.css';
import Classes from "./classes"; // Classes componentini import et


const StudentDetails = () => { // Component adını büyük harfle başlat
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState(""); // Kullanıcı adı için state
  const location = useLocation();
  const { email } = location.state || {}; // Giriş yapan kişinin e-postası
  const [foundStudentId, setFoundStudentId] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // Aktif olan modal
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Yeni eklenen test parçası
  const [studentId, setStudentId] = useState(null);
  const [coursesList, setCoursesList] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledcourses] = useState([]);
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState({ courses: false, enrolledCourses: false });

  useEffect(() => {
    if (location.state && location.state.id) {
      setStudentId(location.state.id);
    }
  }, [location.state]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`http://localhost:8800/enrollments/${foundStudentId}`);
      setCoursesList(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  const fetchAllCourses = async () => {
    try {
      const res = await axios.get(`http://localhost:8800/courses`);
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  const enrollToCourse = async (courseID) => {
    try {
      const enrollment_date = new Date().toISOString().slice(0, 10);
      await axios.post(`http://localhost:8800/enrollments/${foundStudentId}`, {
        studentId,
        courseID,
        enrollment_date,
      });
      setMessage('Enrollment successful.');
      fetchCourses();
    } catch (error) {
      console.error('Enrollment failed:', error);
      setMessage('Enrollment failed.');
    }
  };

  const deleteToCourse = async (courseID) => {
    try {
      await axios.delete(`http://localhost:8800/enrollments/${courseID}`, {
        data: { courseID, studentId },
      });
      setMessage('Enrollment deleted successfully.');
      fetchCourses();
    } catch (error) {
      console.error('Enrollment deletion failed:', error);
      setMessage('Enrollment deletion failed.');
    }
  };

  const handleClick = (courseName, courseID) => {
    if (coursesList.some((course) => course.courseID === courseID)) {
      console.log('Course is already taken');
    } else {
      enrollToCourse(courseID);
    }
  };

  const handleDelete = (courseID) => {
    deleteToCourse(courseID);
  };

  useEffect(() => {
    if (foundStudentId) {
      fetchCourses();
      fetchAllCourses();
    }
  }, [foundStudentId]);

  const handleClickAddButton = () => {
    setIsVisible(true);
  };

  const handleClickCloseButton = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    console.log("Current courses in state:", courses);
  }, [courses]); // courses değiştiğinde konsola yazdır  

    // Tabloların görünürlüğünü değiştirecek toggle fonksiyonu
  const toggleTable = (section) => {
    setIsVisible((prevState) => ({
      ...prevState,
      [section]: !prevState[section], // İlgili bölümün görünürlüğünü tersine çevir
    }));
  };
  console.log(foundStudentId);
  // Test Parça sonu

  const getFirstLetterUpperCase = () => {
    // Eğer studentName boş değilse ilk harfi al ve büyük harfe çevir
    return studentName ? studentName.charAt(0).toUpperCase() : "";
  };
  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const res = await axios.get("http://localhost:8800/students");
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };
    fetchAllStudents();
  }, []);

  const findStudentByEmail = (email) => {
    return students.find(student => student.email === email);
  };

  useEffect(() => {
    const student = findStudentByEmail(email);
    if (student) {
      setFoundStudentId(student.id); // Kullanıcının ID'si
      setStudentName(student.name);  // Kullanıcının adı
    }
  }, [email, students]);

  const openModal = (modalType) => {
    setActiveModal(modalType); // Hangi modal'ın açılacağını belirle
  };

  const closeModal = () => {
    setActiveModal(null); // Modal'ı kapat
  };

  return (
    <>
            {/* Test Yeni Ekleme  */}
      <button onClick={() => toggleTable("courses")}>
        {isVisible.courses ? "Hide Courses" : "Show Courses"}
      </button>
      <button onClick={() => toggleTable("enrolledCourses")}>
        {isVisible.enrolledCourses ? "Hide Enrolled Courses" : "Show Enrolled Courses"}
      </button>

    <div>

    {isVisible.courses && (
          <div className='blur'>
          <div class="isVisibleContainer">
              <div>
                  <h2>Courses</h2>
                  <button className="CloseButton" onClick={handleClickCloseButton}><p>X</p></button>
              </div>
              <table>
                  <thead>
                      <tr>
                          <th>Course ID</th>
                          <th>Course Name</th>
                          <th>Description</th>
                          <th>Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      {courses.map((course) => (
                          <tr key={course.CourseID}>
                              <td>{course.CourseID}</td>
                              <td>{course.CourseName}</td>
                              <td>{course.Description}</td>
                              <td>
                                  <button onClick={() => handleClick(course.CourseName, course.CourseID)}>
                                      Add
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
              
              {message && (
                <div className='message-container'>
                  <p className='message'>{message}</p>
                  <button className='ok-button' onClick={() => setMessage('')}>
                    Ok
                  </button>
                </div>
              )}
          </div>
      </div>
      )}
    </div>

{/* Enrolled Courses Table */}
      {isVisible.enrolledCourses && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr>
            <th colSpan="4" style={{ fontSize: '1.5rem', padding: '10px', textAlign: 'center', color: 'black' }}>
              Your Enrolled Courses
            </th>
          </tr>
          <tr>
            <th style={{ padding: '8px', border: '1px solid #ddd', color: 'black' }}>Course ID</th>
            <th style={{ padding: '8px', border: '1px solid #ddd', color: 'black' }}>Course Name</th>
            <th style={{ padding: '8px', border: '1px solid #ddd', color: 'black' }}>Description</th>
            <th style={{ padding: '8px', border: '1px solid #ddd', color: 'black' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coursesList.map((course) => (
            <tr key={course.courseID} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px', color: 'black' }}>{course.courseID}</td>
              <td style={{ padding: '8px', color: 'black' }}>{course.courseName}</td>
              <td style={{ padding: '8px', color: 'black' }}>{course.description}</td>
              <td style={{ padding: '8px' }}>
                <button
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#ff4c4c',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '4px',
                  }}
                  onClick={() => handleDelete(course.courseID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4CAF50',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
                onClick={handleClickAddButton}
              >
                Add Course
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
      )}
    

        {/* Test sonu */}

      <Navbar className="navbar" email={email} />

      <div className="top-navbar">
        <h1 className="logo">My App</h1>
        <div className="profile-section">
          <div className="profile-icon" onClick={toggleMenu}>
            <p>{getFirstLetterUpperCase()}</p>
          </div>
          {menuOpen && (
            <div className="dropdown-menu">
              <p>Hoş geldin, {studentName}!</p> {/* studentName burada kullanılıyor */}
              <a href="#profile">Profile</a>
              <a href="#settings">Settings</a>
              <a href="#logout">Logout</a>
            </div>
          )}
        </div>
      </div>
      <div className="dashboard">
        <button className="tile classes" onClick={() => openModal('classes')}>
          <h3>Classes</h3>
        </button>
        <button className="tile grades" onClick={() => openModal('grades')}>
          <h3>Grades</h3>
        </button>
        <button className="tile notes" onClick={() => openModal('notes')}>
          <h3>Notes</h3>
        </button>
        <button className="tile finance" onClick={() => openModal('finance')}>
          <h3>Finance</h3>
        </button>
        <button className="tile payments" onClick={() => openModal('payments')}>
          <h3>Payments</h3>
        </button>
        <button className="tile professors" onClick={() => openModal('professors')}>
          <h3>Professors</h3>
        </button>
        <button className="tile announcements" onClick={() => openModal('announcements')}>
          <h3>Announcements</h3>
        </button>
        <button className="tile make-it-happen" onClick={() => openModal('makeItHappen')}>
          <h3>MAKE IT HAPPEN</h3>
        </button>
      </div>

      <div className="welcome-panel-container">
        <div className="date-panel">September/5/2023</div>
        <div className="welcome-message">
          <p className="welcome-back">Welcome back, {studentName}</p>
          <p className="bottom-sentence">Always stay updated in your student portal</p>
        </div>
      </div>

      {/* <div className="top-panel">
        <ExitToAppOutlinedIcon fontSize="large" />
        <p>{studentName}</p> {/* Giriş yapan kişinin adı */}
      {/* </div>  */}

      {/* Modal Pencereleri */}
      {activeModal && (
        <div className="modal-overlay">
          <div>
            <div className="modal-content">
              <span className="close-modal" onClick={closeModal}>
                &times;
              </span>
              {activeModal === 'classes' && (
                <div>
                  <h2>Classes Information</h2>
                  <p>Here are details about your classes.</p>
                </div>
              )}
              {activeModal === 'grades' && (
                <div>
                  <h2>Grades Information</h2>
                  <p>Here are your grades details.</p>
                </div>
              )}
              {activeModal === 'notes' && (
                <div>
                  <h2>Notes Information</h2>
                  <p>Here are your notes details.</p>
                </div>
              )}
              {activeModal === 'finance' && (
                <div>
                  <h2>Finance Information</h2>
                  <p>Here are details about your financial status.</p>
                </div>
              )}
              {activeModal === 'payments' && (
                <div>
                  <h2>Payments Information</h2>
                  <p>Here are your payment details.</p>
                </div>
              )}
              {activeModal === 'professors' && (
                <div>
                  <h2>Professors Information</h2>
                  <p>Here are details about your professors.</p>
                </div>
              )}
              {activeModal === 'announcements' && (
                <div>
                  <h2>Announcements Information</h2>
                  <p>Here are the latest announcements.</p>
                </div>
              )}
              {activeModal === 'makeItHappen' && (
                <div>
                  <h2>Make It Happen</h2>
                  <p>This is your time to shine. Make it happen!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


    </>
  );
};

export default StudentDetails; // Export edilen isim de büyük harfle başlamalı
