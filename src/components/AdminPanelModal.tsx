import React, { useState, useEffect } from 'react';
import { IconRenderer } from './IconRenderer';
import { SALON_SERVICES_DATA } from '../data/saloonData';
import { OwnerPaymentSettings, CustomCharge } from '../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentSettings: OwnerPaymentSettings;
  onUpdatePaymentSettings: (updated: OwnerPaymentSettings) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  paymentSettings,
  onUpdatePaymentSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'payment_qr' | 'notifications'>('overview');
  const [servicesList, setServicesList] = useState(SALON_SERVICES_DATA);

  // Local state for Vaibhav's Payment & QR Settings
  const [ownerName, setOwnerName] = useState(paymentSettings.ownerName);
  const [upiId, setUpiId] = useState(paymentSettings.upiId);
  const [qrCodeUrl, setQrCodeUrl] = useState(paymentSettings.qrCodeUrl);
  const [bankName, setBankName] = useState(paymentSettings.bankName);
  const [accountNumber, setAccountNumber] = useState(paymentSettings.accountNumber);
  const [ifscCode, setIfscCode] = useState(paymentSettings.ifscCode);
  const [gstTaxRate, setGstTaxRate] = useState(paymentSettings.gstTaxRate);
  const [serviceFee, setServiceFee] = useState(paymentSettings.serviceFee);
  const [customCharges, setCustomCharges] = useState<CustomCharge[]>(paymentSettings.customCharges || []);

  // Form for adding a new custom charge
  const [newChargeName, setNewChargeName] = useState('');
  const [newChargeAmount, setNewChargeAmount] = useState<number>(20);

  // Push notifications state
  const [pushTitle, setPushTitle] = useState('');
  const [pushBody, setPushBody] = useState('');
  const [pushSent, setPushSent] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  useEffect(() => {
    setOwnerName(paymentSettings.ownerName);
    setUpiId(paymentSettings.upiId);
    setQrCodeUrl(paymentSettings.qrCodeUrl);
    setBankName(paymentSettings.bankName);
    setAccountNumber(paymentSettings.accountNumber);
    setIfscCode(paymentSettings.ifscCode);
    setGstTaxRate(paymentSettings.gstTaxRate);
    setServiceFee(paymentSettings.serviceFee);
    setCustomCharges(paymentSettings.customCharges || []);
  }, [paymentSettings]);

  if (!isOpen) return null;

  const handlePriceChange = (id: string, newPrice: number) => {
    setServicesList(
      servicesList.map((s) => (s.id === id ? { ...s, price: newPrice } : s))
    );
  };

  const handleGenerateUpiQr = () => {
    if (!upiId) return;
    const generatedUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${encodeURIComponent(
      upiId
    )}&pn=${encodeURIComponent(ownerName)}&cu=INR`;
    setQrCodeUrl(generatedUrl);
  };

  const handleAddCustomCharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChargeName) return;
    const created: CustomCharge = {
      id: `ch-${Date.now()}`,
      name: newChargeName,
      amount: newChargeAmount,
      type: 'fixed',
      enabled: true,
    };
    setCustomCharges([...customCharges, created]);
    setNewChargeName('');
    setNewChargeAmount(20);
  };

  const handleToggleCharge = (id: string) => {
    setCustomCharges(
      customCharges.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const handleDeleteCharge = (id: string) => {
    setCustomCharges(customCharges.filter((c) => c.id !== id));
  };

  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedSettings: OwnerPaymentSettings = {
      ownerName,
      upiId,
      qrCodeUrl,
      bankName,
      accountNumber,
      ifscCode,
      gstTaxRate,
      serviceFee,
      qrType: 'upi',
      customCharges,
    };

    try {
      await fetch('/api/payment-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });
    } catch (err) {
      console.error('Failed to save payment settings on server:', err);
    }

    onUpdatePaymentSettings(updatedSettings);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const handleSendPush = (e: React.FormEvent) => {
    e.preventDefault();
    setPushSent(true);
    setTimeout(() => {
      setPushSent(false);
      setPushTitle('');
      setPushBody('');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-neutral-900 border-2 border-amber-500/40 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative text-white my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <IconRenderer name="Settings" className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold font-serif text-white">
                Vaibhav Salon Owner Admin Dashboard
              </h2>
              <p className="text-[10px] text-amber-400 font-mono">
                Management Console • Owner: {ownerName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer"
          >
            <IconRenderer name="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher Bar */}
        <div className="flex border-b border-neutral-800 bg-neutral-950 px-4 gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Metrics', icon: 'BarChart' },
            { id: 'services', label: 'Service Prices', icon: 'Scissors' },
            { id: 'payment_qr', label: 'Payment QR & Charges', icon: 'QrCode' },
            { id: 'notifications', label: 'Push Broadcast', icon: 'Bell' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? 'border-amber-400 text-amber-400 bg-neutral-900/50'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <IconRenderer name={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-neutral-950 border border-amber-500/30">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">TOTAL REVENUE</span>
                  <span className="text-2xl font-black text-amber-400 font-mono">₹1,18,400</span>
                  <span className="text-[10px] text-emerald-400 block">↑ +18% this month</span>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950 border border-amber-500/30">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">BOOKINGS TODAY</span>
                  <span className="text-2xl font-black text-white font-mono">18 Clients</span>
                  <span className="text-[10px] text-emerald-400 block">4 Slots Available</span>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950 border border-amber-500/30">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">AI SCANS RUN</span>
                  <span className="text-2xl font-black text-amber-400 font-mono">320 Scans</span>
                  <span className="text-[10px] text-emerald-400 block">98% Match Accuracy</span>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950 border border-amber-500/30">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">VIP MEMBERS</span>
                  <span className="text-2xl font-black text-white font-mono">485 Users</span>
                  <span className="text-[10px] text-amber-400 block">Black Elite Tier</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase text-amber-400 tracking-wider">
                  Today's Live Salon Queue
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Harshad Jadhav • 02:00 PM</span>
                      <span className="text-[11px] text-neutral-400">Vaibhav Signature Royal Haircut + Beard Sculpting</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                      CONFIRMED
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Vikramaditya Roy • 04:30 PM</span>
                      <span className="text-[11px] text-neutral-400">Royal Gold Detox Facial</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">
                      IN PROGRESS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Manage Services */}
          {activeTab === 'services' && (
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase text-amber-400 tracking-wider">
                Manage Salon Service Pricing
              </h3>

              <div className="space-y-2 text-xs">
                {servicesList.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="font-bold text-white">{srv.title}</h4>
                      <span className="text-[10px] text-neutral-400">{srv.category} • ⏱ {srv.durationMins} Mins</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400 font-mono">₹</span>
                      <input
                        type="number"
                        value={srv.price}
                        onChange={(e) => handlePriceChange(srv.id, Number(e.target.value))}
                        className="w-20 bg-neutral-900 border border-neutral-700 rounded-lg p-1.5 text-amber-400 font-bold font-mono outline-none text-right"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Payment QR & Charge Editing (Vaibhav's Side) */}
          {activeTab === 'payment_qr' && (
            <div className="space-y-6 text-xs">
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                  <IconRenderer name="QrCode" className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-amber-300 font-serif">
                    Vaibhav Jadhav's Payment & QR Control Hub
                  </h3>
                  <p className="text-[11px] text-neutral-300 mt-0.5">
                    Manage your QR code scanner, UPI details, taxes, and custom charges shown to customers during online booking.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSavePaymentSettings} className="space-y-6">
                {/* Section A: QR Code & UPI Details */}
                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <IconRenderer name="CreditCard" className="w-4 h-4" />
                    <span>1. Owner UPI & Payment QR Code Settings</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="font-bold text-neutral-300 block mb-1">Salon Owner Name:</label>
                        <input
                          type="text"
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white font-bold outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-neutral-300 block mb-1">
                          UPI ID (Google Pay / PhonePe / Paytm):
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-amber-300 font-mono font-bold outline-none focus:border-amber-400"
                            placeholder="e.g. vaibhav.jadhav@okaxis"
                          />
                          <button
                            type="button"
                            onClick={handleGenerateUpiQr}
                            className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40 cursor-pointer"
                          >
                            Regenerate QR
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-neutral-300 block mb-1">
                          Payment QR Image URL (Custom Upload or Auto-Generated):
                        </label>
                        <input
                          type="text"
                          value={qrCodeUrl}
                          onChange={(e) => setQrCodeUrl(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-neutral-300 font-mono text-[11px] outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {/* QR Code Live Preview */}
                    <div className="bg-neutral-900 p-4 rounded-xl border border-amber-500/30 flex flex-col items-center justify-center text-center space-y-2">
                      <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">
                        Live Scanner Preview
                      </span>
                      <div className="p-2 bg-white rounded-2xl shadow-xl border-2 border-amber-400">
                        <img
                          src={qrCodeUrl}
                          alt="Vaibhav Payment QR Code"
                          className="w-32 h-32 object-contain"
                        />
                      </div>
                      <span className="text-xs font-bold text-amber-400 font-mono">{upiId}</span>
                      <span className="text-[10px] text-neutral-400">Payee: {ownerName}</span>
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-neutral-800">
                    <div>
                      <label className="font-bold text-neutral-400 block mb-1 text-[11px]">Bank Name:</label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2 text-white font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-neutral-400 block mb-1 text-[11px]">Account Number:</label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2 text-amber-300 font-mono font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-neutral-400 block mb-1 text-[11px]">IFSC Code:</label>
                      <input
                        type="text"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2 text-white font-mono font-bold outline-none uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* Section B: Base Charges, GST & Convenience Fees */}
                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <IconRenderer name="DollarSign" className="w-4 h-4" />
                    <span>2. Edit Taxes, Fees & Base Surcharges</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-neutral-300 block mb-1">
                        GST / Service Tax (%):
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={gstTaxRate}
                          onChange={(e) => setGstTaxRate(Number(e.target.value))}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-amber-400 font-bold font-mono outline-none"
                        />
                        <span className="font-bold text-neutral-400">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-neutral-300 block mb-1">
                        Salon Convenience / Service Fee (₹):
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-400 font-mono">₹</span>
                        <input
                          type="number"
                          value={serviceFee}
                          onChange={(e) => setServiceFee(Number(e.target.value))}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-amber-400 font-bold font-mono outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section C: Custom Surcharges List */}
                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <IconRenderer name="PlusCircle" className="w-4 h-4" />
                    <span>3. Custom Extra Charges (Vaibhav's Side)</span>
                  </h4>

                  <div className="space-y-2">
                    {customCharges.map((charge) => (
                      <div
                        key={charge.id}
                        className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={charge.enabled}
                            onChange={() => handleToggleCharge(charge.id)}
                            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                          />
                          <div>
                            <span className="font-bold text-white block">{charge.name}</span>
                            <span className="text-[10px] text-neutral-400">
                              {charge.enabled ? 'Active Charge' : 'Disabled'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-bold text-amber-400 font-mono text-sm">
                            +₹{charge.amount}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteCharge(charge.id)}
                            className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 cursor-pointer"
                          >
                            <IconRenderer name="Trash2" className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Custom Charge Inline Form */}
                  <div className="pt-3 border-t border-neutral-800 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Charge Title (e.g. Sanitization Kit Fee)"
                      value={newChargeName}
                      onChange={(e) => setNewChargeName(e.target.value)}
                      className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl p-2 text-white outline-none"
                    />
                    <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-xl px-2 py-1.5">
                      <span className="text-neutral-400 font-mono">₹</span>
                      <input
                        type="number"
                        value={newChargeAmount}
                        onChange={(e) => setNewChargeAmount(Number(e.target.value))}
                        className="w-16 bg-transparent text-amber-400 font-bold font-mono outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCustomCharge}
                      className="px-3 py-2 rounded-xl bg-amber-500 text-neutral-950 font-extrabold cursor-pointer hover:bg-amber-400 shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-neutral-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-amber-500/25 cursor-pointer hover:brightness-110"
                  >
                    Save Payment & QR Changes
                  </button>

                  {saveSuccessMsg && (
                    <span className="text-emerald-400 font-bold text-xs animate-fadeIn">
                      ✓ Payment settings & QR saved successfully!
                    </span>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: Push Broadcast */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-xs font-extrabold uppercase text-amber-400 tracking-wider">
                Broadcast Push Notification to Mobile App Users
              </h3>

              <form onSubmit={handleSendPush} className="space-y-3">
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Notification Title:</label>
                  <input
                    type="text"
                    required
                    value={pushTitle}
                    onChange={(e) => setPushTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-400"
                    placeholder="e.g. Weekend Flash Sale: 20% Off Keratin Hair Spa!"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Push Message Body:</label>
                  <textarea
                    required
                    rows={3}
                    value={pushBody}
                    onChange={(e) => setPushBody(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-400"
                    placeholder="Book your slot today and get a free beard styling session with Master Vaibhav."
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold cursor-pointer uppercase tracking-wider"
                >
                  Send Push Broadcast Now
                </button>

                {pushSent && (
                  <p className="text-emerald-400 font-bold">
                    ✓ Push notification broadcasted to 1,240 active mobile app users!
                  </p>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
