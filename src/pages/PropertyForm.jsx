import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUpload, FiSave, FiArrowLeft, FiX } from 'react-icons/fi';
import { propertyAPI } from '../services/api';
import {
  PROPERTY_TYPES,
  CATEGORIES,
  TYPE_TO_CATEGORY,
  emptyProperty,
} from '../utils/constants';

const MAX_IMAGES = 3;

export default function PropertyForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyProperty);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const totalImages = existingImages.length + newImages.length;

  useEffect(() => {
    if (!isEdit) return;

    propertyAPI
      .getById(id)
      .then((res) => {
        const p = res.data.data;
        setForm({
          name: p.name,
          location: p.location,
          pricePerSqYard: p.pricePerSqYard,
          totalPrice: p.totalPrice || '',
          size: p.size,
          type: p.type,
          category: p.category,
          featured: p.featured,
          isActive: p.isActive,
        });
        const imgs = p.images?.length ? p.images : p.image ? [p.image] : [];
        setExistingImages(imgs);
      })
      .catch(() => {
        toast.error('Property not found');
        navigate('/');
      })
      .finally(() => setLoading(false));
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setForm((prev) => {
      const updated = { ...prev, [name]: val };
      if (name === 'type') {
        updated.category = TYPE_TO_CATEGORY[value] || prev.category;
      }
      return updated;
    });
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const slotsLeft = MAX_IMAGES - totalImages;
    if (slotsLeft <= 0) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    const toAdd = files.slice(0, slotsLeft).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewImages((prev) => [...prev, ...toAdd]);
    e.target.value = '';
  };

  const removeExisting = (url) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

  const removeNew = (index) => {
    setNewImages((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[index].preview);
      copy.splice(index, 1);
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEdit && newImages.length === 0) {
      toast.error('Please upload at least one property image');
      return;
    }

    if (isEdit && totalImages === 0) {
      toast.error('At least one image is required');
      return;
    }

    setSaving(true);
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (isEdit) {
      formData.append('keepImages', JSON.stringify(existingImages));
    }

    newImages.forEach(({ file }) => formData.append('images', file));

    try {
      if (isEdit) {
        await propertyAPI.update(id, formData);
        toast.success('Property updated successfully');
      } else {
        await propertyAPI.create(formData);
        toast.success('Property published to website');
      }
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save property');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="property-form-page">
      <div className="page-header">
        <div>
          <button type="button" className="back-link" onClick={() => navigate('/')}>
            <FiArrowLeft /> Back
          </button>
          <h1>{isEdit ? 'Edit Property' : 'Add New Property'}</h1>
          <p>Upload up to {MAX_IMAGES} land photos — shown in image preview gallery</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="property-form">
        <div className="property-form__grid">
          <div className="property-form__main">
            <section className="form-section">
              <h2>Basic Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Property Name *</label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Green Valley Layout"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="location">Location *</label>
                  <input
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Shamshabad, Hyderabad"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="type">Property Type *</label>
                  <select id="type" name="type" value={form.type} onChange={handleChange} required>
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select id="category" name="category" value={form.category} onChange={handleChange} required>
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <section className="form-section">
              <h2>Pricing & Size</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pricePerSqYard">Price per Sq.Yard *</label>
                  <input
                    id="pricePerSqYard"
                    name="pricePerSqYard"
                    value={form.pricePerSqYard}
                    onChange={handleChange}
                    placeholder="₹12,500"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="size">Property Size *</label>
                  <input
                    id="size"
                    name="size"
                    value={form.size}
                    onChange={handleChange}
                    placeholder="e.g. 117 Sq.Yds or 150 – 500 Sq.Yds"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="totalPrice">Total Price *</label>
                <input
                  id="totalPrice"
                  name="totalPrice"
                  value={form.totalPrice}
                  onChange={handleChange}
                  placeholder="₹18,75,000"
                  required
                />
              </div>
            </section>
          </div>

          <div className="property-form__sidebar">
            <section className="form-section">
              <h2>Property Images ({totalImages}/{MAX_IMAGES}) {!isEdit && '*'}</h2>
              <p className="form-hint">Upload 1–3 photos. Visitors can swipe through all images.</p>

              <div className="image-grid">
                {existingImages.map((url) => (
                  <div key={url} className="image-grid__item">
                    <img src={url} alt="Existing" />
                    <button type="button" className="image-grid__remove" onClick={() => removeExisting(url)}>
                      <FiX />
                    </button>
                  </div>
                ))}
                {newImages.map((img, i) => (
                  <div key={img.preview} className="image-grid__item">
                    <img src={img.preview} alt={`New ${i + 1}`} />
                    <button type="button" className="image-grid__remove" onClick={() => removeNew(i)}>
                      <FiX />
                    </button>
                  </div>
                ))}
                {totalImages < MAX_IMAGES && (
                  <label className="image-grid__add">
                    <FiUpload />
                    <span>Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagesChange}
                      hidden
                    />
                  </label>
                )}
              </div>
            </section>

            <section className="form-section">
              <h2>Visibility</h2>
              <label className="toggle-label">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                />
                Show on homepage (Featured)
              </label>
              <label className="toggle-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                />
                Active on website
              </label>
            </section>

            <button type="submit" className="btn btn--primary btn--block" disabled={saving}>
              <FiSave />
              {saving ? 'Saving...' : isEdit ? 'Update Property' : 'Publish Property'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
