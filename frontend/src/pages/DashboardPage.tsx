import React from 'react';
import { BarChart3, TrendingUp, Users, Clock, Activity, ArrowUp, ArrowDown } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 mb-1">Total Videos</p>
              <h3 className="text-2xl font-bold text-white">24</h3>
            </div>
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="text-purple-500" size={20} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUp className="text-green-500 mr-1" size={16} />
            <span className="text-green-500 mr-2">12%</span>
            <span className="text-gray-400">vs last month</span>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 mb-1">Avg. Engagement</p>
              <h3 className="text-2xl font-bold text-white">68%</h3>
            </div>
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-blue-500" size={20} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUp className="text-green-500 mr-1" size={16} />
            <span className="text-green-500 mr-2">8%</span>
            <span className="text-gray-400">vs last month</span>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700 hover:border-green-500 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 mb-1">Products</p>
              <h3 className="text-2xl font-bold text-white">12</h3>
            </div>
            <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
              <Users className="text-green-500" size={20} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUp className="text-green-500 mr-1" size={16} />
            <span className="text-green-500 mr-2">24%</span>
            <span className="text-gray-400">vs last month</span>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700 hover:border-pink-500 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 mb-1">Avg. Duration</p>
              <h3 className="text-2xl font-bold text-white">2:45</h3>
            </div>
            <div className="w-10 h-10 bg-pink-600/20 rounded-lg flex items-center justify-center">
              <Clock className="text-pink-500" size={20} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowDown className="text-red-500 mr-1" size={16} />
            <span className="text-red-500 mr-2">3%</span>
            <span className="text-gray-400">vs last month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Activity className="mr-2" size={20} />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">Summer Collection Video #{item}</h3>
                  <span className="text-sm text-gray-400">2 hours ago</span>
                </div>
                <p className="text-gray-400 text-sm">Analysis completed with 89% positive sentiment</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <TrendingUp className="mr-2" size={20} />
            Performance Overview
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Engagement Rate', value: '68%', color: 'bg-purple-500' },
              { label: 'Average View Time', value: '2:45', color: 'bg-blue-500' },
              { label: 'Completion Rate', value: '76%', color: 'bg-green-500' },
            ].map((stat, index) => (
              <div key={index} className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-400">{stat.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-white">{stat.value}</span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                  <div
                    style={{ width: stat.value }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${stat.color} transition-all duration-500`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}