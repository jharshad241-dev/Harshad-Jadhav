import React from 'react';
import { IconRenderer } from './IconRenderer';

interface PrintInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerPrint: () => void;
}

export const PrintInstructionsModal: React.FC<PrintInstructionsModalProps> = ({
  isOpen,
  onClose,
  onTriggerPrint,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 relative animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <IconRenderer name="Printer" className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Perfect A4 Printing Tips</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <IconRenderer name="X" className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-700 font-medium">
          <p className="leading-relaxed">
            For best results when saving as PDF or printing on standard A4 paper:
          </p>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
              <span className="font-extrabold text-amber-800 text-sm">1.</span>
              <div>
                <span className="font-bold text-amber-900 block">Enable "Background Graphics"</span>
                <span className="text-amber-800 text-[11px]">
                  In the print preview popup, check <strong>"Background graphics"</strong> (under More settings) so colors, badges, and cartoon illustrations appear brightly.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-start gap-2.5">
              <span className="font-extrabold text-sky-800 text-sm">2.</span>
              <div>
                <span className="font-bold text-sky-900 block">Set Paper Size to A4</span>
                <span className="text-sky-800 text-[11px]">
                  Select <strong>Paper size: A4</strong> (210 x 297 mm) and <strong>Orientation: Portrait</strong>.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
              <span className="font-extrabold text-emerald-800 text-sm">3.</span>
              <div>
                <span className="font-bold text-emerald-900 block">Set Margins to "None" or "Default"</span>
                <span className="text-emerald-800 text-[11px]">
                  Set margins to <strong>None</strong> or <strong>Minimum</strong> for full edge-to-edge frame fitting.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-4 flex items-center justify-end gap-2 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer text-xs"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onTriggerPrint();
            }}
            className="px-5 py-2 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white text-xs shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <IconRenderer name="Printer" className="w-4 h-4" />
            <span>Proceed to Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
