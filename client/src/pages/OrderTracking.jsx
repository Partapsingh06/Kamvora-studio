import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  ExternalLink,
  MapPin
} from 'lucide-react';
import api from '../utils/api.js';
import { formatPrice } from '../utils/currency.js';

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('orderNumber') || searchParams.get('ref') || '';

  const [query, setQuery] = useState(initialQuery);
  const [trackingData, setTrackingData] = useState(null);
  const [isCustomRequest, setIsCustomRequest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (searchVal) => {
    const val = searchVal || query;
    if (!val || !val.trim()) return;

    setLoading(true);
    setError('');
    setTrackingData(null);

    const clean = val.trim().toUpperCase();

    try {
      if (clean.startsWith('KAM-CUST') || clean.includes('CUST')) {
        // Custom order tracking
        const { data } = await api.get(`/custom-orders/track/${clean}`);
        if (data.success && data.data) {
          setIsCustomRequest(true);
          setTrackingData(data.data);
        } else {
          setError('Custom request reference not found');
        }
      } else {
        // Standard order tracking
        const { data } = await api.get(`/orders/${clean}`);
        if (data.success && data.data) {
          setIsCustomRequest(false);
          setTrackingData(data.data);
        } else {
          setError('Order not found with this number');
        }
      }
    } catch (err) {
      setError(err.message || 'Tracking reference not found. Please verify the order number.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleTrack(initialQuery);
    }
  }, [initialQuery]);

  const orderSteps = [
    { key: 'Pending', label: 'Order Received' },
    { key: 'Confirmed', label: 'Confirmed by Studio' },
    { key: 'Processing', label: 'Handcrafting & Packing' },
    { key: 'Shipped', label: 'In Transit' },
    { key: 'Delivered', label: 'Delivered' }
  ];

  const customSteps = [
    { key: 'Pending', label: 'Inquiry Received' },
    { key: 'Reviewing', label: 'Under Artist Review' },
    { key: 'Quoted', label: 'Quote Provided' },
    { key: 'In Progress', label: 'Crafting in Studio' },
    { key: 'Completed', label: 'Finished & Dispatched' }
  ];

  const getStepStatus = (stepKey, currentStatus, stepsList) => {
    const orderIndex = stepsList.findIndex((s) => s.key === currentStatus);
    const thisIndex = stepsList.findIndex((s) => s.key === stepKey);

    if (currentStatus === 'Cancelled') {
      return 'cancelled';
    }

    if (thisIndex < orderIndex) return 'completed';
    if (thisIndex === orderIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10">
      {/* Page Title */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C26D53]">
          Live Studio Tracker
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl font-medium text-[#24211E]">
          Track Your Creation
        </h1>
        <p className="text-xs sm:text-sm text-[#736A62]">
          Enter your Order Number (e.g. KAM-ORD-...) or Custom Request Reference (e.g. KAM-CUST-...) to see real-time updates.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="max-w-xl mx-auto bg-[#FAF6EE] p-3 sm:p-4 rounded-3xl border border-[#EDE5D8] shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrack();
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8276]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. KAM-ORD-10023 or KAM-CUST-8921"
              required
              className="w-full uppercase font-mono text-xs sm:text-sm p-3 pl-11 bg-white rounded-full border border-[#DED4C5] focus:outline-none focus:border-[#C26D53] text-[#24211E]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3 bg-[#C26D53] hover:bg-[#AD5940] text-white text-xs sm:text-sm font-bold rounded-full transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            <Package className="w-4 h-4" />
            <span>{loading ? 'Tracking...' : 'Track Status'}</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tracking Result View */}
      {trackingData && (
        <div className="bg-[#FAF6EE] rounded-3xl border border-[#EDE5D8] p-6 sm:p-10 space-y-8 shadow-sm animate-in fade-in">
          {/* Header Card Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE2D5]">
            <div>
              <span className="text-xs text-[#8C8276]">
                {isCustomRequest ? 'Custom Order Reference' : 'Order Reference'}
              </span>
              <div className="font-mono text-xl font-bold text-[#24211E]">
                {trackingData.orderNumber || trackingData.referenceNumber}
              </div>
              <span className="text-[11px] text-[#A89F95]">
                Initiated on {new Date(trackingData.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
              </span>
            </div>

            <div className="flex flex-col items-start sm:items-end">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#C26D53] text-white">
                Current Status: {trackingData.orderStatus || trackingData.status}
              </span>
              {trackingData.totalPrice && (
                <span className="text-xs text-[#736A62] mt-1">
                  Total: <b className="text-[#24211E]">{formatPrice(trackingData.totalPrice)}</b>
                </span>
              )}
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="py-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A67C52] mb-6">
              Production & Transit Progress
            </h4>

            {(() => {
              const activeSteps = isCustomRequest ? customSteps : orderSteps;
              const currentStatus = trackingData.orderStatus || trackingData.status;

              return (
                <div className="relative">
                  <div className="grid grid-cols-5 gap-2 text-center">
                    {activeSteps.map((step, idx) => {
                      const status = getStepStatus(step.key, currentStatus, activeSteps);
                      const isCompleted = status === 'completed';
                      const isCurrent = status === 'current';

                      return (
                        <div key={step.key} className="flex flex-col items-center relative z-10">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                              isCompleted
                                ? 'bg-emerald-600 text-white'
                                : isCurrent
                                ? 'bg-[#C26D53] text-white ring-4 ring-[#F2D7D0]'
                                : 'bg-[#EAE2D5] text-[#8C8276]'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>
                          <span
                            className={`text-[10px] sm:text-xs font-semibold mt-2.5 leading-tight ${
                              isCurrent ? 'text-[#C26D53]' : isCompleted ? 'text-[#24211E]' : 'text-[#8C8276]'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Tracking Courier Details if available */}
          {trackingData.trackingDetails?.trackingNumber && (
            <div className="p-4 rounded-2xl bg-white border border-[#EDE5D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#A67C52] tracking-wider">
                  Courier Tracking Partner
                </span>
                <p className="text-xs sm:text-sm font-semibold text-[#24211E] mt-0.5">
                  {trackingData.trackingDetails.courier || 'Bluedart / DTDC Courier'} - AWB: {trackingData.trackingDetails.trackingNumber}
                </p>
                {trackingData.trackingDetails.estimatedDelivery && (
                  <p className="text-[11px] text-[#736A62]">
                    Estimated Arrival: {trackingData.trackingDetails.estimatedDelivery}
                  </p>
                )}
              </div>

              {trackingData.trackingDetails.trackingUrl && (
                <a
                  href={trackingData.trackingDetails.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#24211E] hover:bg-[#C26D53] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <span>Track Courier Live</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* Items Preview */}
          {trackingData.items && (
            <div className="space-y-3 pt-4 border-t border-[#EAE2D5]">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#A67C52]">
                Order Contents
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trackingData.items.map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white border border-[#EDE5D8] flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-[#FAF5ED]"
                    />
                    <div className="text-xs min-w-0">
                      <p className="font-semibold text-[#24211E] truncate">{item.name}</p>
                      <p className="text-[11px] text-[#736A62]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
