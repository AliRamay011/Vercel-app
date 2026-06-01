import React, { useState, useEffect } from "react";
import {
  Send,
  MessageSquare,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Plus,
  Eye,
  Trash2,
  X,
  Phone,
  Mail,
  Download,
  BarChart3,
  Settings,
} from "lucide-react";

const SMSIntegration = () => {
  const [activeTab, setActiveTab] = useState("compose");
  const [messages, setMessages] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [newMessage, setNewMessage] = useState({
    type: "individual",
    recipients: [],
    message: "",
    template: "",
    scheduled: false,
    schedule_date: "",
    schedule_time: ""
  });
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    category: "payment",
    content: ""
  });
  const [loading, setLoading] = useState(false);

  // Dummy Data
  const dummyMessages = [
    {
      id: 1,
      type: "bulk",
      recipients: 45,
      message: "Bill payment reminder: Your internet bill is due in 3 days. Pay now to avoid service disruption.",
      status: "delivered",
      sent_at: "2025-11-18 10:30",
      cost: 90.00
    },
    {
      id: 2,
      type: "individual",
      recipients: 1,
      recipient_name: "Ali Ahmed",
      message: "Welcome to NetConnect! Your connection is now active. Customer ID: NC1256",
      status: "delivered",
      sent_at: "2025-11-18 09:15",
      cost: 2.00
    },
    {
      id: 3,
      type: "bulk",
      recipients: 120,
      message: "Network maintenance scheduled for tonight 2-4 AM. Sorry for inconvenience.",
      status: "scheduled",
      sent_at: "2025-11-19 02:00",
      cost: 240.00
    },
    {
      id: 4,
      type: "individual",
      recipients: 1,
      recipient_name: "Sara Khan",
      message: "Your payment of Rs. 1500 has been received. Thank you!",
      status: "delivered",
      sent_at: "2025-11-17 16:45",
      cost: 2.00
    },
    {
      id: 5,
      type: "bulk",
      recipients: 85,
      message: "Special offer: Get 20% discount on quarterly payment. Limited time!",
      status: "failed",
      sent_at: "2025-11-17 14:20",
      cost: 0.00
    }
  ];

  const dummyTemplates = [
    {
      id: 1,
      name: "Payment Reminder",
      category: "payment",
      content: "Dear {customer_name}, your internet bill of Rs. {amount} is due on {due_date}. Pay now to avoid service disruption.",
      used_count: 45,
      created_at: "2025-10-15"
    },
    {
      id: 2,
      name: "Welcome Message",
      category: "welcome",
      content: "Welcome to {company_name}! Your internet connection is now active. Customer ID: {customer_id}. Support: {support_phone}",
      used_count: 23,
      created_at: "2025-10-10"
    },
    {
      id: 3,
      name: "Service Alert",
      category: "service",
      content: "Dear Customer, {message}. We apologize for the inconvenience. - {company_name}",
      used_count: 12,
      created_at: "2025-10-08"
    },
    {
      id: 4,
      name: "Birthday Wish",
      category: "marketing",
      content: "Happy Birthday {customer_name}! Enjoy a 15% discount on your next bill as our gift to you.",
      used_count: 8,
      created_at: "2025-10-05"
    },
    {
      id: 5,
      name: "Payment Received",
      category: "payment",
      content: "Thank you {customer_name}! Your payment of Rs. {amount} has been received.",
      used_count: 67,
      created_at: "2025-09-28"
    }
  ];

  const dummyCustomers = [
    { id: 1, name: "Ali Ahmed", phone: "03001234567", plan: "50 Mbps Unlimited", status: "active" },
    { id: 2, name: "Sara Khan", phone: "03001234568", plan: "100 Mbps Premium", status: "active" },
    { id: 3, name: "John Doe", phone: "03001234569", plan: "25 Mbps Basic", status: "active" },
    { id: 4, name: "Maria Garcia", phone: "03001234570", plan: "50 Mbps Unlimited", status: "inactive" },
    { id: 5, name: "David Smith", phone: "03001234571", plan: "100 Mbps Premium", status: "active" },
    { id: 6, name: "Fatima Noor", phone: "03001234572", plan: "25 Mbps Basic", status: "active" },
    { id: 7, name: "Ahmed Raza", phone: "03001234573", plan: "50 Mbps Unlimited", status: "active" },
    { id: 8, name: "Ayesha Malik", phone: "03001234574", plan: "100 Mbps Premium", status: "inactive" }
  ];

  useEffect(() => {
    setMessages(dummyMessages);
    setTemplates(dummyTemplates);
    setCustomers(dummyCustomers);
  }, []);

  const messageCategories = [
    { value: "payment", label: "Payment", color: "bg-blue-100 text-blue-800" },
    { value: "welcome", label: "Welcome", color: "bg-green-100 text-green-800" },
    { value: "service", label: "Service", color: "bg-yellow-100 text-yellow-800" },
    { value: "marketing", label: "Marketing", color: "bg-purple-100 text-purple-800" },
    { value: "security", label: "Security", color: "bg-red-100 text-red-800" }
  ];

  const messageTypes = [
    { value: "individual", label: "Individual", icon: <Users className="h-4 w-4" /> },
    { value: "bulk", label: "Bulk", icon: <Send className="h-4 w-4" /> },
    { value: "scheduled", label: "Scheduled", icon: <Calendar className="h-4 w-4" /> }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "failed": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered": return <CheckCircle className="h-4 w-4" />;
      case "scheduled": return <Clock className="h-4 w-4" />;
      case "failed": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category) => {
    const cat = messageCategories.find(c => c.value === category);
    return cat ? cat.color : "bg-gray-100 text-gray-800";
  };

  const handleSendMessage = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newMsg = {
        id: messages.length + 1,
        type: newMessage.type,
        recipients: newMessage.type === "individual" ? 1 : selectedCustomers.length,
        recipient_name: newMessage.type === "individual" && selectedCustomers[0] ? selectedCustomers[0].name : undefined,
        message: newMessage.message,
        status: newMessage.scheduled ? "scheduled" : "delivered",
        sent_at: new Date().toISOString(),
        cost: newMessage.type === "individual" ? 2.00 : selectedCustomers.length * 2.00
      };
      
      setMessages([newMsg, ...messages]);
      setNewMessage({
        type: "individual",
        recipients: [],
        message: "",
        template: "",
        scheduled: false,
        schedule_date: "",
        schedule_time: ""
      });
      setSelectedCustomers([]);
      setShowComposeModal(false);
      setLoading(false);
    }, 2000);
  };

  const handleCreateTemplate = () => {
    const newTemp = {
      id: templates.length + 1,
      name: newTemplate.name,
      category: newTemplate.category,
      content: newTemplate.content,
      used_count: 0,
      created_at: new Date().toISOString().split('T')[0]
    };
    
    setTemplates([...templates, newTemp]);
    setNewTemplate({ name: "", category: "payment", content: "" });
    setShowTemplateModal(false);
  };

  const handleCustomerSelect = (customer) => {
    if (selectedCustomers.find(c => c.id === customer.id)) {
      setSelectedCustomers(selectedCustomers.filter(c => c.id !== customer.id));
    } else {
      setSelectedCustomers([...selectedCustomers, customer]);
    }
  };

  const calculateCost = () => {
    const rate = 2.00; // Rs. 2 per SMS
    if (newMessage.type === "individual") {
      return selectedCustomers.length > 0 ? rate : 0;
    }
    return selectedCustomers.length * rate;
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SMS Integration</h1>
          <p className="text-gray-600 mt-1">Send messages and manage SMS campaigns</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 justify-center font-medium"
            onClick={() => setShowComposeModal(true)}
          >
            <Send className="h-4 w-4" />
            Compose SMS
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 justify-center font-medium"
            onClick={() => setShowTemplateModal(true)}
          >
            <Plus className="h-4 w-4" />
            New Template
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
              <p className="text-sm text-gray-600 mt-1">Total Messages</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {messages.filter(m => m.status === 'delivered').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Delivered</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                Rs. {messages.reduce((sum, msg) => sum + msg.cost, 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Cost</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
              <p className="text-sm text-gray-600 mt-1">Templates</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Settings className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {["compose", "history", "templates", "analytics"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "compose" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {messageTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setNewMessage({...newMessage, type: type.value})}
                    className={`p-4 border-2 rounded-lg text-center transition ${
                      newMessage.type === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {type.icon}
                      <span className="font-medium">{type.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Customer Selection */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Select Recipients</h3>
                  <span className="text-sm text-gray-600">
                    {selectedCustomers.length} customers selected
                  </span>
                </div>
                
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => handleCustomerSelect(customer)}
                      className={`flex items-center gap-3 p-3 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-100 ${
                        selectedCustomers.find(c => c.id === customer.id) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!selectedCustomers.find(c => c.id === customer.id)}
                        onChange={() => {}}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-600">{customer.phone} • {customer.plan}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Composer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Content
                </label>
                <textarea
                  placeholder="Type your message here... (160 characters per SMS)"
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  maxLength={480}
                />
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                  <span>Maximum 3 SMS (480 characters)</span>
                  <span>0/480 characters</span>
                </div>
              </div>

              {/* Quick Templates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Templates
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {templates.slice(0, 4).map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setNewMessage({...newMessage, message: template.content})}
                      className="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{template.name}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                          {messageCategories.find(c => c.value === template.category)?.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{template.content}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Schedule Options */}
              <div className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <input
                  type="checkbox"
                  id="schedule"
                  checked={newMessage.scheduled}
                  onChange={(e) => setNewMessage({...newMessage, scheduled: e.target.checked})}
                  className="rounded"
                />
                <label htmlFor="schedule" className="font-medium">Schedule this message</label>
                
                {newMessage.scheduled && (
                  <div className="flex gap-4 ml-auto">
                    <input
                      type="date"
                      value={newMessage.schedule_date}
                      onChange={(e) => setNewMessage({...newMessage, schedule_date: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="time"
                      value={newMessage.schedule_time}
                      onChange={(e) => setNewMessage({...newMessage, schedule_time: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Cost Calculation */}
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Estimated Cost</p>
                  <p className="text-sm text-gray-600">
                    {selectedCustomers.length} recipients × Rs. 2.00 per SMS
                  </p>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  Rs. {calculateCost().toFixed(2)}
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium">
                  Save Draft
                </button>
                <button 
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  onClick={handleSendMessage}
                  disabled={selectedCustomers.length === 0 || loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Type</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Recipients</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Message</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Sent At</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Cost</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {messages.map((message) => (
                    <tr key={message.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          message.type === 'individual' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {message.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{message.recipients}</div>
                        {message.recipient_name && (
                          <div className="text-sm text-gray-600">{message.recipient_name}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-900 line-clamp-2">{message.message}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                          {getStatusIcon(message.status)}
                          {message.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-900">{message.sent_at}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold">Rs. {message.cost.toFixed(2)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "templates" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                      {messageCategories.find(c => c.value === template.category)?.label}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{template.content}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Used {template.used_count} times</span>
                    <span>Created {template.created_at}</span>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition text-sm font-medium">
                      Use Template
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-semibold mb-4">Messages by Type</h3>
                  <div className="space-y-3">
                    {messageTypes.map((type) => {
                      const count = messages.filter(m => m.type === type.value).length;
                      return (
                        <div key={type.value} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{type.label}</span>
                          <span className="font-semibold">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-semibold mb-4">Delivery Status</h3>
                  <div className="space-y-3">
                    {["delivered", "scheduled", "failed", "pending"].map((status) => {
                      const count = messages.filter(m => m.status === status).length;
                      return (
                        <div key={status} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 capitalize">{status}</span>
                          <span className="font-semibold">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Recent Activity</h3>
                  <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm">
                    <Download className="h-4 w-4" />
                    Export Report
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Date</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Messages Sent</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Success Rate</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Total Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-3 px-4">Today</td>
                        <td className="py-3 px-4">12</td>
                        <td className="py-3 px-4">
                          <span className="text-green-600 font-semibold">100%</span>
                        </td>
                        <td className="py-3 px-4">Rs. 24.00</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Yesterday</td>
                        <td className="py-3 px-4">45</td>
                        <td className="py-3 px-4">
                          <span className="text-green-600 font-semibold">98%</span>
                        </td>
                        <td className="py-3 px-4">Rs. 88.00</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">This Week</td>
                        <td className="py-3 px-4">156</td>
                        <td className="py-3 px-4">
                          <span className="text-green-600 font-semibold">96%</span>
                        </td>
                        <td className="py-3 px-4">Rs. 310.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose SMS Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">Compose New SMS</h3>
              <button 
                onClick={() => setShowComposeModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {/* Same compose content as above */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {messageTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setNewMessage({...newMessage, type: type.value})}
                      className={`p-4 border-2 rounded-lg text-center transition ${
                        newMessage.type === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {type.icon}
                        <span className="font-medium">{type.label}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Rest of compose form */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">Create New Template</h3>
              <button 
                onClick={() => setShowTemplateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter template name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {messageCategories.map(category => (
                      <option key={category.value} value={category.value}>{category.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Content
                  </label>
                  <textarea
                    placeholder="Enter your template content. You can use variables like {customer_name}, {amount}, {due_date}, etc."
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Available variables: {"{customer_name} {amount} {due_date} {customer_id} {company_name} {support_phone}"}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">💡 Template Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Keep messages under 160 characters for single SMS</li>
                    <li>• Use customer name for personalization</li>
                    <li>• Include clear call-to-action</li>
                    <li>• Add your company name at the end</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button 
                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
                onClick={() => setShowTemplateModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                onClick={handleCreateTemplate}
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SMSIntegration;