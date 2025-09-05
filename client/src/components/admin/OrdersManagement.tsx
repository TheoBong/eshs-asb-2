import React, { useState, useMemo } from 'react';
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Search, 
  Eye,
  Check,
  X,
  Edit,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Purchase, FormSubmission, updatePurchase } from '@/lib/api';
import { format, parseISO, isAfter, isBefore, isEqual } from 'date-fns';

interface OrdersManagementProps {
  purchases: Purchase[];
  formSubmissions: FormSubmission[];
  onUpdatePurchase: (id: string, data: Partial<Purchase>) => void;
  onRefreshData: () => void;
}

export default function OrdersManagement({ 
  purchases, 
  formSubmissions,
  onUpdatePurchase,
  onRefreshData 
}: OrdersManagementProps) {
  // Filter states
  const [showPending, setShowPending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'completed'>('all');
  
  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<Purchase | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showFulfillModal, setShowFulfillModal] = useState(false);
  const [fulfillmentName, setFulfillmentName] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  
  // Tickets search
  const [ticketSearch, setTicketSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<FormSubmission | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);

  // Filter orders
  const filteredOrders = useMemo(() => {
    let filtered = purchases;
    
    // Filter by status
    if (!showPending) {
      filtered = filtered.filter(p => p.status !== 'pending');
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.studentName.toLowerCase().includes(search) ||
        p.studentEmail.toLowerCase().includes(search) ||
        p.productName.toLowerCase().includes(search) ||
        p._id.toLowerCase().includes(search) ||
        p.cloverOrderId?.toLowerCase().includes(search)
      );
    }
    
    // Date filter
    const now = new Date();
    if (dateFilter === 'today') {
      filtered = filtered.filter(p => {
        const orderDate = new Date(p.date);
        return orderDate.toDateString() === now.toDateString();
      });
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(p => new Date(p.date) >= weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(p => new Date(p.date) >= monthAgo);
    }
    
    // Sort by date descending
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [purchases, showPending, searchTerm, dateFilter, statusFilter]);

  // Filter tickets
  const filteredTickets = useMemo(() => {
    if (!ticketSearch) return formSubmissions;
    
    const search = ticketSearch.toLowerCase();
    return formSubmissions.filter(t => 
      t.studentName.toLowerCase().includes(search) ||
      t.email.toLowerCase().includes(search) ||
      t._id.toLowerCase().includes(search)
    );
  }, [formSubmissions, ticketSearch]);

  // Analytics
  const analytics = useMemo(() => {
    const paid = purchases.filter(p => p.status === 'paid');
    const completed = purchases.filter(p => p.status === 'completed');
    const pending = purchases.filter(p => p.status === 'pending');
    
    return {
      totalRevenue: paid.concat(completed).reduce((sum, p) => sum + p.amount, 0),
      pendingRevenue: pending.reduce((sum, p) => sum + p.amount, 0),
      paidOrders: paid.length,
      completedOrders: completed.length,
      pendingOrders: pending.length,
      itemsSold: paid.concat(completed).reduce((sum, p) => sum + p.quantity, 0)
    };
  }, [purchases]);

  const handleFulfillOrder = async () => {
    if (!selectedOrder || !fulfillmentName) return;
    
    try {
      await updatePurchase(selectedOrder._id, {
        status: 'completed',
        fulfilledBy: fulfillmentName,
        fulfilledAt: new Date(),
        adminNotes: adminNotes || selectedOrder.adminNotes
      });
      
      onUpdatePurchase(selectedOrder._id, {
        status: 'completed',
        fulfilledBy: fulfillmentName,
        fulfilledAt: new Date(),
        adminNotes: adminNotes || selectedOrder.adminNotes
      });
      
      setShowFulfillModal(false);
      setFulfillmentName('');
      setAdminNotes('');
      setSelectedOrder(null);
      onRefreshData();
    } catch (error) {
      console.error('Failed to fulfill order:', error);
      alert('Failed to fulfill order. Please try again.');
    }
  };

  const handleUpdateNotes = async (orderId: string, notes: string) => {
    try {
      await updatePurchase(orderId, { adminNotes: notes });
      onUpdatePurchase(orderId, { adminNotes: notes });
      onRefreshData();
    } catch (error) {
      console.error('Failed to update notes:', error);
    }
  };

  const openOrderDetails = (order: Purchase) => {
    setSelectedOrder(order);
    setAdminNotes(order.adminNotes || '');
    setShowOrderModal(true);
  };

  const openFulfillModal = (order: Purchase) => {
    setSelectedOrder(order);
    setAdminNotes(order.adminNotes || '');
    setShowFulfillModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-2xl rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-300">Total Revenue</h3>
              <div className="text-2xl font-bold text-white">
                ${analytics.totalRevenue.toFixed(2)}
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-2xl rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-300">Pending Revenue</h3>
              <div className="text-2xl font-bold text-white">
                ${analytics.pendingRevenue.toFixed(2)}
              </div>
            </div>
            <TrendingUp className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-2xl rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-300">Orders</h3>
              <div className="text-sm text-white">
                <span className="text-green-400">{analytics.paidOrders} paid</span> • 
                <span className="text-blue-400"> {analytics.completedOrders} fulfilled</span>
                {showPending && <span className="text-yellow-400"> • {analytics.pendingOrders} pending</span>}
              </div>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-2xl rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-300">Items Sold</h3>
              <div className="text-2xl font-bold text-white">
                {analytics.itemsSold}
              </div>
            </div>
            <Package className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-2xl rounded-xl">
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-4">Orders</h3>
              
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid (Unfulfilled)</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={dateFilter} onValueChange={(value: any) => setDateFilter(value)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="show-pending" 
                    checked={showPending}
                    onCheckedChange={(checked) => setShowPending(!!checked)}
                  />
                  <Label htmlFor="show-pending" className="text-sm text-gray-300 cursor-pointer">
                    Show Pending
                  </Label>
                </div>
                
                <Badge variant="outline" className="bg-blue-600/20 border-blue-600/30 text-blue-200 justify-center">
                  {filteredOrders.length} orders
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-300">Order ID</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-300">Customer</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-300">Items</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-300">Amount</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-300">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-300">Date</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-300">Fulfilled By</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-b border-white/5 hover:bg-white/[0.01]">
                  <td className="py-4 px-6 text-sm text-white font-mono">
                    #{order._id.slice(-8)}
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-sm font-medium text-white">{order.studentName}</div>
                      <div className="text-xs text-gray-400">{order.studentEmail}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-white">{order.productName}</div>
                    <div className="text-xs text-gray-400">
                      Qty: {order.quantity}
                      {order.size && ` • Size: ${order.size}`}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-semibold text-white">
                    ${order.amount.toFixed(2)}
                  </td>
                  <td className="py-4 px-6">
                    <Badge 
                      variant="outline" 
                      className={`
                        ${order.status === 'paid' ? 'bg-green-600/20 border-green-600/30 text-green-200' : ''}
                        ${order.status === 'pending' ? 'bg-yellow-600/20 border-yellow-600/30 text-yellow-200' : ''}
                        ${order.status === 'completed' ? 'bg-blue-600/20 border-blue-600/30 text-blue-200' : ''}
                        ${order.status === 'cancelled' ? 'bg-red-600/20 border-red-600/30 text-red-200' : ''}
                        text-xs px-2 py-1 capitalize
                      `}
                    >
                      {order.status === 'paid' ? 'Paid (Unfulfilled)' : order.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-300">
                    {format(new Date(order.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-300">
                    {order.fulfilledBy ? (
                      <div>
                        <div className="text-white">{order.fulfilledBy}</div>
                        {order.fulfilledAt && (
                          <div className="text-xs text-gray-400">
                            {format(new Date(order.fulfilledAt), 'MMM dd')}
                          </div>
                        )}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => openOrderDetails(order)}
                        className="bg-white/5 hover:bg-white/10 text-white border-white/20"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      {order.status === 'paid' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openFulfillModal(order)}
                          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border-blue-500/30"
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-300">No orders found</h3>
              <p className="mt-1 text-sm text-gray-400">
                Try adjusting your filters or search criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tickets Section */}
      <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-2xl rounded-xl">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Event Tickets & Form Submissions</h3>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, email, or ID..."
              value={ticketSearch}
              onChange={(e) => setTicketSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-300">Submission ID</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-300">Student</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-300">Event</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-300">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-300">Date</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket._id} className="border-b border-white/5 hover:bg-white/[0.01]">
                  <td className="py-4 px-6 text-sm text-white font-mono">
                    #{ticket._id.slice(-8)}
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-sm font-medium text-white">{ticket.studentName}</div>
                      <div className="text-xs text-gray-400">{ticket.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-white">
                    {ticket.eventId?.title || 'N/A'}
                  </td>
                  <td className="py-4 px-6">
                    <Badge 
                      variant="outline" 
                      className={`
                        ${ticket.status === 'approved' ? 'bg-green-600/20 border-green-600/30 text-green-200' : ''}
                        ${ticket.status === 'pending' ? 'bg-yellow-600/20 border-yellow-600/30 text-yellow-200' : ''}
                        ${ticket.status === 'rejected' ? 'bg-red-600/20 border-red-600/30 text-red-200' : ''}
                        text-xs px-2 py-1 capitalize
                      `}
                    >
                      {ticket.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-300">
                    {format(new Date(ticket.submissionDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="py-4 px-6">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setShowTicketModal(true);
                      }}
                      className="bg-white/5 hover:bg-white/10 text-white border-white/20"
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredTickets.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-300">No tickets found</h3>
              <p className="mt-1 text-sm text-gray-400">
                No form submissions match your search.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Order Details</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400 text-sm">Order ID</Label>
                  <p className="text-white font-mono">#{selectedOrder._id.slice(-8)}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Status</Label>
                  <Badge 
                    variant="outline" 
                    className={`
                      ${selectedOrder.status === 'paid' ? 'bg-green-600/20 border-green-600/30 text-green-200' : ''}
                      ${selectedOrder.status === 'completed' ? 'bg-blue-600/20 border-blue-600/30 text-blue-200' : ''}
                      text-xs px-2 py-1 capitalize mt-1
                    `}
                  >
                    {selectedOrder.status === 'paid' ? 'Paid (Unfulfilled)' : selectedOrder.status}
                  </Badge>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <Label className="text-gray-400 text-sm">Customer Information</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-white">{selectedOrder.studentName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-white">{selectedOrder.studentEmail}</span>
                  </div>
                  {selectedOrder.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{selectedOrder.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <Label className="text-gray-400 text-sm">Order Information</Label>
                <div className="mt-2 space-y-2">
                  <p className="text-white"><strong>Product:</strong> {selectedOrder.productName}</p>
                  <p className="text-white"><strong>Quantity:</strong> {selectedOrder.quantity}</p>
                  {selectedOrder.size && <p className="text-white"><strong>Size:</strong> {selectedOrder.size}</p>}
                  <p className="text-white"><strong>Amount:</strong> ${selectedOrder.amount.toFixed(2)}</p>
                  <p className="text-white"><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                </div>
              </div>

              {selectedOrder.deliveryMethod && (
                <div className="border-t border-white/10 pt-4">
                  <Label className="text-gray-400 text-sm">Delivery Information</Label>
                  <div className="mt-2 space-y-2">
                    <p className="text-white"><strong>Method:</strong> {selectedOrder.deliveryMethod}</p>
                    {selectedOrder.deliveryDetails?.roomTeacher && (
                      <p className="text-white"><strong>Room/Teacher:</strong> {selectedOrder.deliveryDetails.roomTeacher}</p>
                    )}
                  </div>
                </div>
              )}

              {selectedOrder.fulfilledBy && (
                <div className="border-t border-white/10 pt-4">
                  <Label className="text-gray-400 text-sm">Fulfillment Information</Label>
                  <div className="mt-2 space-y-2">
                    <p className="text-white"><strong>Fulfilled By:</strong> {selectedOrder.fulfilledBy}</p>
                    {selectedOrder.fulfilledAt && (
                      <p className="text-white">
                        <strong>Fulfilled At:</strong> {format(new Date(selectedOrder.fulfilledAt), 'MMM dd, yyyy hh:mm a')}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t border-white/10 pt-4">
                <Label className="text-gray-400 text-sm">Admin Notes</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this order..."
                  className="mt-2 bg-white/5 border-white/10 text-white"
                />
                <Button
                  onClick={() => handleUpdateNotes(selectedOrder._id, adminNotes)}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save Notes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Fulfill Order Modal */}
      <Dialog open={showFulfillModal} onOpenChange={setShowFulfillModal}>
        <DialogContent className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Fulfill Order</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-400 text-sm">Order Information</Label>
                <div className="mt-2 p-3 bg-white/5 rounded-lg">
                  <p className="text-white text-sm">
                    <strong>Customer:</strong> {selectedOrder.studentName}
                  </p>
                  <p className="text-white text-sm">
                    <strong>Product:</strong> {selectedOrder.productName} (x{selectedOrder.quantity})
                  </p>
                  <p className="text-white text-sm">
                    <strong>Delivery:</strong> {selectedOrder.deliveryMethod}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="fulfillment-name" className="text-white">
                  Your Name (Required) *
                </Label>
                <Input
                  id="fulfillment-name"
                  value={fulfillmentName}
                  onChange={(e) => setFulfillmentName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1 bg-white/5 border-white/10 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="fulfill-notes" className="text-white">
                  Notes (Optional)
                </Label>
                <Textarea
                  id="fulfill-notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add any notes about the fulfillment..."
                  className="mt-1 bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleFulfillOrder}
                  disabled={!fulfillmentName}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Mark as Fulfilled
                </Button>
                <Button
                  onClick={() => setShowFulfillModal(false)}
                  variant="outline"
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white border-white/20"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Ticket Details Modal */}
      <Dialog open={showTicketModal} onOpenChange={setShowTicketModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Ticket Details</DialogTitle>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400 text-sm">Submission ID</Label>
                  <p className="text-white font-mono">#{selectedTicket._id.slice(-8)}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Status</Label>
                  <Badge 
                    variant="outline" 
                    className={`
                      ${selectedTicket.status === 'approved' ? 'bg-green-600/20 border-green-600/30 text-green-200' : ''}
                      ${selectedTicket.status === 'pending' ? 'bg-yellow-600/20 border-yellow-600/30 text-yellow-200' : ''}
                      ${selectedTicket.status === 'rejected' ? 'bg-red-600/20 border-red-600/30 text-red-200' : ''}
                      text-xs px-2 py-1 capitalize mt-1
                    `}
                  >
                    {selectedTicket.status}
                  </Badge>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <Label className="text-gray-400 text-sm">Student Information</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-white">{selectedTicket.studentName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-white">{selectedTicket.email}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <Label className="text-gray-400 text-sm">Event Information</Label>
                <div className="mt-2">
                  <p className="text-white"><strong>Event:</strong> {selectedTicket.eventId?.title || 'N/A'}</p>
                  <p className="text-white">
                    <strong>Submission Date:</strong> {format(new Date(selectedTicket.submissionDate), 'MMM dd, yyyy hh:mm a')}
                  </p>
                </div>
              </div>

              {selectedTicket.forms && selectedTicket.forms.length > 0 && (
                <div className="border-t border-white/10 pt-4">
                  <Label className="text-gray-400 text-sm">Submitted Forms</Label>
                  <div className="mt-2 space-y-2">
                    {selectedTicket.forms.map((form, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-white text-sm">{form.fileName}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(form.fileUrl, '_blank')}
                          className="bg-white/5 hover:bg-white/10 text-white border-white/20"
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTicket.notes && (
                <div className="border-t border-white/10 pt-4">
                  <Label className="text-gray-400 text-sm">Notes</Label>
                  <p className="mt-2 text-white">{selectedTicket.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}