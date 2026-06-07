import { useState } from 'react';
import { Search, Eye, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardHeader from '../../components/admin/DashboardHeader';

const mockCompliance = [
  { id: 1, name: 'Peter van Aswegen', email: 'peter@email.com', phone: '082 100 2000', address: '15 Fern Close, Constantia', certs: 'Electrical, Gas', date: '2024-05-20', status: 'Pending' },
  { id: 2, name: 'Zanele Moyo', email: 'zanele@email.com', phone: '076 200 3000', address: '8 Linden Rd, Houghton', certs: 'Electrical, Plumbing', date: '2024-05-18', status: 'In Progress' },
  { id: 3, name: 'Riaan Pieterse', email: 'riaan@email.com', phone: '083 300 4000', address: '22 Panorama Dr, Somerset West', certs: 'All Certificates', date: '2024-05-15', status: 'Completed' },
];

const mockLegal = [
  { id: 1, name: 'Claire Rousseau', email: 'claire@email.com', phone: '083 400 5000', service: 'Conveyancing', property: 'Bishopscourt Manor', date: '2024-05-20', status: 'Active' },
  { id: 2, name: 'Andrew Bolton', email: 'andrew@email.com', phone: '071 500 6000', service: 'Contract Review', property: 'Hyde Park Estate', date: '2024-05-18', status: 'Completed' },
];

const mockOffers = [
  { id: 1, buyer: 'Jonathan Hayes', property: 'Clifton Residence', amount: 'R 17,800,000', date: '2024-05-20', status: 'Pending Seller Response' },
  { id: 2, buyer: 'Sipho Dlamini', property: 'Sandton Penthouse', amount: 'R 12,200,000', date: '2024-05-18', status: 'Accepted' },
  { id: 3, buyer: 'Claire Rousseau', property: 'Bishopscourt Manor', amount: 'R 26,500,000', date: '2024-05-17', status: 'Rejected' },
  { id: 4, buyer: 'Andrew Bolton', property: 'Hyde Park Estate', amount: 'R 21,000,000', date: '2024-05-15', status: 'Under Negotiation' },
];

const statusColors = {
  Pending: 'bg-yellow-50 text-yellow-700',
  'In Progress': 'bg-blue-50 text-blue-700',
  Completed: 'bg-green-50 text-green-700',
  Active: 'bg-blue-50 text-blue-700',
  Accepted: 'bg-green-50 text-green-700',
  Rejected: 'bg-red-50 text-red-700',
  'Pending Seller Response': 'bg-yellow-50 text-yellow-700',
  'Under Negotiation': 'bg-orange-50 text-orange-700',
};

function DataTable({ rows, columns, title }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(15,27,61,0.06)' }}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-100">
            <tr>
              {columns.map(c => (
                <th key={c.key} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{c.label}</th>
              ))}
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {columns.map(c => (
                  <td key={c.key} className="px-5 py-4 text-sm">
                    {c.type === 'status' ? (
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[row[c.key]] || 'bg-gray-100 text-gray-600'}`}>{row[c.key]}</span>
                    ) : (
                      <span className={c.primary ? 'font-medium text-navy-900' : 'text-gray-600'}>{row[c.key]}</span>
                    )}
                  </td>
                ))}
                <td className="px-5 py-4">
                  <button className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                    <Eye size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminCompliance() {
  return (
    <div>
      <DashboardHeader title="Compliance Requests" />
      <div className="p-6">
        <DataTable
          rows={mockCompliance}
          columns={[
            { key: 'name', label: 'Client', primary: true },
            { key: 'address', label: 'Property Address' },
            { key: 'certs', label: 'Certificates' },
            { key: 'date', label: 'Date' },
            { key: 'status', label: 'Status', type: 'status' },
          ]}
        />
      </div>
    </div>
  );
}

export function AdminLegal() {
  return (
    <div>
      <DashboardHeader title="Legal Requests" />
      <div className="p-6">
        <DataTable
          rows={mockLegal}
          columns={[
            { key: 'name', label: 'Client', primary: true },
            { key: 'service', label: 'Service' },
            { key: 'property', label: 'Property' },
            { key: 'date', label: 'Date' },
            { key: 'status', label: 'Status', type: 'status' },
          ]}
        />
      </div>
    </div>
  );
}

export function AdminOffers() {
  return (
    <div>
      <DashboardHeader title="Offers Management" />
      <div className="p-6">
        <DataTable
          rows={mockOffers}
          columns={[
            { key: 'buyer', label: 'Buyer', primary: true },
            { key: 'property', label: 'Property' },
            { key: 'amount', label: 'Offer Amount' },
            { key: 'date', label: 'Date' },
            { key: 'status', label: 'Status', type: 'status' },
          ]}
        />
      </div>
    </div>
  );
}
