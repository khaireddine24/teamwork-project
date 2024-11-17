import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
  });

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/users/me"); // Adjust endpoint as per backend
      setProfile(response.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="mt-4">
        <p>Name: {profile.name}</p>
        <p>Email: {profile.email}</p>
        <p>Phone: {profile.phone}</p>
      </div>
      {/* We’ll add a form for editing profile later */}
    </div>
  );
};

export default ProfilePage;
