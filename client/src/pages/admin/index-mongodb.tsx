import React, { useState, useEffect } from 'react';
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2, Package, Calendar, Info, Video, FileText, Check, X, Eye, BarChart3, Users } from 'lucide-react';
import { ThemedCard, PrimaryButton, SecondaryButton, OutlineButton } from '@/components/ThemedComponents';
import { CommaSeparatedInput } from '@/components/ui/comma-separated-input';
import schoolVideo from "../../../../attached_assets/school2.mp4";
import {
  getProducts, createProduct, updateProduct, deleteProduct,
  getEvents, createEvent, updateEvent, deleteEvent,
  getVideos, createVideo, updateVideo, deleteVideo,
  getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement,
  getStudentGovPositions, createStudentGovPosition, updateStudentGovPosition, deleteStudentGovPosition,
  getClubs, createClub, updateClub, deleteClub,
  getAthletics, createAthletic, updateAthletic, deleteAthletic,
  getArts, createArt, updateArt, deleteArt,
  getFormSubmissions, updateFormSubmission,
  getPurchases,
  Product, Event, VideoPost, Announcement, StudentGovPosition, Club, Athletic, Art, FormSubmission, Purchase
} from '@/lib/api';

// Simple form components for each data type
function ProductForm({ product, onSubmit, onCancel }: {
  product?: Product;
  onSubmit: (data: Partial<Product>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: '',
      price: 0,
      category: '',
      organization: '',
      sizes: [],
      colors: [],
      image: '',
      description: '',
      stock: 0
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Product Name</label>
        <Input
          value={formData.name || ''}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Enter product name"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Price ($)</label>
          <Input
            type="number"
            value={formData.price || ''}
            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
            placeholder="0.00"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Stock</label>
          <Input
            type="number"
            value={formData.stock || ''}
            onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Category</label>
        <Input
          value={formData.category || ''}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          placeholder="e.g., Apparel, Accessories"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Organization</label>
        <Input
          value={formData.organization || ''}
          onChange={(e) => setFormData({...formData, organization: e.target.value})}
          placeholder="ASB, Drama Club, etc."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Description</label>
        <Textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Product description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Available Sizes</label>
          <Input
            value={formData.sizes?.join(', ') || ''}
            onChange={(e) => setFormData({...formData, sizes: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
            placeholder="S, M, L, XL"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Available Colors</label>
          <Input
            value={formData.colors?.join(', ') || ''}
            onChange={(e) => setFormData({...formData, colors: e.target.value.split(',').map(c => c.trim()).filter(c => c)})}
            placeholder="Blue, Gold, Red"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Image URL</label>
        <Input
          value={formData.image || ''}
          onChange={(e) => setFormData({...formData, image: e.target.value})}
          placeholder="/api/placeholder/400/400"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <PrimaryButton type="submit">
          {product ? 'Update Product' : 'Add Product'}
        </PrimaryButton>
        <OutlineButton type="button" onClick={onCancel}>
          Cancel
        </OutlineButton>
      </div>
    </form>
  );
}

function EventForm({ event, onSubmit, onCancel }: {
  event?: Event;
  onSubmit: (data: Partial<Event>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Event>>(
    event || {
      title: '',
      category: '',
      date: new Date(),
      time: '',
      location: '',
      description: '',
      price: 0,
      maxTickets: 0,
      features: [],
      requiresApproval: false
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, date: new Date(e.target.value)});
  };

  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Event Title</label>
        <Input
          value={formData.title || ''}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Enter event title"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Category</label>
          <Input
            value={formData.category || ''}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            placeholder="e.g., Dance, Sports, Academic"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Date</label>
          <Input
            type="date"
            value={formatDateForInput(formData.date)}
            onChange={handleDateChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Time</label>
          <Input
            value={formData.time || ''}
            onChange={(e) => setFormData({...formData, time: e.target.value})}
            placeholder="7:00 PM - 11:00 PM"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Location</label>
          <Input
            value={formData.location || ''}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            placeholder="School Gymnasium"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Description</label>
        <Textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Event description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Price ($)</label>
          <Input
            type="number"
            value={formData.price || ''}
            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Max Tickets</label>
          <Input
            type="number"
            value={formData.maxTickets || ''}
            onChange={(e) => setFormData({...formData, maxTickets: parseInt(e.target.value)})}
            placeholder="0"
          />
        </div>
      </div>      <div>
        <label className="block text-sm font-medium text-white mb-2">Features</label>
        <CommaSeparatedInput
          value={formData.features || []}
          onChange={(features) => setFormData({...formData, features})}
          placeholder="DJ, Refreshments, Photo Booth"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="requiresApproval"
          checked={formData.requiresApproval || false}
          onChange={(e) => setFormData({...formData, requiresApproval: e.target.checked})}
          className="rounded"
        />
        <label htmlFor="requiresApproval" className="text-sm text-white">
          Requires approval
        </label>
      </div>

      <div className="flex gap-2 pt-4">
        <PrimaryButton type="submit">
          {event ? 'Update Event' : 'Add Event'}
        </PrimaryButton>
        <OutlineButton type="button" onClick={onCancel}>
          Cancel
        </OutlineButton>
      </div>
    </form>
  );
}

// Similar pattern for other forms... (keeping it brief for now)

export default function AdminMongoDB() {
  // State for managing data
  const [products, setProducts] = useState<Product[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [studentGov, setStudentGov] = useState<StudentGovPosition[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [athletics, setAthletics] = useState<Athletic[]>([]);
  const [arts, setArts] = useState<Art[]>([]);
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [, setLocation] = useLocation();

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          productsData,
          eventsData,
          videosData,
          announcementsData,
          studentGovData,
          clubsData,
          athleticsData,
          artsData,
          formSubmissionsData,
          purchasesData
        ] = await Promise.all([
          getProducts(),
          getEvents(),
          getVideos(),
          getAnnouncements(),
          getStudentGovPositions(),
          getClubs(),
          getAthletics(),
          getArts(),
          getFormSubmissions(),
          getPurchases()
        ]);

        setProducts(productsData);
        setEvents(eventsData);
        setVideos(videosData);
        setAnnouncements(announcementsData);
        setStudentGov(studentGovData);
        setClubs(clubsData);
        setAthletics(athleticsData);
        setArts(artsData);
        setFormSubmissions(formSubmissionsData);
        setPurchases(purchasesData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // CRUD handlers
  const handleAddProduct = async (productData: Partial<Product>) => {
    try {
      const newProduct = await createProduct(productData);
      setProducts([...products, newProduct]);
      setShowProductModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Failed to add product:', err);
      alert('Failed to add product. Please try again.');
    }
  };

  const handleUpdateProduct = async (productData: Partial<Product>) => {
    if (!editingItem?._id) return;
    
    try {
      const updatedProduct = await updateProduct(editingItem._id, productData);
      setProducts(products.map(p => p._id === editingItem._id ? updatedProduct : p));
      setShowProductModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Failed to update product:', err);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(p => p._id !== id));
      } catch (err) {
        console.error('Failed to delete product:', err);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleAddEvent = async (eventData: Partial<Event>) => {
    try {
      const newEvent = await createEvent(eventData);
      setEvents([...events, newEvent]);
      setShowEventModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Failed to add event:', err);
      alert('Failed to add event. Please try again.');
    }
  };

  const handleUpdateEvent = async (eventData: Partial<Event>) => {
    if (!editingItem?._id) return;
    
    try {
      const updatedEvent = await updateEvent(editingItem._id, eventData);
      setEvents(events.map(e => e._id === editingItem._id ? updatedEvent : e));
      setShowEventModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Failed to update event:', err);
      alert('Failed to update event. Please try again.');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        setEvents(events.filter(e => e._id !== id));
      } catch (err) {
        console.error('Failed to delete event:', err);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  const handleProductSubmit = async (productData: Partial<Product>) => {
    if (editingItem) {
      await handleUpdateProduct(productData);
    } else {
      await handleAddProduct(productData);
    }
  };

  const handleEventSubmit = async (eventData: Partial<Event>) => {
    if (editingItem) {
      await handleUpdateEvent(eventData);
    } else {
      await handleAddEvent(eventData);
    }
  };

  const handleEdit = (type: string, item: any) => {
    setEditingItem(item);
    switch (type) {
      case 'product':
        setShowProductModal(true);
        break;
      case 'event':
        setShowEventModal(true);
        break;
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setShowProductModal(false);
    setShowEventModal(false);
  };

  const handleBackClick = () => {
    sessionStorage.setItem('internal-navigation', 'true');
    setLocation("/");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover"
          >
            <source src={schoolVideo} type="video/mp4" />
          </video>
        </div>
        <div className="fixed inset-0 bg-black bg-opacity-50 -z-10"></div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-xl">Loading admin data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover"
          >
            <source src={schoolVideo} type="video/mp4" />
          </video>
        </div>
        <div className="fixed inset-0 bg-black bg-opacity-50 -z-10"></div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-xl text-red-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-white/10 hover:bg-white/20">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Video */}
      <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover"
        >
          <source src={schoolVideo} type="video/mp4" />
        </video>
      </div>

      {/* Overlay to darken the background video */}
      <div className="fixed inset-0 bg-black bg-opacity-50 -z-10"></div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen">
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={handleBackClick}
              className="text-white/90 hover:text-white p-2 mr-4 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>
            <h1 className="font-bold text-2xl md:text-3xl text-white tracking-tight">
              Admin Dashboard (MongoDB)
            </h1>
          </div>

          <p className="text-gray-300 mb-8">Manage school content with MongoDB integration</p>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-gray-300">Products</h3>
                <Package className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">{products.length}</div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-gray-300">Events</h3>
                <Calendar className="h-4 w-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">{events.length}</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-gray-300">Activities</h3>
                <Users className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{clubs.length + athletics.length + arts.length}</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-gray-300">Submissions</h3>
                <FileText className="h-4 w-4 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white">{formSubmissions.length}</div>
            </div>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/5 backdrop-blur-xl border border-white/10">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Products</h2>
                <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
                  <DialogTrigger asChild>
                    <PrimaryButton onClick={() => setEditingItem(null)}>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Product
                    </PrimaryButton>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingItem ? 'Edit Product' : 'Add Product'}</DialogTitle>
                    </DialogHeader>
                    <ProductForm 
                      product={editingItem}
                      onSubmit={handleProductSubmit}
                      onCancel={handleCancelEdit}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-white text-lg font-semibold">{product.name}</h3>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit('product', product)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(product._id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p><strong>Price:</strong> ${product.price}</p>
                      <p><strong>Category:</strong> {product.category}</p>
                      <p><strong>Organization:</strong> {product.organization}</p>
                      <p><strong>Stock:</strong> {product.stock}</p>
                      {product.sizes.length > 0 && (
                        <p><strong>Sizes:</strong> {product.sizes.join(', ')}</p>
                      )}
                      {product.colors.length > 0 && (
                        <p><strong>Colors:</strong> {product.colors.join(', ')}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Events</h2>
                <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
                  <DialogTrigger asChild>
                    <PrimaryButton onClick={() => setEditingItem(null)}>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Event
                    </PrimaryButton>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingItem ? 'Edit Event' : 'Add Event'}</DialogTitle>
                    </DialogHeader>
                    <EventForm 
                      event={editingItem}
                      onSubmit={handleEventSubmit}
                      onCancel={handleCancelEdit}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((event) => (
                  <div key={event._id} className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-white text-lg font-semibold">{event.title}</h3>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit('event', event)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteEvent(event._id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {event.time}</p>
                      <p><strong>Location:</strong> {event.location}</p>
                      <p><strong>Category:</strong> {event.category}</p>
                      {event.price > 0 && <p><strong>Price:</strong> ${event.price}</p>}
                      {event.maxTickets && <p><strong>Max Tickets:</strong> {event.maxTickets}</p>}
                      {event.features.length > 0 && (
                        <p><strong>Features:</strong> {event.features.join(', ')}</p>
                      )}
                      <p><strong>Requires Approval:</strong> {event.requiresApproval ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                  <h3 className="text-white text-lg font-semibold mb-4">Clubs ({clubs.length})</h3>
                  <div className="space-y-2">
                    {clubs.slice(0, 5).map((club) => (
                      <div key={club._id} className="text-sm text-gray-300">
                        {club.name} - {club.memberCount} members
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                  <h3 className="text-white text-lg font-semibold mb-4">Athletics ({athletics.length})</h3>
                  <div className="space-y-2">
                    {athletics.slice(0, 5).map((sport) => (
                      <div key={sport._id} className="text-sm text-gray-300">
                        {sport.sport} - {sport.season}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                  <h3 className="text-white text-lg font-semibold mb-4">Arts ({arts.length})</h3>
                  <div className="space-y-2">
                    {arts.slice(0, 5).map((art) => (
                      <div key={art._id} className="text-sm text-gray-300">
                        {art.program} - {art.type}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                  <h3 className="text-white text-lg font-semibold mb-4">Videos ({videos.length})</h3>
                  <div className="space-y-2">
                    {videos.slice(0, 3).map((video) => (
                      <div key={video._id} className="text-sm text-gray-300">
                        {video.title} - {video.views} views
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                  <h3 className="text-white text-lg font-semibold mb-4">Announcements ({announcements.length})</h3>
                  <div className="space-y-2">
                    {announcements.slice(0, 3).map((announcement) => (
                      <div key={announcement._id} className="text-sm text-gray-300">
                        {announcement.title} - {announcement.priority}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
