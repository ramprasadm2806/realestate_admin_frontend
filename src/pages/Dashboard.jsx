import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiEye, FiEyeOff } from 'react-icons/fi';
import { propertyAPI } from '../services/api';

export default function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchProperties = async () => {
    try {
      const res = await propertyAPI.getAll();
      setProperties(res.data.data);
    } catch {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    try {
      await propertyAPI.delete(id);
      toast.success('Property deleted');
      setDeleteId(null);
      fetchProperties();
    } catch {
      toast.error('Failed to delete property');
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
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1>Properties</h1>
          <p>{properties.length} total listings</p>
        </div>
        <Link to="/add" className="btn btn--primary">
          <FiPlus /> Add Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="empty-state">
          <p>No properties yet. Add your first land listing.</p>
          <Link to="/add" className="btn btn--primary">
            <FiPlus /> Add Property
          </Link>
        </div>
      ) : (
        <div className="property-table-wrap">
          <table className="property-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Property</th>
                <th>Location</th>
                <th>Total Price</th>
                <th>Per Sq.Yd</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img src={p.image} alt={p.name} className="property-table__thumb" />
                  </td>
                  <td>
                    <strong>{p.name}</strong>
                    <span>{p.size}</span>
                  </td>
                  <td>{p.location}</td>
                  <td className="price">{p.totalPrice || '—'}</td>
                  <td className="price price--secondary">{p.pricePerSqYard}</td>
                  <td>
                    <span className="badge">{p.type}</span>
                  </td>
                  <td>
                    <span className={`status ${p.isActive ? 'active' : 'inactive'}`}>
                      {p.isActive ? <><FiEye /> Active</> : <><FiEyeOff /> Hidden</>}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <Link to={`/edit/${p._id}`} className="btn-icon" title="Edit">
                        <FiEdit2 />
                      </Link>
                      <button
                        type="button"
                        className="btn-icon btn-icon--danger"
                        title="Delete"
                        onClick={() => setDeleteId(p._id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Property?</h3>
            <p>This will permanently remove the property and its image from the website.</p>
            <div className="modal__actions">
              <button type="button" className="btn btn--outline" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button type="button" className="btn btn--danger" onClick={() => handleDelete(deleteId)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
