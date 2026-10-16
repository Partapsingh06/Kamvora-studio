import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar, ShieldCheck } from 'lucide-react';
import api from '../../utils/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const AdminCustomers = () => {
  const { addToast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data } = await api.get('/auth/admin/users');
        if (data.success) {
          setCustomers(data.data || []);
        }
      } catch (err) {
        addToast(err.message || 'Failed to fetch customer list', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#C26D53]">
          Community & Patrons
        </span>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#24211E]">
          Customer Accounts ({customers.length})
        </h1>
      </div>

      <div className="bg-white rounded-3xl border border-[#EDE5D8] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6EE] text-[#736A62] uppercase tracking-wider font-bold border-b border-[#EDE5D8]">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Account Type</th>
                <th className="p-4">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE3]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-[#8C8276]">
                    Loading customer accounts...
                  </td>
                </tr>
              ) : customers.length > 0 ? (
                customers.map((c) => (
                  <tr key={c._id} className="hover:bg-[#FAF6EE]/50 transition-colors">
                    <td className="p-4 font-bold text-[#24211E] flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#FAF5ED] text-[#C26D53] border border-[#E5DAC8] flex items-center justify-center font-bold text-xs uppercase">
                        {c.name.charAt(0)}
                      </div>
                      <span>{c.name}</span>
                    </td>
                    <td className="p-4 text-[#665E56]">{c.email}</td>
                    <td className="p-4 text-[#665E56]">{c.phone || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.role === 'admin'
                          ? 'bg-[#FAF0DC] text-[#875B1F]'
                          : 'bg-emerald-50 text-emerald-800'
                      }`}>
                        {c.role === 'admin' ? 'Administrator' : 'Customer'}
                      </span>
                    </td>
                    <td className="p-4 text-[#8C8276]">
                      {new Date(c.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-[#8C8276]">
                    No customer accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
