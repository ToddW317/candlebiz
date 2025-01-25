'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faFilter,
  faEye,
  faCircle
} from '@fortawesome/free-solid-svg-icons';

// Temporary mock data
const orders = [
  {
    id: 'ORD-001',
    customer: 'Sarah Johnson',
    date: '2024-02-20',
    total: 74.97,
    items: 3,
    status: 'Processing',
    email: 'sarah.j@example.com'
  },
  {
    id: 'ORD-002',
    customer: 'Mike Williams',
    date: '2024-02-19',
    total: 49.99,
    items: 1,
    status: 'Shipped',
    email: 'mike.w@example.com'
  },
  {
    id: 'ORD-003',
    customer: 'Emma Davis',
    date: '2024-02-19',
    total: 129.97,
    items: 4,
    status: 'Delivered',
    email: 'emma.d@example.com'
  },
  {
    id: 'ORD-004',
    customer: 'John Smith',
    date: '2024-02-18',
    total: 24.99,
    items: 1,
    status: 'Cancelled',
    email: 'john.s@example.com'
  },
];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'text-info bg-info/10';
      case 'shipped':
        return 'text-warning bg-warning/10';
      case 'delivered':
        return 'text-success bg-success/10';
      case 'cancelled':
        return 'text-error bg-error/10';
      default:
        return 'text-skin-secondary bg-skin-primary';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'text-info';
      case 'shipped':
        return 'text-warning';
      case 'delivered':
        return 'text-success';
      case 'cancelled':
        return 'text-error';
      default:
        return 'text-skin-secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-skin-primary font-cormorant">
          Orders
        </h1>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-skin-primary text-skin-primary rounded-lg hover:bg-skin-primary transition-colors">
            Export Orders
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-skin-muted"
          />
          <input
            type="text"
            placeholder="Search orders by ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-skin-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-skin-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark bg-white"
            >
              <option value="all">All Status</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <FontAwesomeIcon 
              icon={faFilter} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-skin-muted pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-skin-primary">
            <thead>
              <tr className="bg-skin-primary">
                <th className="px-6 py-4 text-left text-sm font-semibold text-skin-primary">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-skin-primary">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-skin-primary">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-skin-primary">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-skin-primary">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-skin-primary">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-skin-primary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-skin-primary">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-skin-primary/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-skin-primary">
                    {order.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-skin-primary">{order.customer}</div>
                    <div className="text-xs text-skin-muted">{order.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-skin-secondary">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-skin-primary font-medium">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-skin-secondary">
                    {order.items}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon 
                        icon={faCircle} 
                        className={`h-2 w-2 ${getStatusDot(order.status)}`} 
                      />
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary-dark hover:text-interactive-hover transition-colors">
                      <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 