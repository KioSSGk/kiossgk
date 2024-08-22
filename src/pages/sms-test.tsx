import React, { useState } from 'react';
import axios from 'axios';

const SmsTest: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSendSms = async () => {
    try {
      const response = await axios.post('/api/send_order_notification', { orderId });
      setResponseMessage(`Success: ${response.data.message}`);
    } catch (error) {
      console.error('Error sending SMS:', error);
      setResponseMessage('Failed to send SMS');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">SMS Test</h1>
        <input
          type="text"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <button
          onClick={handleSendSms}
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
        >
          Send SMS
        </button>
        {responseMessage && (
          <div className="mt-4 text-center text-red-500">
            {responseMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmsTest;
