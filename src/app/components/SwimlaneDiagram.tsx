import React, { useRef } from 'react';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function SwimlaneDiagram() {
  const diagramRef = useRef<HTMLDivElement>(null);

  const exportAsSVG = () => {
    const svgElement = diagramRef.current?.querySelector('svg');
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'repair-ticket-workflow-swimlane-diagram.svg';
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAsPDF = async () => {
    if (!diagramRef.current) return;
    
    try {
      const canvas = await html2canvas(diagramRef.current, {
        scale: 2,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const width = imgWidth * ratio;
      const height = imgHeight * ratio;
      
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save('repair-ticket-workflow-swimlane-diagram.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 mb-2">Repair Ticket Workflow</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportAsSVG}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export SVG
            </button>
            <button
              onClick={exportAsPDF}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Diagram */}
        <div ref={diagramRef} className="bg-white rounded-lg shadow-xl p-8">
          <svg width="1400" height="2200" viewBox="0 0 1400 2200" className="w-full h-auto">
            <defs>
              {/* Arrow marker */}
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#374151" />
              </marker>
              
              {/* Dashed arrow marker */}
              <marker
                id="arrowhead-dashed"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#ef4444" />
              </marker>
            </defs>

            {/* Background */}
            <rect x="0" y="0" width="1400" height="2200" fill="#ffffff" />

            {/* Swimlane Headers */}
            <rect x="0" y="0" width="467" height="60" fill="#3b82f6" stroke="#1e40af" strokeWidth="2" />
            <rect x="467" y="0" width="466" height="60" fill="#10b981" stroke="#059669" strokeWidth="2" />
            <rect x="933" y="0" width="467" height="60" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="2" />

            <text x="233" y="40" fontSize="22" fontWeight="bold" fill="#ffffff" textAnchor="middle">User</text>
            <text x="700" y="40" fontSize="22" fontWeight="bold" fill="#ffffff" textAnchor="middle">IT Staff</text>
            <text x="1167" y="40" fontSize="22" fontWeight="bold" fill="#ffffff" textAnchor="middle">System</text>

            {/* Vertical separator lines */}
            <line x1="467" y1="60" x2="467" y2="2200" stroke="#d1d5db" strokeWidth="2" />
            <line x1="933" y1="60" x2="933" y2="2200" stroke="#d1d5db" strokeWidth="2" />

            {/* USER LANE */}
            {/* Start node */}
            <circle cx="233" cy="120" r="20" fill="#1f2937" stroke="#000000" strokeWidth="2" />
            <line x1="233" y1="140" x2="233" y2="180" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Report Problem */}
            <rect x="133" y="180" width="200" height="80" rx="10" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
            <text x="233" y="215" fontSize="14" fill="#1e40af" textAnchor="middle" fontWeight="600">Report problem to IT</text>
            <text x="233" y="235" fontSize="12" fill="#64748b" textAnchor="middle" fontStyle="italic">(offline communication)</text>
            
            {/* Arrow to IT Staff */}
            <line x1="233" y1="260" x2="233" y2="290" stroke="#374151" strokeWidth="2" />
            <line x1="233" y1="290" x2="467" y2="290" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Verify Equipment (lower position) */}
            <line x1="233" y1="1600" x2="233" y2="1640" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <rect x="133" y="1640" width="200" height="80" rx="10" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
            <text x="233" y="1670" fontSize="14" fill="#1e40af" textAnchor="middle" fontWeight="600">Verify repaired</text>
            <text x="233" y="1690" fontSize="14" fill="#1e40af" textAnchor="middle" fontWeight="600">equipment</text>
            <line x1="233" y1="1720" x2="233" y2="1760" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Decision: Satisfied? */}
            <g transform="translate(233, 1810)">
              <polygon points="0,-50 50,0 0,50 -50,0" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
              <text x="0" y="-10" fontSize="13" fill="#92400e" textAnchor="middle" fontWeight="600">User</text>
              <text x="0" y="10" fontSize="13" fill="#92400e" textAnchor="middle" fontWeight="600">satisfied?</text>
            </g>

            {/* [Yes] path to IT Staff */}
            <text x="350" y="1815" fontSize="12" fill="#059669" fontWeight="bold">[Yes]</text>
            <line x1="283" y1="1810" x2="467" y2="1810" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* [No] path - loop back */}
            <text x="160" y="1870" fontSize="12" fill="#dc2626" fontWeight="bold">[No]</text>
            <line x1="233" y1="1860" x2="233" y2="1920" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
            <line x1="233" y1="1920" x2="80" y2="1920" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
            <line x1="80" y1="1920" x2="80" y2="780" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
            <line x1="80" y1="780" x2="467" y2="780" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead-dashed)" />
            <text x="85" y="1350" fontSize="12" fill="#dc2626" fontWeight="bold" transform="rotate(-90, 85, 1350)">Re-repair required</text>

            {/* IT STAFF LANE */}
            {/* Receive problem */}
            <rect x="567" y="250" width="266" height="80" rx="10" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
            <text x="700" y="285" fontSize="14" fill="#065f46" textAnchor="middle" fontWeight="600">Receive problem report</text>
            <line x1="700" y1="330" x2="700" y2="370" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Screen and evaluate */}
            <rect x="567" y="370" width="266" height="80" rx="10" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
            <text x="700" y="400" fontSize="14" fill="#065f46" textAnchor="middle" fontWeight="600">Screen and evaluate</text>
            <text x="700" y="420" fontSize="14" fill="#065f46" textAnchor="middle" fontWeight="600">the issue</text>
            <line x1="700" y1="450" x2="700" y2="490" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Decision: IT-related? */}
            <g transform="translate(700, 560)">
              <polygon points="0,-60 60,0 0,60 -60,0" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
              <text x="0" y="-5" fontSize="13" fill="#92400e" textAnchor="middle" fontWeight="600">IT-related</text>
              <text x="0" y="15" fontSize="13" fill="#92400e" textAnchor="middle" fontWeight="600">issue?</text>
            </g>

            {/* [No] path */}
            <text x="800" y="565" fontSize="12" fill="#dc2626" fontWeight="bold">[No]</text>
            <line x1="760" y1="560" x2="1320" y2="560" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
            <line x1="1320" y1="560" x2="1320" y2="2080" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
            <line x1="1320" y1="2080" x2="1167" y2="2080" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead-dashed)" />
            <text x="1325" y="1000" fontSize="12" fill="#dc2626" fontWeight="bold" transform="rotate(-90, 1325, 1000)">End without ticket</text>

            {/* [Yes] path */}
            <text x="705" y="640" fontSize="12" fill="#059669" fontWeight="bold">[Yes]</text>
            <line x1="700" y1="620" x2="700" y2="660" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Create ticket */}
            <rect x="567" y="660" width="266" height="80" rx="10" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
            <text x="700" y="690" fontSize="14" fill="#065f46" textAnchor="middle" fontWeight="600">Create ticket</text>
            <text x="700" y="710" fontSize="14" fill="#065f46" textAnchor="middle" fontWeight="600">in system</text>
            
            {/* Arrow to System */}
            <line x1="700" y1="740" x2="700" y2="770" stroke="#374151" strokeWidth="2" />
            <line x1="700" y1="770" x2="933" y2="770" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Continue from System (back to IT Staff) */}
            <line x1="700" y1="930" x2="700" y2="970" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Evaluate priority */}
            <rect x="567" y="970" width="266" height="80" rx="10" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
            <text x="700" y="1000" fontSize="14" fill="#065f46" textAnchor="middle" fontWeight="600">Evaluate priority</text>
            <text x="700" y="1020" fontSize="14" fill="#065f46" textAnchor="middle" fontWeight="600">and repair type</text>
            <line x1="700" y1="1050" x2="700" y2="1090" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Assign technician */}
            <rect x="567" y="1090" width="266" height="80" rx="10" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
            <text x="700" y="1125" fontSize="14" fill="#065f46" textAnchor="middle" fontWeight="600">Assign technician</text>
            <line x1="700" y1="1170" x2="700" y2="1210" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Diagnose problem (re-repair returns here) */}
            <rect x="567" y="1210" width="266" height="80" rx="10" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
            <text x="700" y="1245" fontSize="14" fill="#065f46" textAnchor="middle" fontWeight="600">Diagnose the problem</text>
            <line x1="700" y1="1290" x2="700" y2="1330" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Waiting node */}
            <ellipse cx="700" cy="1390" rx="133" ry="40" fill="#fef9c3" stroke="#ca8a04" strokeWidth="2" />
            <circle cx="670" cy="1390" r="5" fill="#ca8a04">
              <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
            </circle>
            <text x="700" y="1385" fontSize="13" fill="#713f12" textAnchor="middle" fontWeight="600">Waiting for parts /</text>
            <text x="700" y="1405" fontSize="13" fill="#713f12" textAnchor="middle" fontWeight="600">user / vendor</text>
            <line x1="700" y1="1430" x2="700" y2="1470" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Perform repair */}
            <rect x="567" y="1470" width="266" height="80" rx="10" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
            <text x="700" y="1505" fontSize="14" fill="#065f46" textAnchor="middle" fontWeight="600">Perform repair</text>
            
            {/* Arrow to System */}
            <line x1="700" y1="1550" x2="700" y2="1580" stroke="#374151" strokeWidth="2" />
            <line x1="700" y1="1580" x2="933" y2="1580" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Continue from System */}
            <line x1="700" y1="1740" x2="700" y2="1780" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Confirm repair */}
            <rect x="567" y="1780" width="266" height="60" rx="10" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
            <text x="700" y="1815" fontSize="14" fill="#065f46" textAnchor="middle" fontWeight="600">Confirm repair completion</text>
            <line x1="700" y1="1840" x2="700" y2="1880" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Return equipment */}
            <rect x="567" y="1880" width="266" height="80" rx="10" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
            <text x="700" y="1910" fontSize="14" fill="#065f46" textAnchor="middle" fontWeight="600">Return equipment to user</text>
            <text x="700" y="1930" fontSize="12" fill="#6b7280" textAnchor="middle" fontStyle="italic">(if applicable)</text>
            
            {/* Arrow to User */}
            <line x1="700" y1="1960" x2="700" y2="1990" stroke="#374151" strokeWidth="2" />
            <line x1="700" y1="1990" x2="467" y2="1990" stroke="#374151" strokeWidth="2" />
            <line x1="467" y1="1990" x2="467" y2="1600" stroke="#374151" strokeWidth="2" />
            <line x1="467" y1="1600" x2="333" y2="1600" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Close ticket (from User approval) */}
            <rect x="567" y="2000" width="266" height="60" rx="10" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
            <text x="700" y="2035" fontSize="14" fill="#065f46" textAnchor="middle" fontWeight="600">Close the ticket</text>
            
            {/* Arrow to System */}
            <line x1="700" y1="2060" x2="700" y2="2090" stroke="#374151" strokeWidth="2" />
            <line x1="700" y1="2090" x2="933" y2="2090" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* SYSTEM LANE */}
            {/* Generate ticket ID */}
            <rect x="1033" y="730" width="266" height="80" rx="10" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" />
            <text x="1167" y="765" fontSize="14" fill="#5b21b6" textAnchor="middle" fontWeight="600">Generate ticket ID</text>
            <line x1="1167" y1="810" x2="1167" y2="850" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Store ticket data */}
            <rect x="1033" y="850" width="266" height="80" rx="10" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" />
            <text x="1167" y="885" fontSize="14" fill="#5b21b6" textAnchor="middle" fontWeight="600">Store ticket data</text>
            
            {/* Arrow back to IT Staff */}
            <line x1="1167" y1="930" x2="1167" y2="960" stroke="#374151" strokeWidth="2" />
            <line x1="1167" y1="960" x2="933" y2="960" stroke="#374151" strokeWidth="2" />
            <line x1="933" y1="960" x2="933" y2="930" stroke="#374151" strokeWidth="2" />
            <line x1="933" y1="930" x2="833" y2="930" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Update ticket information */}
            <rect x="1033" y="1540" width="266" height="80" rx="10" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" />
            <text x="1167" y="1570" fontSize="14" fill="#5b21b6" textAnchor="middle" fontWeight="600">Update ticket</text>
            <text x="1167" y="1590" fontSize="14" fill="#5b21b6" textAnchor="middle" fontWeight="600">information</text>
            <line x1="1167" y1="1620" x2="1167" y2="1660" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Log repair activities */}
            <rect x="1033" y="1660" width="266" height="80" rx="10" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" />
            <text x="1167" y="1695" fontSize="14" fill="#5b21b6" textAnchor="middle" fontWeight="600">Log repair activities</text>
            
            {/* Arrow back to IT Staff */}
            <line x1="1167" y1="1740" x2="1167" y2="1770" stroke="#374151" strokeWidth="2" />
            <line x1="1167" y1="1770" x2="933" y2="1770" stroke="#374151" strokeWidth="2" />
            <line x1="933" y1="1770" x2="933" y2="1740" stroke="#374151" strokeWidth="2" />
            <line x1="933" y1="1740" x2="833" y2="1740" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Lock ticket data */}
            <rect x="1033" y="2050" width="266" height="80" rx="10" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" />
            <text x="1167" y="2080" fontSize="14" fill="#5b21b6" textAnchor="middle" fontWeight="600">Lock ticket data</text>
            <text x="1167" y="2100" fontSize="14" fill="#5b21b6" textAnchor="middle" fontWeight="600">after closure</text>
            <line x1="1167" y1="2130" x2="1167" y2="2170" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* End node */}
            <circle cx="1167" cy="2190" r="20" fill="#1f2937" stroke="#000000" strokeWidth="3" />
            <circle cx="1167" cy="2190" r="12" fill="#ffffff" />

            {/* Border */}
            <rect x="0" y="0" width="1400" height="2200" fill="none" stroke="#374151" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}
