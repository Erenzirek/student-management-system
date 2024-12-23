import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import './studentdetails.css';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import Navbar from "./navbar";
import './topnavbar.css';
import Classes from "./classes";

const StudentDetails = () => {
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState("");
  const location = useLocation();
  const { email } = location.state || {};
  const [foundStudentId, setFoundStudentId] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [instructor, setInstructor] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [coursesList, setCoursesList] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledcourses] = useState([]);
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState({ courses: false, enrolledCourses: false });
  const [midterm, setMidterm] = useState('');
  const [final_exam, setFinalExam] = useState('');
  const [courseId, setCourseId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    if (location.state && location.state.id) {
      setStudentId(location.state.id);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8800/courses/${courseId}`);
        console.log("Fetched course data:", response.data);
        setCourse(response.data.data);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError(err.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

    // Sadece course bilgisini konsola yazdırıyoruz
    useEffect(() => {
      if (course) {
        
        console.log(course); // course verisini konsola yazdırıyoruz
      }
    }, [course]);
    console.log(course);
  
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
        instructor,
        midterm,
        final_exam
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

  const toggleTable = (section) => {
    setIsVisible((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  useEffect(() => {
    if (course) {
      console.log("Course details:", course);
    }
  }, [course]);

  const getFirstLetterUpperCase = () => {
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
      setFoundStudentId(student.id);
      setStudentName(student.name);
    }
  }, [email, students]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar className="navbar" email={email} />

      <div className="top-navbar">
        <h1 className="logo">Student Management System</h1>
        <div className="profile-section">
          <div className="profile-icon" onClick={toggleMenu}>
            <p>{getFirstLetterUpperCase()}</p>
          </div>
          {menuOpen && (
            <div className="dropdown-menu">
              <p>Hoş geldin, {studentName}!</p>
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
          <h3>Enrolled Courses</h3>
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
          <div><p className="welcome-back">Welcome back, {studentName}</p></div>
          <div><p className="bottom-sentence">Always stay updated in your student portal</p></div>
        </div>
      </div>

      {activeModal && (
        <div className="modal-overlay">
          <div>
            <div className="modal-content">
              <span className="close-modal" onClick={closeModal}>
                &times;
              </span>
              {activeModal === 'classes' && (
                <div>
                  <div>
                    {message && (
                      <div className='message-container'>
                        <p className='message'>{message}</p>
                        <button className='ok-button' onClick={() => setMessage('')}>
                          Ok
                        </button>
                      </div>
                    )}
                  </div>
                  <table className="table-container">
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
                </div>
              )}
              {activeModal === 'grades' && (
                <div>
                  <table className="table-container">
                    <thead>
                      <tr>
                        <th colSpan="4">Grades Information</th>
                      </tr>
                      <tr>
                        <th>Course ID</th>
                        <th>Course Name</th>
                        <th>Midterm</th>
                        <th>Final</th>
                        <th>instructor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coursesList.map((course) => (
                        <tr key={course.courseID}>
                          <td>{course.courseID}</td>
                          <td>{course.courseName}</td>
                          <td>{course.midterm}</td>
                          <td>{course.final_exam}</td>
                          <td>{course.instructor}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>
                          <button onClick={handleClickAddButton}>Add Course</button>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
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
                  <table className="table-container">
                    <thead>
                      <tr>
                        <th colSpan="4">Your Enrolled Courses</th>
                      </tr>
                      <tr>
                        <th>Course ID</th>
                        <th>Course Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coursesList.map((course) => (
                        <tr key={course.courseID}>
                          <td>{course.courseID}</td>
                          <td>{course.courseName}</td>
                          <td>{course.description}</td>
                          <td>
                            <button onClick={() => handleDelete(course.courseID)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>
                          <button onClick={handleClickAddButton}>Add Course</button>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
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

export default StudentDetails;