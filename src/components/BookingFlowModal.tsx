import React, { useState } from 'react';
import { IconRenderer } from './IconRenderer';
import { SALON_SERVICES_DATA, BARBERS_DATA } from '../data/saloonData';
import { BookingAppointment, OwnerPaymentSettings } from '../types';

interface BookingFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedHairstyleName?: string;
  preselectedBeardStyleName?: string;
  paymentSettings: OwnerPaymentSettings;
  onBookingSuccess: (booking: BookingAppointment) => void;
}

export const BookingFlowModal: React.FC<BookingFlowModalProps> = ({
  isOpen,
  onClose,
  preselectedHairstyleName,
  preselectedBeardStyleName,
  paymentSettings,
  onBookingSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selected state
  const [selectedServices, setSelectedServices] = useState<string[]>([
    SALON_SERVICES_DATA[0].id,
  ]);
  const [selectedBarberId, setSelectedBarberId] = useState<string>(BARBERS_DATA[0].id);
  const [selectedDate, setSelectedDate] = useState<string>('Today');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('02:00 PM');
  const [customerName, setCustomerName] = useState<string>('Harshad Jadhav');
  const [customerPhone, setCustomerPhone] = useState<string>('+91 98765 43210');
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI QR (Vaibhav)' | 'Razorpay' | 'Pay at Salon'>('UPI QR (Vaibhav)');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  const [confirmedBooking, setConfirmedBooking] = useState<BookingAppointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  // Calculate prices dynamically based on services + Vaibhav's owner charges
  const baseServicesPrice = selectedServices.reduce((sum, id) => {
    const srv = SALON_SERVICES_DATA.find((s) => s.id === id);
    return sum + (srv ? srv.price : 0);
  }, 0);

  const discountAmount = couponApplied ? Math.round(baseServicesPrice * 0.2) : 0;
  const priceAfterDiscount = Math.max(0, baseServicesPrice - discountAmount);

  // Owner specific charges
  const activeCustomChargesSum = (paymentSettings.customCharges || [])
    .filter((c) => c.enabled)
    .reduce((acc, c) => acc + c.amount, 0);

  const serviceFee = paymentSettings.serviceFee || 0;
  const gstTaxRate = paymentSettings.gstTaxRate || 0;
  const gstAmount = Math.round((priceAfterDiscount * gstTaxRate) / 100);

  const finalPrice = priceAfterDiscount + gstAmount + serviceFee + activeCustomChargesSum;

  // Toggle Service selection
  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== id));
      }
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  // Apply Coupon
  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'VAIBHAVVIP' || couponCode.trim().toUpperCase() === 'GOLD20') {
      setCouponApplied(true);
    } else {
      alert('Invalid coupon code. Try "VAIBHAVVIP" for 20% discount.');
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(paymentSettings.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Submit Appointment to Express API
  const handleConfirmAppointment = async () => {
    setIsSubmitting(true);
    const barberObj = BARBERS_DATA.find((b) => b.id === selectedBarberId);
    const serviceNames = selectedServices.map(
      (id) => SALON_SERVICES_DATA.find((s) => s.id === id)?.title || ''
    );

    const bookingPayload = {
      serviceIds: selectedServices,
      serviceNames,
      hairstyleName: preselectedHairstyleName,
      beardStyleName: preselectedBeardStyleName,
      barberId: selectedBarberId,
      barberName: barberObj ? barberObj.name : 'Vaibhav Sharma',
      date: selectedDate === 'Today' ? new Date().toLocaleDateString() : selectedDate,
      timeSlot: selectedTimeSlot,
      customerName,
      customerPhone,
      customerEmail: 'harshadjadhav1211@gmail.com',
      totalAmount: finalPrice,
      paymentMethod,
      utrNumber: paymentMethod === 'UPI QR (Vaibhav)' ? utrNumber : undefined,
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });

      const data = await res.json();
      if (data && data.booking) {
        setConfirmedBooking(data.booking);
        onBookingSuccess(data.booking);
        setCurrentStep(4);
      }
    } catch (err) {
      console.error('Booking error:', err);
      // Fallback
      const fallbackBooking: BookingAppointment = {
        id: `VBH-${Math.floor(100000 + Math.random() * 900000)}`,
        serviceIds: selectedServices,
        serviceNames,
        hairstyleName: preselectedHairstyleName,
        beardStyleName: preselectedBeardStyleName,
        barberId: selectedBarberId,
        barberName: barberObj ? barberObj.name : 'Vaibhav Sharma',
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        customerName,
        customerPhone,
        customerEmail: 'harshadjadhav1211@gmail.com',
        totalAmount: finalPrice,
        status: 'Confirmed',
        paymentMethod: paymentMethod as any,
        bookingQr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VAIBHAV-SALOON-VIP',
        createdAt: new Date().toISOString(),
      };
      setConfirmedBooking(fallbackBooking);
      onBookingSuccess(fallbackBooking);
      setCurrentStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-neutral-900 border-2 border-amber-500/40 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative text-white my-auto max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
              <IconRenderer name="Calendar" className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold font-serif text-white">
                Vaibhav Salon Appointment Booking
              </h2>
              <p className="text-[10px] text-amber-400 font-mono uppercase tracking-wider">
                Step {currentStep} of 4 • Royal VIP Session
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

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: Select Services */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                1. Select Services
              </h3>

              {preselectedHairstyleName && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2">
                  <IconRenderer name="Scissors" className="w-4 h-4 text-amber-400" />
                  <span>Selected Hairstyle: {preselectedHairstyleName}</span>
                </div>
              )}

              <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
                {SALON_SERVICES_DATA.map((srv) => {
                  const isChecked = selectedServices.includes(srv.id);
                  return (
                    <div
                      key={srv.id}
                      onClick={() => toggleService(srv.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'bg-amber-500/15 border-amber-400'
                          : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={srv.imageUrl}
                          alt={srv.title}
                          className="w-12 h-12 rounded-xl object-cover border border-neutral-800 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-white">{srv.title}</h4>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            ⏱ {srv.durationMins} Mins • {srv.category}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-black text-sm text-amber-400 font-mono block">
                          ₹{srv.price}
                        </span>
                        {srv.originalPrice && (
                          <span className="text-[10px] text-neutral-500 line-through font-mono">
                            ₹{srv.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Choose Barber & Slot */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                2. Choose Master Barber & Time Slot
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {BARBERS_DATA.map((barber) => {
                  const isSelected = selectedBarberId === barber.id;
                  return (
                    <button
                      key={barber.id}
                      onClick={() => setSelectedBarberId(barber.id)}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400'
                          : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <img
                        src={barber.avatarUrl}
                        alt={barber.name}
                        className="w-10 h-10 rounded-xl object-cover border border-amber-400"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">
                          {barber.name}
                        </span>
                        <span className="text-[10px] text-amber-400 font-mono">
                          ★ {barber.rating} ({barber.experienceYears} yrs exp)
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Date Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300 block">Select Date:</label>
                <div className="flex gap-2">
                  {['Today', 'Tomorrow', 'Day After'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedDate === d
                          ? 'bg-amber-500 text-neutral-950 border-amber-400'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300 block">Select Time Slot:</label>
                <div className="grid grid-cols-3 gap-2 text-xs font-bold font-mono">
                  {['10:30 AM', '12:00 PM', '02:00 PM', '04:30 PM', '06:00 PM', '07:30 PM'].map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2 rounded-xl border transition-all cursor-pointer ${
                        selectedTimeSlot === slot
                          ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Payment Gateway */}
          {currentStep === 3 && (
            <div className="space-y-4 text-xs">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                3. Customer Details & Payment Options
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-400 block mb-1">Your Full Name:</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-bold outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-400 block mb-1">Phone Number:</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-bold outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Coupon Code Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Coupon (e.g. VAIBHAVVIP)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white uppercase font-mono text-xs outline-none focus:border-amber-400"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-bold border border-neutral-700 cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {couponApplied && (
                <p className="text-emerald-400 font-bold text-[11px]">
                  ✓ 20% VIP Salon Coupon Applied Successfully!
                </p>
              )}

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="font-bold text-neutral-300 block">Select Payment Mode:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'UPI QR (Vaibhav)', label: 'Scan UPI QR', icon: 'QrCode' },
                    { id: 'Razorpay', label: 'Razorpay / Card', icon: 'CreditCard' },
                    { id: 'Pay at Salon', label: 'Pay at Counter', icon: 'Store' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`py-2 px-2 rounded-xl border font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        paymentMethod === m.id
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <IconRenderer name={m.icon} className="w-4 h-4 text-amber-400" />
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Vaibhav's Active Payment QR Code Display */}
              {paymentMethod === 'UPI QR (Vaibhav)' && (
                <div className="bg-neutral-950 p-4 rounded-2xl border-2 border-amber-400/60 space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-amber-400 font-bold block">
                        Direct Salon Payment
                      </span>
                      <h4 className="font-extrabold text-white text-sm">
                        Pay to: {paymentSettings.ownerName}
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                      INSTANT UPI QR
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="p-2 bg-white rounded-2xl border-2 border-amber-400 shadow-xl shrink-0">
                      <img
                        src={paymentSettings.qrCodeUrl}
                        alt="Vaibhav Payment QR"
                        className="w-32 h-32 object-contain"
                      />
                    </div>

                    <div className="space-y-2 text-xs flex-1">
                      <div>
                        <span className="text-neutral-500 text-[10px] block">UPI ID:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-300 text-sm">
                            {paymentSettings.upiId}
                          </span>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-[10px] font-bold cursor-pointer border border-neutral-700"
                          >
                            {copiedUpi ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-neutral-500 text-[10px] block">Bank Account:</span>
                        <span className="font-mono text-neutral-300 text-[11px]">
                          {paymentSettings.bankName} • {paymentSettings.accountNumber} ({paymentSettings.ifscCode})
                        </span>
                      </div>

                      <div>
                        <label className="text-[10px] text-neutral-400 font-bold block mb-1">
                          Payment UTR / Transaction ID (Optional):
                        </label>
                        <input
                          type="text"
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          placeholder="e.g. 123456789012"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-amber-300 font-mono text-xs outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Itemized Price Breakdown */}
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-amber-500/30 space-y-1.5 font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal Services:</span>
                  <span>₹{baseServicesPrice}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>VIP Coupon Discount (20%):</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                {gstAmount > 0 && (
                  <div className="flex justify-between text-neutral-400">
                    <span>GST / Service Tax ({gstTaxRate}%):</span>
                    <span>+₹{gstAmount}</span>
                  </div>
                )}

                {serviceFee > 0 && (
                  <div className="flex justify-between text-neutral-400">
                    <span>Convenience Fee:</span>
                    <span>+₹{serviceFee}</span>
                  </div>
                )}

                {(paymentSettings.customCharges || [])
                  .filter((c) => c.enabled)
                  .map((charge) => (
                    <div key={charge.id} className="flex justify-between text-amber-300/90 text-[11px]">
                      <span>{charge.name}:</span>
                      <span>+₹{charge.amount}</span>
                    </div>
                  ))}

                <div className="flex justify-between text-white font-extrabold text-sm pt-2 border-t border-neutral-800">
                  <span>Total Payable Amount:</span>
                  <span className="text-amber-400 text-base">₹{finalPrice}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Success Digital Booking Pass */}
          {currentStep === 4 && confirmedBooking && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <IconRenderer name="CheckCircle2" className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-extrabold font-serif text-white">
                Booking Confirmed!
              </h3>
              <p className="text-xs text-neutral-400">
                Your luxury appointment pass has been issued. Show this QR code at Vaibhav AI Saloon reception.
              </p>

              {/* Digital Pass Card */}
              <div className="p-5 rounded-3xl bg-neutral-950 border-2 border-amber-400 shadow-2xl space-y-4 text-left relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-amber-400 block">
                      PASS ID: {confirmedBooking.id}
                    </span>
                    <h4 className="font-extrabold text-white text-sm font-serif">
                      VAIBHAV AI SALOON & SPA
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/40">
                    CONFIRMED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-500 block text-[10px]">Stylist / Barber:</span>
                    <span className="font-bold text-white">{confirmedBooking.barberName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">Date & Time:</span>
                    <span className="font-bold text-amber-300">
                      {confirmedBooking.date} • {confirmedBooking.timeSlot}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">Customer:</span>
                    <span className="font-bold text-white">{confirmedBooking.customerName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">Total Amount Paid:</span>
                    <span className="font-bold text-amber-400 font-mono">
                      ₹{confirmedBooking.totalAmount} ({confirmedBooking.paymentMethod})
                    </span>
                  </div>
                </div>

                {/* QR Code */}
                <div className="pt-3 border-t border-neutral-800 flex items-center justify-center">
                  <img
                    src={confirmedBooking.bookingQr}
                    alt="Booking QR Code"
                    className="w-28 h-28 rounded-xl border border-amber-400 p-1 bg-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between">
          {currentStep > 1 && currentStep < 4 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs cursor-pointer"
            >
              Back
            </button>
          )}

          {currentStep < 3 && (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="ml-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 cursor-pointer"
            >
              Continue
            </button>
          )}

          {currentStep === 3 && (
            <button
              onClick={handleConfirmAppointment}
              disabled={isSubmitting}
              className="ml-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-neutral-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-amber-500/30 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : `Pay ₹${finalPrice} & Confirm`}
            </button>
          )}

          {currentStep === 4 && (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black text-xs uppercase tracking-wider cursor-pointer"
            >
              Done & Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
