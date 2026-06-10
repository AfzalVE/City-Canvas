'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface WorkflowStep {
  step: number;
  label: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  count: number;
}

interface WorkflowDiagramProps {
  steps: WorkflowStep[];
}

export default function WorkflowDiagram({ steps }: WorkflowDiagramProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <h2 className="font-serif text-2xl text-forest-800 mb-8">Content Pipeline Workflow</h2>
      
      <div className="flex items-center gap-0 mb-8">
        {steps.map((step, index) => (
          <div key={step.step} className="flex items-center flex-1">
            {/* Step Circle */}
            <div
              className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 flex-shrink-0 transition-all ${
                step.status === 'completed'
                  ? 'bg-green-100 border-green-600'
                  : step.status === 'in-progress'
                    ? 'bg-blue-100 border-blue-600'
                    : 'bg-gray-100 border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-forest-800">{step.step}</div>
                <div className="text-xs text-gray-600">{step.count}</div>
              </div>
            </div>

            {/* Arrow */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 bg-gray-300 mx-2">
                <div
                  className={`h-full transition-all ${
                    step.status === 'completed' ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                  style={{
                    width:
                      step.status === 'completed'
                        ? '100%'
                        : step.status === 'in-progress'
                          ? '50%'
                          : '0%',
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {steps.map((step) => (
          <div
            key={step.step}
            className={`p-4 rounded-lg border-2 transition-all ${
              step.status === 'completed'
                ? 'border-green-200 bg-green-50'
                : step.status === 'in-progress'
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-2 mb-2">
              {step.status === 'completed' ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : step.status === 'in-progress' ? (
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />
              ) : (
                <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              )}
              <h3 className="font-medium text-forest-800 text-sm">{step.label}</h3>
            </div>
            <p className="text-xs text-gray-600 mb-3">{step.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-forest-800">{step.count} items</span>
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${
                  step.status === 'completed'
                    ? 'bg-green-200 text-green-800'
                    : step.status === 'in-progress'
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-gray-200 text-gray-800'
                }`}
              >
                {step.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
