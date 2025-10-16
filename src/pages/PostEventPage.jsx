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
    castMembers: "",
    college: "",
    city: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [isLocalhost, setIsLocalhost] = useState(true);

  useEffect(() => {
    // ✅ Detect if running on localhost
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      setIsLocalhost(true);
    } else {
      setIsLocalhost(false);
    }
  }, []);

  // 🚫 If not localhost, show access denied message
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

  const handleImageUpload = async (e) => {
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
        image: res.data.imageUrl,
      }));
      alert("✅ Main image uploaded successfully!");
    } catch (error) {
      console.error("Image upload failed", error);
      alert("❌ Failed to upload image.");
    }
  };

  const handleQrUpload = async (e) => {
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
        qrImage: res.data.imageUrl,
      }));
      alert("✅ QR Image uploaded successfully!");
    } catch (error) {
      console.error("QR upload failed", error);
      alert("❌ Failed to upload QR image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};

    if (formData.title.trim().length < 25) {
      validationErrors.title = "Title must be at least 25 characters long.";
    }

    // ✅ Validate phone number (10 digits, starts with 6–9)
    if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      alert("⚠️ Please enter a valid 10-digit phone number starting with 6–9 (no +91 or spaces).");
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

    const castMembersArray = formData.castMembers
      .split(",")
      .map((item) => {
        const [name, img] = item.split("|").map((v) => v.trim());
        return { name, img };
      })
      .filter((cm) => cm.name && cm.img);

    const eventData = {
      ...formData,
      price: Number(formData.price),
      highlights: highlightsArray,
      castMembers: castMembersArray,
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
        {/* Title input */}
        <div>
          <input
            type="text"
            name="title"
            placeholder="Title (min 25 characters)"
            value={formData.title}
            onChange={handleChange}
            className={`border p-2 w-full ${errors.title ? "border-red-500" : ""}`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        {/* Main Image upload */}
        <div>
          <input
            type="text"
            name="image"
            placeholder="Main Image URL"
            value={formData.image}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="border p-2 w-full"
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
        </div>

        {/* QR Upload */}
        <div>
          <input
            type="text"
            name="qrImage"
            placeholder="QR Image URL"
            value={formData.qrImage}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleQrUpload}
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

        <input type="date" name="date" value={formData.date} onChange={handleChange} className="border p-2 w-full" />
        <input type="time" name="time" value={formData.time} onChange={handleChange} className="border p-2 w-full" />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="border p-2 w-full" />

        <input type="text" name="college" placeholder="College" value={formData.college} onChange={handleChange} className="border p-2 w-full" />
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="border p-2 w-full" />

        <input type="text" name="highlights" placeholder="Highlights (comma separated)" value={formData.highlights} onChange={handleChange} className="border p-2 w-full" />
        <input type="text" name="organizerName" placeholder="Organizer Name" value={formData.organizerName} onChange={handleChange} className="border p-2 w-full" />
        <input type="text" name="organizerLogo" placeholder="Organizer Logo URL" value={formData.organizerLogo} onChange={handleChange} className="border p-2 w-full" />

        <input type="number" name="price" placeholder="Ticket Price" value={formData.price} onChange={handleChange} className="border p-2 w-full" />
        <input type="text" name="castMembers" placeholder="Cast Members (name|img, name|img)" value={formData.castMembers} onChange={handleChange} className="border p-2 w-full" />
        <input type="text" name="phoneNumber" placeholder="Payment Phone Number" value={formData.phoneNumber} onChange={handleChange} className="border p-2 w-full" required />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Event
        </button>
      </form>
    </div>
  );
};

export default PostEventPage;
