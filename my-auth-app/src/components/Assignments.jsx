import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Assignments = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedTo: '',
    fileUrl: ''
  });

  const [courses, setCourses] = useState([]); // to store fetched courses
  const [errors, setErrors] = useState({}); // for validation errors
  const BACKEND_URI = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // clear error on change
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.dueDate) newErrors.dueDate = 'Due date is required';
    if (!form.assignedTo) newErrors.assignedTo = 'Please select an assignee';
    // fileUrl optional, so no validation here

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // stop submitting if errors
    }

    try {
      await axios.post('/api/assignments/add', form);
      alert('Assignment added successfully!');
      setForm({
        title: '',
        description: '',
        dueDate: '',
        assignedTo: '',
        fileUrl: ''
      });
      setErrors({});
    } catch (err) {
      alert('Failed to add assignment');
    }
  };

  // get all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${BACKEND_URI}/get-courses`); // Your API to get courses
        setCourses(res.data);
      } catch (error) {
        console.error('Failed to fetch courses', error);
      }
    };
    fetchCourses();
  }, []);
  console.log(courses)
  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Add Assignment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.title ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
            }`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.description ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
            }`}
          ></textarea>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.dueDate ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
            }`}
          />
          {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Assigned To</label>
          <select
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.assignedTo ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
            }`}
          >
            <option value="">Select a class or user</option>
            <option value="classA">Class A</option>
            <option value="classB">Class B</option>
            <option value="user123">User 123</option>
          </select>
          {errors.assignedTo && <p className="text-red-500 text-sm mt-1">{errors.assignedTo}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">File URL (optional)</label>
          <input
            type="text"
            name="fileUrl"
            value={form.fileUrl}
            onChange={handleChange}
            placeholder="https://example.com/file.pdf"
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add Assignment
        </button>
      </form>
    </div>
  );
};

export default Assignments;
