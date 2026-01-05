import React from 'react';
import { ArrowDown, GitBranch } from 'lucide-react';

interface StatusNode {
  id: string;
  label: string;
  color: string;
  bgColor: string;
}

const statuses: StatusNode[] = [
  { id: 'open', label: 'Open', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  { id: 'acknowledged', label: 'Acknowledged / Response', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  { id: 'in-progress', label: 'In Progress', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  { id: 'pending', label: 'Pending', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  { id: 'resolved', label: 'Resolved', color: 'text-green-700', bgColor: 'bg-green-100' },
  { id: 'closed', label: 'Closed', color: 'text-gray-700', bgColor: 'bg-gray-100' },
];

export default function WorkflowDiagram() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <div className="mb-8 text-center">
          <h1 className="text-slate-800 mb-2">Workflow Status Diagram</h1>
          <p className="text-slate-600">Track the lifecycle of tickets and issues</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-12 border border-slate-200">
          {/* Open */}
          <div className="flex flex-col items-center">
            <StatusCard status={statuses[0]} />
            <Arrow />
            
            {/* Acknowledged / Response */}
            <StatusCard status={statuses[1]} />
            <Arrow />
            
            {/* In Progress */}
            <StatusCard status={statuses[2]} />
            
            {/* Split Arrow */}
            <div className="my-6 relative w-full max-w-md">
              <svg width="100%" height="120" className="overflow-visible">
                {/* Center vertical line */}
                <line x1="50%" y1="0" x2="50%" y2="40" stroke="#cbd5e1" strokeWidth="2" />
                
                {/* Branch indicator */}
                <circle cx="50%" cy="40" r="8" fill="#94a3b8" />
                <GitBranch className="absolute top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white" />
                
                {/* Left branch to Pending */}
                <path 
                  d="M 50% 40 Q 50% 60, 25% 80 L 25% 120" 
                  stroke="#cbd5e1" 
                  strokeWidth="2" 
                  fill="none"
                />
                
                {/* Right branch to Resolved */}
                <path 
                  d="M 50% 40 Q 50% 60, 75% 80 L 75% 120" 
                  stroke="#cbd5e1" 
                  strokeWidth="2" 
                  fill="none"
                />
              </svg>
            </div>
            
            {/* Pending and Resolved side by side */}
            <div className="flex gap-8 mb-6 w-full max-w-2xl justify-center">
              <div className="flex-1 flex flex-col items-center">
                <StatusCard status={statuses[3]} />
              </div>
              <div className="flex-1 flex flex-col items-center">
                <StatusCard status={statuses[4]} />
              </div>
            </div>
            
            {/* Merge arrows */}
            <div className="mb-6 relative w-full max-w-md">
              <svg width="100%" height="80" className="overflow-visible">
                {/* Left line from Pending */}
                <line x1="25%" y1="0" x2="25%" y2="40" stroke="#cbd5e1" strokeWidth="2" />
                
                {/* Right line from Resolved */}
                <line x1="75%" y1="0" x2="75%" y2="40" stroke="#cbd5e1" strokeWidth="2" />
                
                {/* Merge to center */}
                <path 
                  d="M 25% 40 Q 25% 60, 50% 80" 
                  stroke="#cbd5e1" 
                  strokeWidth="2" 
                  fill="none"
                />
                <path 
                  d="M 75% 40 Q 75% 60, 50% 80" 
                  stroke="#cbd5e1" 
                  strokeWidth="2" 
                  fill="none"
                />
                
                {/* Center dot at merge point */}
                <circle cx="50%" cy="80" r="8" fill="#94a3b8" />
              </svg>
            </div>
            
            {/* Closed */}
            <StatusCard status={statuses[5]} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ status }: { status: StatusNode }) {
  return (
    <div className={`${status.bgColor} ${status.color} px-8 py-4 rounded-xl border-2 border-current shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-default min-w-[200px] text-center`}>
      <span className="font-medium">{status.label}</span>
    </div>
  );
}

function Arrow() {
  return (
    <div className="my-6 text-slate-400">
      <ArrowDown className="w-6 h-6" />
    </div>
  );
}
