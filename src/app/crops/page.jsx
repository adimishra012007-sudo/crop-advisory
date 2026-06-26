"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Button, Input, Modal, Toast, Loader } from "../../components/ui";
import {
  getAllCrops,
  getCrop,
  createCrop,
  updateCrop,
  deleteCrop,
  searchCrop
} from "../../lib/api";

export default function CropsPage() {
  // State variables
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    cropName: "",
    soilType: "",
    season: "",
    waterRequirement: "",
    fertilizer: "",
    description: ""
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch all crops on mount
  useEffect(() => {
    loadCrops();
  }, []);

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const loadCrops = async () => {
    try {
      setLoading(true);
      const data = await getAllCrops();
      setCrops(data);
    } catch (err) {
      console.error(err);
      triggerToast(err.message || "Failed to load crops database.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle live search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadCrops();
      return;
    }
    try {
      setLoading(true);
      const results = await searchCrop(searchQuery);
      setCrops(results);
    } catch (err) {
      console.error(err);
      triggerToast(err.message || "Search failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      cropName: "",
      soilType: "",
      season: "",
      waterRequirement: "",
      fertilizer: "",
      description: ""
    });
    setFormErrors({});
    setEditingId(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.cropName.trim()) {
      errors.cropName = "Crop name is required.";
    }
    if (!formData.soilType.trim()) {
      errors.soilType = "Soil type is required.";
    }
    if (!formData.season.trim()) {
      errors.season = "Season is required.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const newCrop = await createCrop(formData);
      setCrops((prev) => [...prev, newCrop]);
      setIsAddModalOpen(false);
      resetForm();
      triggerToast("Crop created successfully!", "success");
    } catch (err) {
      console.error(err);
      if (err.details) {
        setFormErrors(err.details);
      }
      triggerToast(err.message || "Failed to create crop.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = async (crop) => {
    try {
      setSubmitting(true);
      // Fetch fresh data from backend to demonstrate getCrop(id)
      const freshCrop = await getCrop(crop.id);
      setFormData({
        cropName: freshCrop.cropName || "",
        soilType: freshCrop.soilType || "",
        season: freshCrop.season || "",
        waterRequirement: freshCrop.waterRequirement || "",
        fertilizer: freshCrop.fertilizer || "",
        description: freshCrop.description || ""
      });
      setEditingId(freshCrop.id);
      setIsEditModalOpen(true);
    } catch (err) {
      console.error(err);
      triggerToast(err.message || "Failed to fetch crop details.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const updated = await updateCrop(editingId, formData);
      setCrops((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
      setIsEditModalOpen(false);
      resetForm();
      triggerToast("Crop updated successfully!", "success");
    } catch (err) {
      console.error(err);
      if (err.details) {
        setFormErrors(err.details);
      }
      triggerToast(err.message || "Failed to update crop.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      setSubmitting(true);
      await deleteCrop(id);
      setCrops((prev) => prev.filter((c) => c.id !== id));
      triggerToast("Crop deleted successfully!", "success");
    } catch (err) {
      console.error(err);
      triggerToast(err.message || "Failed to delete crop.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <Navbar />

      <main className="flex-grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-full">
                Crop Database
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mt-3">
                Agro-Advisory Registry
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-2xl">
                Manage crop profiles tailored for the distinct sloped terraces, irrigation cycles, and climate zones of Uttarakhand.
              </p>
            </div>
            
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
              className="md:self-end flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <span>➕</span> Add New Crop
            </Button>
          </div>

          {/* Search Bar Section */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200/60 dark:border-slate-850 shadow-xs mb-8">
            <div className="relative max-w-md w-full">
              <Input
                placeholder="Search by crop name... (e.g. Mandua, Apple)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Main Grid View */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader size="lg" color="emerald" />
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium animate-pulse">
                Fetching regional crop records from Express API...
              </p>
            </div>
          ) : crops.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8">
              <span className="text-4xl mb-4 block">🌾</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No Crops Found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                No records match your query, or the database is currently empty. Try clearing the search or add a new record.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {crops.map((crop) => (
                <div
                  key={crop.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition duration-200 relative group"
                >
                  <div>
                    {/* Badge */}
                    <div className="flex justify-between items-start gap-2 mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900">
                        {crop.season}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-600">
                        ID: {crop.id}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {crop.cropName}
                    </h3>

                    {/* Metadata fields */}
                    <div className="space-y-2 mb-4 text-xs">
                      <div>
                        <strong className="text-slate-400 dark:text-slate-500 block uppercase tracking-wider text-[9px]">Soil Profile</strong>
                        <span className="text-slate-700 dark:text-slate-350">{crop.soilType}</span>
                      </div>
                      <div>
                        <strong className="text-slate-400 dark:text-slate-500 block uppercase tracking-wider text-[9px]">Water Requirement</strong>
                        <span className="text-slate-700 dark:text-slate-350">{crop.waterRequirement}</span>
                      </div>
                      <div>
                        <strong className="text-slate-400 dark:text-slate-500 block uppercase tracking-wider text-[9px]">Optimal Fertilizer</strong>
                        <span className="text-slate-700 dark:text-slate-350">{crop.fertilizer}</span>
                      </div>
                    </div>

                    {crop.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                        {crop.description}
                      </p>
                    )}
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-end gap-3 mt-6 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                    <button
                      onClick={() => openEditModal(crop)}
                      disabled={submitting}
                      className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(crop.id, crop.cropName)}
                      disabled={submitting}
                      className="text-xs font-semibold text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Crop Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          if (!submitting) {
            setIsAddModalOpen(false);
            resetForm();
          }
        }}
        title="Register New Crop Profile"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Crop Name *"
            name="cropName"
            value={formData.cropName}
            onChange={handleFormChange}
            placeholder="e.g. Finger Millet (Mandua)"
            error={formErrors.cropName}
            disabled={submitting}
          />
          
          <Input
            label="Soil Type *"
            name="soilType"
            value={formData.soilType}
            onChange={handleFormChange}
            placeholder="e.g. Sandy loam to clay loam"
            error={formErrors.soilType}
            disabled={submitting}
          />

          <Input
            label="Season (Kharif / Rabi / Zaid / Winter) *"
            name="season"
            value={formData.season}
            onChange={handleFormChange}
            placeholder="e.g. Kharif"
            error={formErrors.season}
            disabled={submitting}
          />

          <Input
            label="Water Requirement"
            name="waterRequirement"
            value={formData.waterRequirement}
            onChange={handleFormChange}
            placeholder="e.g. Low (rainfed)"
            disabled={submitting}
          />

          <Input
            label="Recommended Fertilizer"
            name="fertilizer"
            value={formData.fertilizer}
            onChange={handleFormChange}
            placeholder="e.g. Farmyard manure (FYM), Jivamrit"
            disabled={submitting}
          />

          <div className="flex flex-col space-y-1.5 w-full">
            <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              Description / Notes
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Provide crop attributes, harvesting notes, or disease prevention instructions..."
              disabled={submitting}
              className="w-full px-3 py-2 border rounded-lg shadow-sm text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 dark:bg-slate-900 dark:text-slate-100 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-700"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-150 dark:border-slate-800">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              disabled={submitting}
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Create Crop"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Crop Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          if (!submitting) {
            setIsEditModalOpen(false);
            resetForm();
          }
        }}
        title="Edit Crop Profile"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Crop Name *"
            name="cropName"
            value={formData.cropName}
            onChange={handleFormChange}
            placeholder="e.g. Finger Millet (Mandua)"
            error={formErrors.cropName}
            disabled={submitting}
          />
          
          <Input
            label="Soil Type *"
            name="soilType"
            value={formData.soilType}
            onChange={handleFormChange}
            placeholder="e.g. Sandy loam to clay loam"
            error={formErrors.soilType}
            disabled={submitting}
          />

          <Input
            label="Season (Kharif / Rabi / Zaid / Winter) *"
            name="season"
            value={formData.season}
            onChange={handleFormChange}
            placeholder="e.g. Kharif"
            error={formErrors.season}
            disabled={submitting}
          />

          <Input
            label="Water Requirement"
            name="waterRequirement"
            value={formData.waterRequirement}
            onChange={handleFormChange}
            placeholder="e.g. Low (rainfed)"
            disabled={submitting}
          />

          <Input
            label="Recommended Fertilizer"
            name="fertilizer"
            value={formData.fertilizer}
            onChange={handleFormChange}
            placeholder="e.g. Farmyard manure (FYM), Jivamrit"
            disabled={submitting}
          />

          <div className="flex flex-col space-y-1.5 w-full">
            <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              Description / Notes
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Provide crop attributes, harvesting notes, or disease prevention instructions..."
              disabled={submitting}
              className="w-full px-3 py-2 border rounded-lg shadow-sm text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 dark:bg-slate-900 dark:text-slate-100 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-700"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-150 dark:border-slate-800">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              disabled={submitting}
              onClick={() => {
                setIsEditModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Toast notifications */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}

      {/* Global submitting spinner overlay */}
      {submitting && !isAddModalOpen && !isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center z-50">
          <Loader size="lg" color="emerald" />
        </div>
      )}

      <Footer />
    </div>
  );
}
