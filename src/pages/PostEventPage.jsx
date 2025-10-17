import React, { useState, useEffect } from "react";
import axios from "axios";

const PostEventPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    qrImage: "",
    date: "",
    time: "",
    location: "",
    highlights: "",
    organizerName: "",
    organizerLogo: "",
    price: "",
    college: "",
    city: "",
    phoneNumber: "",
  });

  const [castMembers, setCastMembers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLocalhost, setIsLocalhost] = useState(true);

  useEffect(() => {
    const hostname = window.location.hostname;
    setIsLocalhost(hostname === "localhost" || hostname === "127.0.0.1");
  }, []);

  if (!isLocalhost) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <h2 className="text-xl font-semibold text-red-600">
          🚫 Access Denied – Event posting is only allowed in development mode.
        </h2>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleImageUpload = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await axios.post("http://localhost:8000/api/upload", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData((prev) => ({
        ...prev,
        [key]: res.data.imageUrl,
      }));

      alert(`✅ ${key} uploaded successfully!`);
    } catch (error) {
      console.error(`${key} upload failed`, error);
      alert(`❌ Failed to upload ${key}.`);
    }
  };

  const handleCastChange = (index, field, value) => {
    const updated = [...castMembers];
    updated[index][field] = value;
    setCastMembers(updated);
  };

  const handleCastImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await axios.post("http://localhost:8000/api/upload", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updated = [...castMembers];
      updated[index].img = res.data.imageUrl;
      setCastMembers(updated);

      alert(`✅ Cast member ${index + 1} image uploaded successfully!`);
    } catch (error) {
      console.error("Cast image upload failed", error);
      alert("❌ Failed to upload cast image.");
    }
  };

  const addCastMember = () => {
    setCastMembers([...castMembers, { name: "", img: "" }]);
  };

  const removeCastMember = (index) => {
    const updated = [...castMembers];
    updated.splice(index, 1);
    setCastMembers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};
    if (formData.title.trim().length < 25) {
      validationErrors.title = "Title must be at least 25 characters long.";
    }

    if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      alert("⚠️ Please enter a valid 10-digit phone number starting with 6–9.");
      return;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const highlightsArray = formData.highlights
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);

    const eventData = {
      ...formData,
      price: Number(formData.price),
      highlights: highlightsArray,
      castMembers,
    };

    try {
      const res = await axios.post("http://localhost:8000/api/events", eventData);
      alert("✅ Event created successfully!");
      console.log(res.data);
    } catch (error) {
      console.error("Error creating event:", error.response?.data || error.message);
      alert("❌ Failed to create event.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Post Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <input
            type="text"
            name="title"
            placeholder="Title (min 25 characters)"
            value={formData.title}
            onChange={handleChange}
            className={`border p-2 w-full ${errors.title ? "border-red-500" : ""}`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        {/* Main Image */}
        <div>
          <label className="block font-semibold mb-1">Main Event Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "image")}
            className="border p-2 w-full"
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="Event Preview"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
        </div>

        {/* Organizer Name */}
        <input
          type="text"
          name="organizerName"
          placeholder="Organizer Name"
          value={formData.organizerName}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        {/* ✅ Organizer Logo (Placed below organizer name) */}
        <div>
          <label className="block font-semibold mb-1">Organizer Logo:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "organizerLogo")}
            className="border p-2 w-full"
          />
          {formData.organizerLogo && (
            <img
              src={formData.organizerLogo}
              alt="Organizer Logo"
              className="mt-2 w-24 h-24 object-cover rounded"
            />
          )}
        </div>

        {/* ✅ Payment QR Image */}
        <div>
          <label className="block font-semibold mb-1">Payment QR:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "qrImage")}
            className="border p-2 w-full"
          />
          {formData.qrImage && (
            <img
              src={formData.qrImage}
              alt="QR Preview"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
        </div>

        {/* Other Fields */}
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="college"
          placeholder="College"
          value={formData.college}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="highlights"
          placeholder="Highlights (comma separated)"
          value={formData.highlights}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="price"
          placeholder="Ticket Price"
          value={formData.price}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        {/* ✅ Cast Members */}
        <div className="border p-3 rounded bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">Cast Members</h3>
            <button
              type="button"
              onClick={addCastMember}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              + Add
            </button>
          </div>

          {castMembers.map((cast, index) => (
            <div key={index} className="border p-2 mb-3 rounded">
              <input
                type="text"
                placeholder="Cast Name"
                value={cast.name}
                onChange={(e) => handleCastChange(index, "name", e.target.value)}
                className="border p-2 w-full mb-2"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleCastImageUpload(e, index)}
                className="border p-2 w-full"
              />
              {cast.img && (
                <img
                  src={cast.img}
                  alt={cast.name}
                  className="mt-2 w-24 h-24 object-cover rounded"
                />
              )}
              <button
                type="button"
                onClick={() => removeCastMember(index)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <input
          type="text"
          name="phoneNumber"
          placeholder="Payment Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Event
        </button>
      </form>
    </div>
  );
};

export default PostEventPage;
