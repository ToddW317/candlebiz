'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBox, 
  faShoppingCart, 
  faUsers, 
  faTags,
  faArrowUp,
  faArrowDown
} from '@fortawesome/free-solid-svg-icons';

const stats = [
  { 
    name: 'Total Products', 
    value: '24', 
    change: '+4.75%',
    trend: 'up',
    icon: faBox 
  },
  { 
    name: 'Active Orders', 
    value: '12', 
    change: '+10.2%',
    trend: 'up',
    icon: faShoppingCart 
  },
  { 
    name: 'Total Customers', 
    value: '48', 
    change: '+2.5%',
    trend: 'up',
    icon: faUsers 
  },
  { 
    name: 'Categories', 
    value: '8', 
    change: '-0.5%',
    trend: 'down',
    icon: faTags 
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-skin-primary font-cormorant">
          Dashboard Overview
        </h1>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-interactive-hover transition-colors">
            Add Product
          </button>
          <button className="px-4 py-2 bg-white border border-skin-primary text-skin-primary rounded-lg hover:bg-skin-primary transition-colors">
            View Reports
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-primary-light/30">
                <FontAwesomeIcon icon={stat.icon} className="h-6 w-6 text-primary-dark" />
              </div>
              <div className={`flex items-center text-sm ${
                stat.trend === 'up' ? 'text-success' : 'text-error'
              }`}>
                <FontAwesomeIcon 
                  icon={stat.trend === 'up' ? faArrowUp : faArrowDown} 
                  className="h-4 w-4 mr-1"
                />
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-skin-secondary">
                {stat.name}
              </h3>
              <p className="text-3xl font-semibold text-skin-primary">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-skin-primary mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border border-skin-primary rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-primary-light/30">
                  <FontAwesomeIcon icon={faShoppingCart} className="h-5 w-5 text-primary-dark" />
                </div>
                <div>
                  <p className="text-skin-primary font-medium">New order received</p>
                  <p className="text-skin-muted text-sm">Order #1234</p>
                </div>
              </div>
              <span className="text-skin-secondary text-sm">2 hours ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 