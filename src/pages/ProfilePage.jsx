import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const ProfilePage = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        setError("");

        const loggedInStudentId = localStorage.getItem("studentId");

        console.log("🔍 Fetching profile for:", loggedInStudentId);

        if (!loggedInStudentId) {
          setError("Please log in to view your profile");
          setLoading(false);
          setTimeout(() => navigate("/LogSign"), 2000);
          return;
        }

        let studentData = null;

        // Try to fetch by custom studentId first (like "S1756400179340")
        if (loggedInStudentId.startsWith('S')) {
          try {
            const response = await axios.get(`${API_BASE_URL}/api/students/studentId/${loggedInStudentId}`);
            studentData = response.data;
          } catch (err) {
            console.log("Failed to fetch by custom studentId, trying by MongoDB _id");
          }
        }

        // If not found by custom studentId, try by MongoDB _id
        if (!studentData) {
          try {
            const response = await axios.get(`${API_BASE_URL}/api/students/${loggedInStudentId}`);
            studentData = response.data;
          } catch (err) {
            console.log("Failed to fetch by MongoDB _id");
          }
        }

        // If still not found, try fetching all students and finding by studentId
        if (!studentData) {
          try {
            const response = await axios.get(`${API_BASE_URL}/api/students`);
            const allStudents = response.data;
            studentData = allStudents.find(s => s.studentId === loggedInStudentId);
          } catch (err) {
            console.log("Failed to fetch all students");
          }
        }

        if (!studentData) {
          setError("Student not found. Please try logging in again.");
          return;
        }

        // Check if user has a saved profile photo
        const studentId = localStorage.getItem('studentId');
        const savedPhoto = localStorage.getItem(`profilePhoto_${studentId}`);
        if (savedPhoto) {
          studentData.avatar = savedPhoto;
        }

        // Convert year to readable format
        studentData.year = `${studentData.year} ${
          studentData.year === 1
            ? "st"
            : studentData.year === 2
            ? "nd"
            : studentData.year === 3
            ? "rd"
            : "th"
        } Year`;

        setStudent(studentData);
      } catch (err) {
        console.error("Error fetching student:", err.response || err.message);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  // Handle photo upload
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('studentId', localStorage.getItem('studentId'));

      // Convert image to base64 and save to localStorage
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoDataUrl = e.target.result;
        
        // Save photo URL to localStorage with user-specific key
        const studentId = localStorage.getItem('studentId');
        localStorage.setItem(`profilePhoto_${studentId}`, photoDataUrl);
        
        // Update local state
        setStudent(prev => ({
          ...prev,
          avatar: photoDataUrl
        }));
        
        setUploading(false);
        console.log('Photo uploaded and saved successfully');
      };
      reader.readAsDataURL(file);

    } catch (err) {
      setError('Failed to upload photo. Please try again.');
      setUploading(false);
    }
  };

  // Function to remove profile photo (for future use)
  const removeProfilePhoto = () => {
    const studentId = localStorage.getItem('studentId');
    localStorage.removeItem(`profilePhoto_${studentId}`);
    
    setStudent(prev => ({
      ...prev,
      avatar: null
    }));
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg animate-pulse">Loading profile...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  if (!student) return null;

  return (
    <div className="min-h-screen py-12 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-40 relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 translate-y-1/2">
            <div className="relative group cursor-pointer">
              <img
                src={
                  student.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    student.name
                  )}&background=6d28d9&color=fff&size=128`
                }
                alt={student.name}
                className="w-28 h-28 rounded-full border-4 border-white shadow-lg transition-all duration-300"
              />
              
              {/* Small camera icon in bottom-right corner */}
              <div className="absolute -bottom-1 -right-1 bg-purple-600 hover:bg-purple-700 rounded-full p-2 shadow-lg transition-all duration-300 group-hover:scale-110">
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg 
                    className="w-4 h-4 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                  </svg>
                )}
              </div>
              
              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
              />
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 pb-10 px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
          <p className="text-gray-500 text-lg mb-6">{student.branch}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <ProfileField label="Roll Number" value={student.rollNumber} />
            <ProfileField label="Student ID" value={student.studentId} />
            <ProfileField label="Year" value={student.year} />
            <ProfileField label="Email" value={student.email} />
            <ProfileField label="College" value={student.college?.name || "Unknown"} />
          </div>

        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="flex flex-col bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <span className="text-lg font-semibold text-gray-900">{value}</span>
  </div>
);

export default ProfilePage;
