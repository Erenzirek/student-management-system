import axios from "axios";
import { useEffect, useState } from "react";

function CourseAdd() {
  const [tutorials, setTutorials] = useState([]);
  const [newCourse, setNewCourse] = useState({
    CourseID: "",
    CourseName: "",
    Description: ""
  });

  // Fetch all courses
  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const res = await axios.get("http://localhost:8800/courses");
        setTutorials(res.data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };
    fetchAllCourses();
  }, []);

  // Handle input change for the new course form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  // Handle course submission
  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8800/courses", newCourse);
      setTutorials([...tutorials, res.data]); // Update the course list with the new course
      setNewCourse({ CourseID: "", CourseName: "", Description: "" }); // Clear the form
    } catch (err) {
      console.error("Failed to add course:", err);
    }
  };

  return (
    <>
      <div>
        <h1>Courses</h1>
        <table border="1">
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Title</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {tutorials.map((course) => (
              <tr key={course.CourseID}>
                <td>{course.CourseID}</td>
                <td>{course.CourseName}</td>
                <td>{course.Description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h1>Add Course</h1>
        <form onSubmit={handleAddCourse}>
          <div>
            <label>Course ID:</label>
            <input
              type="text"
              name="CourseID"
              value={newCourse.CourseID}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Course Name:</label>
            <input
              type="text"
              name="CourseName"
              value={newCourse.CourseName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              name="Description"
              value={newCourse.Description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <button type="submit">Add Course</button>
        </form>
      </div>
    </>
  );
}

export default CourseAdd;
