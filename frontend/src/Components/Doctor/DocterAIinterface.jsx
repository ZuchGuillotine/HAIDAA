// src/components/doctor/DoctorAIInterface.jsx
import React, { useState } from 'react';
import { Send, Save } from 'lucide-react';
import axios from 'axios';

const DoctorAIInterface = ({ patientId }) => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);

  // Function to handle sending messages to the LLM API
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Append doctor's message to conversation
    const newConversation = [...conversation, { sender: 'doctor', text: message }];
    setConversation(newConversation);

    try {
      // Mock API call to LLM endpoint
      const response = await axios.post('/api/llm', {
        patientId,
        message,
      });

      // Append LLM response to conversation
      const llmResponse = response.data.reply;
      setConversation((prev) => [...prev, { sender: 'llm', text: llmResponse }]);
    } catch (error) {
      console.error('Error communicating with LLM API:', error);
    }

    setMessage('');
  };

  // Function to save the conversation to a database (mocked)
  const handleSaveConversation = async () => {
    try {
      // Mock saving conversation to a database
      await axios.post('/api/save-conversation', {
        patientId,
        conversation,
      });
      alert('Conversation saved successfully.');
    } catch (error) {
      console.error('Error saving conversation:', error);
      alert('Failed to save the conversation.');
    }
  };

  return (
    <div className="doctor-ai-interface-container">
      {/* Conversation display */}
      <div className="conversation p-4 bg-gray-100 rounded-lg mb-4 h-64 overflow-y-auto">
        {conversation.map((entry, index) => (
          <div
            key={index}
            className={`message mb-2 ${entry.sender === 'doctor' ? 'text-blue-700' : 'text-green-700'}`}
          >
            <strong>{entry.sender === 'doctor' ? 'Doctor: ' : 'AI: '}</strong>
            <span>{entry.text}</span>
          </div>
        ))}
      </div>

      {/* Input field to type message */}
      <div className="input-area flex items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="send-button p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>

      {/* Save conversation button */}
      <div className="mt-4">
        <button
          onClick={handleSaveConversation}
          className="save-button p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          <Save className="h-5 w-5 inline-block mr-2" /> Save Conversation
        </button>
      </div>
    </div>
  );
};

export default DoctorAIInterface;
