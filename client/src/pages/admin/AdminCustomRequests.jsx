import React, { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  X
} from 'lucide-react';
import api from '../../utils/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const AdminCustomRequests = () => {
  const { addToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Form state
  const [status, setStatus] = useState('');
  const [quoteAmount, setQuoteAmount] = useState('');
  const [quoteNote, setQuoteNote] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const url = statusFilter !== 'all' ? `/custom-orders/admin/all?status=${statusFilter}` : '/custom-orders/admin/all';
      const { data } = await api.get(url);
      if (data.success) {
        setRequests(data.data || []);
      }
    } catch (e) {
      addToast(e.message || 'Failed to load inquiries', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const openManageModal = (req) => {
    setSelectedRequest(req);
    setStatus(req.status);
    setQuoteAmount(req.adminQuote?.amount || '');
    setQuoteNote(req.adminQuote?.note || '');
    setInternalNotes(req.internalNotes || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    setUpdating(true);
    try {
      const payload = {
        status,
        internalNotes,
        adminQuote: {
          amount: Number(quoteAmount) || 0,
          note: quoteNote
        }
      };

      const { data } = await api.put(`/custom-orders/admin/${selectedRequest._id}`, payload);
      if (data.success) {
        addToast(`Inquiry ${selectedRequest.referenceNumber} updated!`, 'success');
        setSelectedRequest(null);
        fetchRequests();
      }
    } catch (err) {
      addToast(err.message || 'Update failed', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C26D53]">
            Bespoke Commissions
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#24211E]">
            Custom Order Inquiries
          </h1>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs p-2.5 bg-white rounded-xl border border-[#DED4C5] font-semibold text-[#4A443E] self-start sm:self-auto"
        >
          <option value="all">All Inquiry Statuses</option>
          <option value="Pending">Pending Review</option>
          <option value="Reviewing">Reviewing</option>
          <option value="Quoted">Quoted</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Grid of Inquiries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-[#8C8276] text-xs">
            Loading custom requests...
          </div>
        ) : requests.length > 0 ? (
          requests.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-3xl border border-[#EDE5D8] p-6 flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-3 mb-3">
                  <span className="font-mono text-xs font-bold text-[#C26D53]">
                    {req.referenceNumber}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF5ED] text-[#875B1F] border border-[#E8D8B8]">
                    {req.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-art text-lg font-bold text-[#24211E]">{req.customerName}</h4>
                  <div className="flex items-center gap-3 text-xs text-[#736A62]">
                    <span className="font-semibold text-[#A67C52]">{req.productType}</span>
                    <span>•</span>
                    <span>Budget: {req.budget}</span>
                  </div>
                </div>

                <p className="text-xs text-[#665E56] line-clamp-3 mt-3 leading-relaxed">
                  "{req.designDescription}"
                </p>

                {/* Reference images */}
                {req.referenceImages && req.referenceImages.length > 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {req.referenceImages.map((img, i) => (
                      <a key={i} href={img} target="_blank" rel="noopener noreferrer">
                        <img
                          src={img}
                          alt="ref"
                          className="w-12 h-12 rounded-lg object-cover border border-[#DED4C5]"
                        />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Quick Contact & Manage */}
              <div className="pt-3 border-t border-[#F2ECE3] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${req.phone}`}
                    className="p-2 rounded-lg bg-[#FAF6EE] text-[#4A443E] hover:text-[#C26D53]"
                    title="Call"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`mailto:${req.email}`}
                    className="p-2 rounded-lg bg-[#FAF6EE] text-[#4A443E] hover:text-[#C26D53]"
                    title="Email"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>

                <button
                  onClick={() => openManageModal(req)}
                  className="px-4 py-1.5 rounded-xl bg-[#24211E] hover:bg-[#C26D53] text-white text-xs font-bold transition-colors"
                >
                  Manage & Quote
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-[#8C8276] text-xs">
            No custom order inquiries found.
          </div>
        )}
      </div>

      {/* Manage Custom Request Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative bg-[#FDFBF7] rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-[#ECE5D8]">
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-4 right-4 p-2 text-[#8C8276]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-editorial text-2xl font-bold text-[#24211E] mb-2">
              Custom Inquiry: {selectedRequest.referenceNumber}
            </h3>

            <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#EDE5D8] mb-4 text-xs space-y-1">
              <p><b>Client:</b> {selectedRequest.customerName} ({selectedRequest.email}, {selectedRequest.phone})</p>
              <p><b>Craft:</b> {selectedRequest.productType}</p>
              <p><b>Colors:</b> {selectedRequest.preferredColors || 'None specified'}</p>
              <p><b>Budget:</b> {selectedRequest.budget}</p>
              <p><b>Details:</b> {selectedRequest.designDescription}</p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Inquiry Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2.5 bg-white rounded-xl border border-[#DED4C5]"
                >
                  <option value="Pending">Pending Review</option>
                  <option value="Reviewing">Reviewing Photos</option>
                  <option value="Quoted">Quoted to Customer</option>
                  <option value="In Progress">In Progress (Crafting)</option>
                  <option value="Completed">Completed & Dispatched</option>
                  <option value="Rejected">Declined</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Quote Amount (₹)</label>
                  <input
                    type="number"
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value)}
                    placeholder="2500"
                    className="w-full p-2.5 bg-white rounded-xl border border-[#DED4C5]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Quote Note</label>
                  <input
                    type="text"
                    value={quoteNote}
                    onChange={(e) => setQuoteNote(e.target.value)}
                    placeholder="Includes wooden frame & shipping"
                    className="w-full p-2.5 bg-white rounded-xl border border-[#DED4C5]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Internal Studio Notes (Private)</label>
                <textarea
                  rows={2}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Private artisan notes regarding thread palette or client discussions..."
                  className="w-full p-2.5 bg-white rounded-xl border border-[#DED4C5]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EDE5D8]">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-[#C26D53] text-white font-bold rounded-xl"
                >
                  {updating ? 'Saving...' : 'Save Inquiry Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomRequests;
