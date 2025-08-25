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
import { PlusCircle, Edit, Trash2, Package, Calendar, Info, Video, FileText, Check, X, Eye, BarChart3, Users, Download, Send, DollarSign, TrendingUp, LogOut } from 'lucide-react';
import { ThemedCard, PrimaryButton, SecondaryButton, OutlineButton } from '@/components/ThemedComponents';
import { CommaSeparatedInput } from '@/components/ui/comma-separated-input';
import { AdminAuth } from '@/components/AdminAuth';
import { FileUpload } from '@/components/FileUpload';
import {
  getProducts, createProduct, updateProduct, deleteProduct,
  getEvents, createEvent, updateEvent, deleteEvent,
  getVideos, createVideo, updateVideo, deleteVideo,
  getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement,
  getStudentGovPositions, createStudentGovPosition, updateStudentGovPosition, deleteStudentGovPosition,
  getClubs, createClub, updateClub, deleteClub,
  getFormSubmissions, updateFormSubmission,
  getPurchases,
  Product, Event, VideoPost, Announcement, StudentGovPosition, Club, FormSubmission, Purchase
} from '@/lib/api';

// Simple form components for each data type
function VideoForm({ video, onSubmit, onCancel }: {
  video?: VideoPost;
  onSubmit: (data: Partial<VideoPost>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<VideoPost>>(
    video || {
      title: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: '',
      date: new Date(),
      author: 'Admin',
      category: 'General',
      views: 0,
      featured: false
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Video Title</label>
        <Input
          value={formData.title || ''}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Enter video title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Description</label>
        <Textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Video description"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Video URL</label>
          <Input
            value={formData.videoUrl || ''}
            onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
            placeholder="URL to video"
            required
          />
        </div>
        <div>
          <FileUpload
            value={formData.thumbnailUrl || ''}
            onChange={(url) => setFormData({...formData, thumbnailUrl: url})}
            label="Thumbnail Image"
            fileType="image"
            placeholder="Upload thumbnail image or paste URL"
            maxSizeMB={5}
          />
        </div>
      </div>


      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Author</label>
          <Input
            value={formData.author || ''}
            onChange={(e) => setFormData({...formData, author: e.target.value})}
            placeholder="Video author"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Featured</label>
          <div className="flex items-center mt-3">
            <input 
              type="checkbox" 
              id="featured" 
              checked={!!formData.featured}
              onChange={(e) => setFormData({...formData, featured: e.target.checked})}
              className="h-4 w-4"
            />
            <label htmlFor="featured" className="ml-2 text-sm text-white">Set as featured video</label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="bg-white/10 hover:bg-white/20 text-white border-white/20"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600/20 hover:bg-blue-600/40 backdrop-blur text-blue-200 border border-blue-600/30">Save Video</Button>
      </div>
    </form>
  );
}

function ProductForm({ product, onSubmit, onCancel }: {
  product?: Product;
  onSubmit: (data: Partial<Product>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: '',
      price: 0,
      category: 'Apparel' as 'Apparel' | 'Accessories',
      organization: '',
      sizeStock: [],
      stock: 0,
      image: '',
      images: [],
      description: ''
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addSizeStock = () => {
    setFormData({
      ...formData,
      sizeStock: [...(formData.sizeStock || []), { size: '', stock: 0 }]
    });
  };

  const removeSizeStock = (index: number) => {
    const newSizeStock = [...(formData.sizeStock || [])];
    newSizeStock.splice(index, 1);
    setFormData({ ...formData, sizeStock: newSizeStock });
  };

  const updateSizeStock = (index: number, field: 'size' | 'stock', value: string | number) => {
    const newSizeStock = [...(formData.sizeStock || [])];
    newSizeStock[index] = { ...newSizeStock[index], [field]: value };
    setFormData({ ...formData, sizeStock: newSizeStock });
  };

  const addImage = () => {
    setFormData({
      ...formData,
      images: [...(formData.images || []), '']
    });
  };

  const removeImage = (index: number) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
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
            <label className="block text-sm font-medium text-white mb-2">Category</label>
            <Select
              value={formData.category || 'Apparel'}
              onValueChange={(value: 'Apparel' | 'Accessories') => setFormData({...formData, category: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Apparel">Apparel</SelectItem>
                <SelectItem value="Accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>
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

        {/* Conditional stock fields based on category */}
        {formData.category === 'Apparel' ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-white">Size & Stock</label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addSizeStock}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Size
              </Button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {(formData.sizeStock || []).map((sizeStock, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    placeholder="Size (e.g., S, M, L)"
                    value={sizeStock.size}
                    onChange={(e) => updateSizeStock(index, 'size', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Stock"
                    value={sizeStock.stock}
                    onChange={(e) => updateSizeStock(index, 'stock', parseInt(e.target.value) || 0)}
                    className="w-24"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removeSizeStock(index)}
                    className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-200 border-red-600/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {(formData.sizeStock || []).length === 0 && (
                <p className="text-sm text-gray-400 italic">No sizes added yet. Click "Add Size" to get started.</p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-white mb-2">Stock</label>
            <Input
              type="number"
              value={formData.stock || ''}
              onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
              placeholder="0"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-white mb-2">Description</label>
          <Textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Product description"
            rows={3}
          />
        </div>

        <div>
          <FileUpload
            value={formData.image || ''}
            onChange={(url) => setFormData({...formData, image: url})}
            label="Main Product Image"
            fileType="image"
            placeholder="Upload product image or paste URL"
            maxSizeMB={5}
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-white">Additional Images</label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addImage}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              Add Image
            </Button>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {(formData.images || []).map((image, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1">
                  <FileUpload
                    value={image}
                    onChange={(url) => updateImage(index, url)}
                    label={`Additional Image ${index + 1}`}
                    fileType="image"
                    placeholder="Upload image or paste URL"
                    maxSizeMB={5}
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => removeImage(index)}
                  className="mt-6 p-2 bg-red-600/20 hover:bg-red-600/40 text-red-200 border-red-600/30"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {(formData.images || []).length === 0 && (
              <p className="text-sm text-gray-400 italic">No additional images added yet. Click "Add Image" to get started.</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            type="submit"
            className="bg-blue-600/20 hover:bg-blue-600/40 backdrop-blur text-blue-200 border border-blue-600/30"
          >
            {product ? 'Update Product' : 'Add Product'}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
            className="bg-white/10 hover:bg-white/20 backdrop-blur text-white border-white/20"
          >
            Cancel
          </Button>
        </div>
      </form>
  );
}

function EventForm({ event, onSubmit, onCancel }: {
  event?: Event;
  onSubmit: (data: Partial<Event>) => void;
  onCancel: () => void;
}) {  const [formData, setFormData] = useState<Partial<Event>>(
    event || {
      title: '',
      category: '',
      date: new Date(),
      time: '',
      location: '',
      description: '',
      ticketTypes: [],
      requiresApproval: false,
      requiredForms: {
        studentIdRequired: false,
        customForms: []
      }
    }
  );
  
  const [newCustomForm, setNewCustomForm] = useState({ name: '', pdfUrl: '' });
  const [newTicketType, setNewTicketType] = useState({ name: '', description: '', price: 0, maxTickets: 0 });
  
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
  
  const addCustomForm = () => {
    if (newCustomForm.name.trim() && newCustomForm.pdfUrl.trim() && formData.requiredForms) {
      setFormData({
        ...formData,
        requiredForms: {
          ...formData.requiredForms,
          customForms: [...(formData.requiredForms.customForms || []), { 
            name: newCustomForm.name.trim(), 
            pdfUrl: newCustomForm.pdfUrl.trim() 
          }]
        }
      });
      setNewCustomForm({ name: '', pdfUrl: '' });
    }
  };

  const removeCustomForm = (index: number) => {
    if (formData.requiredForms) {
      setFormData({
        ...formData,
        requiredForms: {
          ...formData.requiredForms,
          customForms: formData.requiredForms.customForms?.filter((_, i) => i !== index) || []
        }
      });
    }
  };
  const updateStudentIdRequired = (value: boolean) => {
    setFormData({
      ...formData,
      requiredForms: {
        studentIdRequired: value,
        customForms: formData.requiredForms?.customForms || []
      }
    });
  };

  const addTicketType = () => {
    if (newTicketType.name.trim() && newTicketType.description.trim() && newTicketType.price > 0 && newTicketType.maxTickets > 0) {
      setFormData({
        ...formData,
        ticketTypes: [...(formData.ticketTypes || []), { 
          name: newTicketType.name.trim(), 
          description: newTicketType.description.trim(),
          price: newTicketType.price,
          maxTickets: newTicketType.maxTickets
        }]
      });
      setNewTicketType({ name: '', description: '', price: 0, maxTickets: 0 });
    }
  };

  const removeTicketType = (index: number) => {
    setFormData({
      ...formData,
      ticketTypes: formData.ticketTypes?.filter((_, i) => i !== index) || []
    });
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


      {/* Ticket Types Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-white">Ticket Types</label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addTicketType}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <PlusCircle className="w-4 h-4 mr-1" />
            Add Ticket Type
          </Button>
        </div>
        
        {/* New Ticket Type Form */}
        <div className="mb-4 p-4 rounded-lg border border-white/20 bg-white/5">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Input
              placeholder="Ticket Type Name (e.g., General Admission)"
              value={newTicketType.name}
              onChange={(e) => setNewTicketType({...newTicketType, name: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Price"
              value={newTicketType.price}
              onChange={(e) => setNewTicketType({...newTicketType, price: parseFloat(e.target.value) || 0})}
              step="0.01"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Description (e.g., Includes dinner and dancing)"
              value={newTicketType.description}
              onChange={(e) => setNewTicketType({...newTicketType, description: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Max Tickets"
              value={newTicketType.maxTickets}
              onChange={(e) => setNewTicketType({...newTicketType, maxTickets: parseInt(e.target.value) || 0})}
            />
          </div>
        </div>

        {/* Existing Ticket Types List */}
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {(formData.ticketTypes || []).map((ticketType, index) => (
            <div key={index} className="flex gap-2 items-center p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex-1 grid grid-cols-4 gap-2 text-sm">
                <div>
                  <p className="font-medium text-white">{ticketType.name}</p>
                </div>
                <div>
                  <p className="text-gray-300">{ticketType.description}</p>
                </div>
                <div>
                  <p className="text-green-400">${ticketType.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-blue-400">{ticketType.maxTickets} tickets</p>
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => removeTicketType(index)}
                className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-200 border-red-600/30"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {(formData.ticketTypes || []).length === 0 && (
            <p className="text-sm text-gray-400 italic">No ticket types added yet. Add ticket types above for multiple pricing options.</p>
          )}
        </div>
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

      {/* Form Requirements Section */}
      {formData.requiresApproval && (
        <div className="border border-white/20 rounded-lg p-4 bg-white/5 space-y-4">
          <h3 className="text-lg font-semibold text-white">Form Requirements</h3>
          
          {/* Student ID Required */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="studentIdRequired"
              checked={formData.requiredForms?.studentIdRequired || false}
              onChange={(e) => updateStudentIdRequired(e.target.checked)}
              className="rounded border-gray-600 bg-gray-700"
            />
            <label htmlFor="studentIdRequired" className="text-sm font-medium text-gray-300">
              Student ID Required
            </label>
          </div>

          {/* Custom Forms Section */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-white mb-2">Required Forms</label>
            
            {/* Add Custom Form */}
            <div className="space-y-4 mb-4">
              <Input
                value={newCustomForm.name}
                onChange={(e) => setNewCustomForm({...newCustomForm, name: e.target.value})}
                placeholder="Form name (e.g., Permission Slip, Medical Form)"
                className="w-full"
              />
              <FileUpload
                value={newCustomForm.pdfUrl}
                onChange={(url) => setNewCustomForm({...newCustomForm, pdfUrl: url})}
                label="Form PDF"
                fileType="pdf"
                placeholder="Upload a PDF form or paste URL"
                maxSizeMB={5}
              />
              <Button 
                type="button" 
                onClick={addCustomForm}
                variant="outline" 
                size="sm"
                className="border-white/20 text-gray-300 hover:bg-white/10"
                disabled={!newCustomForm.name.trim() || !newCustomForm.pdfUrl.trim()}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Form
              </Button>
            </div>

            {/* Custom Forms List */}
            {formData.requiredForms?.customForms && formData.requiredForms.customForms.length > 0 && (
              <div className="space-y-2">
                {formData.requiredForms.customForms.map((form, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{form.name}</p>
                      <a 
                        href={form.pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 break-all"
                      >
                        {form.pdfUrl}
                      </a>
                    </div>
                    <Button
                      type="button"
                      onClick={() => removeCustomForm(index)}
                      variant="destructive"
                      size="sm"
                      className="h-8 w-8 p-0 ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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

function AnnouncementForm({ announcement, onSubmit, onCancel }: {
  announcement?: Announcement;
  onSubmit: (data: Partial<Announcement>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Announcement>>(
    announcement || {
      title: '',
      content: '',
      priority: 'medium'
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Announcement Title</label>
        <Input
          value={formData.title || ''}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Enter announcement title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Content</label>
        <Textarea
          value={formData.content || ''}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          placeholder="Announcement content"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Priority</label>
        <Select value={formData.priority || 'medium'} onValueChange={(value: 'high' | 'medium' | 'low') => setFormData({...formData, priority: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit">
          {announcement ? 'Update Announcement' : 'Add Announcement'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Student Government Form
function StudentGovForm({ member, onSubmit, onCancel }: {
  member?: StudentGovPosition;
  onSubmit: (data: Partial<StudentGovPosition>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<StudentGovPosition>>(
    member || {
      position: '',
      gradeLevel: '',
      description: '',
      currentRepresentatives: []
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addRepresentative = () => {
    setFormData({
      ...formData,
      currentRepresentatives: [
        ...(formData.currentRepresentatives || []),
        { name: '', email: '', bio: '', image: '' }
      ]
    });
  };

  const removeRepresentative = (index: number) => {
    setFormData({
      ...formData,
      currentRepresentatives: formData.currentRepresentatives?.filter((_, i) => i !== index) || []
    });
  };

  const updateRepresentative = (index: number, field: 'name' | 'email' | 'bio' | 'image', value: string) => {
    const updated = [...(formData.currentRepresentatives || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, currentRepresentatives: updated });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Position Title</label>
        <Input
          value={formData.position || ''}
          onChange={(e) => setFormData({...formData, position: e.target.value})}
          placeholder="ASB President, Secretary, etc."
          required
        />
      </div>      <div>
        <label className="block text-sm font-medium text-white mb-2">Grade Level</label>
        <Select value={formData.gradeLevel || ''} onValueChange={(value: string) => setFormData({...formData, gradeLevel: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select grade level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="officer">Officer</SelectItem>
            <SelectItem value="senior">Senior</SelectItem>
            <SelectItem value="junior">Junior</SelectItem>
            <SelectItem value="sophomore">Sophomore</SelectItem>
            <SelectItem value="freshman">Freshman</SelectItem>
            <SelectItem value="committee">Committee</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Description</label>
        <Textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Position description"
          rows={3}
        />
      </div>


      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-white">Current Representatives</label>
          <Button type="button" onClick={addRepresentative} variant="outline" size="sm">
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Representative
          </Button>
        </div>
        
        {formData.currentRepresentatives && formData.currentRepresentatives.length > 0 ? (
          <div className="space-y-3">
            {formData.currentRepresentatives.map((rep, index) => (
              <div key={index} className="border border-white/20 rounded-lg p-3 bg-white/5">
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Name</label>
                    <Input
                      value={rep.name}
                      onChange={(e) => updateRepresentative(index, 'name', e.target.value)}
                      placeholder="Representative name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Email</label>
                    <Input
                      type="email"
                      value={rep.email || ''}
                      onChange={(e) => updateRepresentative(index, 'email', e.target.value)}
                      placeholder="contact@eshs.edu"
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-medium text-gray-300 mb-1">Bio</label>
                  <Textarea
                    value={rep.bio || ''}
                    onChange={(e) => updateRepresentative(index, 'bio', e.target.value)}
                    placeholder="Representative bio"
                    rows={2}
                  />
                </div>
                <div className="mb-2">
                  <FileUpload
                    value={rep.image || ''}
                    onChange={(url) => updateRepresentative(index, 'image', url)}
                    label="Representative Image"
                    fileType="image"
                    placeholder="Upload image or paste URL"
                    maxSizeMB={5}
                  />
                </div>
                <Button 
                  type="button" 
                  onClick={() => removeRepresentative(index)} 
                  variant="destructive" 
                  size="sm"
                  className="h-6 px-2 text-xs"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">No representatives added yet.</p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit">
          {member ? 'Update Position' : 'Add Position'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Club Form
function ClubForm({ club, onSubmit, onCancel }: {
  club?: Club;
  onSubmit: (data: Partial<Club>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Club>>(
    club || {
      name: '',
      description: '',
      advisor: '',
      meetingTime: '',
      location: '',
      category: '',
      contactEmail: '',
      image: '',
      memberCount: 0,
      requirements: [],
      activities: [],
      isActive: true
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Club Name</label>
          <Input
            value={formData.name || ''}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Drama Club"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Category</label>
          <Input
            value={formData.category || ''}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            placeholder="Academic & Social"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Description</label>
        <Textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Club description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Contact Email</label>
          <Input
            type="email"
            value={formData.contactEmail || ''}
            onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
            placeholder="drama@eshs.edu"
          />
        </div>
        <div>
          <FileUpload
            value={formData.image || ''}
            onChange={(url) => setFormData({...formData, image: url})}
            label="Club Image"
            fileType="image"
            placeholder="Upload club image or paste URL"
            maxSizeMB={5}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="clubActive"
          checked={formData.isActive || false}
          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
          className="rounded border-gray-600 bg-gray-700"
        />
        <label htmlFor="clubActive" className="text-sm font-medium text-white">
          Active Club
        </label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit">
          {club ? 'Update Club' : 'Add Club'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}



export default function AdminMongoDB() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // State for managing data
  const [products, setProducts] = useState<Product[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [studentGov, setStudentGov] = useState<StudentGovPosition[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);  // State for modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showStudentGovModal, setShowStudentGovModal] = useState(false);
  const [showClubModal, setShowClubModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Form submissions filtering and search
  const [submissionEventFilter, setSubmissionEventFilter] = useState<string>('all');
  const [submissionSearch, setSubmissionSearch] = useState<string>('');
  const [submissionStatusFilter, setSubmissionStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  
  // Rejection modal states
  const [rejectionSubmissionId, setRejectionSubmissionId] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  
  // Submission detail modal states
  const [showSubmissionDetailModal, setShowSubmissionDetailModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);

  const [, setLocation] = useLocation();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/check-auth', {
          credentials: 'include'
        });
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch (err) {
        console.error('Auth check failed:', err);
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  // Fetch all data on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

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
          formSubmissionsData,
          purchasesData
        ] = await Promise.all([
          getProducts(),
          getEvents(),
          getVideos(),
          getAnnouncements(),
          getStudentGovPositions(),
          getClubs(),
          getFormSubmissions(),
          getPurchases()
        ]);

        setProducts(productsData);
        setEvents(eventsData);
        setVideos(videosData);
        setAnnouncements(announcementsData);
        setStudentGov(studentGovData);
        setClubs(clubsData);
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
  }, [isAuthenticated]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // View submission details handler
  const handleViewSubmissionDetails = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setShowSubmissionDetailModal(true);
  };

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

  const handleAddVideo = async (videoData: Partial<VideoPost>) => {
    try {
      const newVideo = await createVideo(videoData);
      setVideos([...videos, newVideo]);
    } catch (err) {
      console.error('Failed to add video:', err);
      alert('Failed to add video. Please try again.');
    }
  };

  const handleUpdateVideo = async (videoData: Partial<VideoPost>) => {
    if (!editingItem?._id) return;
    
    try {
      const updatedVideo = await updateVideo(editingItem._id, videoData);
      setVideos(videos.map(v => v._id === editingItem._id ? updatedVideo : v));
    } catch (err) {
      console.error('Failed to update video:', err);
      alert('Failed to update video. Please try again.');
    }
  };
  const handleDeleteVideo = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await deleteVideo(id);
        setVideos(videos.filter(v => v._id !== id));
      } catch (err) {
        console.error('Failed to delete video:', err);
        alert('Failed to delete video. Please try again.');
      }
    }  };

  const handleAddAnnouncement = async (announcementData: Partial<Announcement>) => {
    try {
      const newAnnouncement = await createAnnouncement({
        ...announcementData,
        author: 'Admin',
        date: new Date()
      });
      setAnnouncements([...announcements, newAnnouncement]);
      setShowAnnouncementModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Failed to add announcement:', err);
      alert('Failed to add announcement. Please try again.');
    }
  };

  const handleUpdateAnnouncement = async (announcementData: Partial<Announcement>) => {
    if (!editingItem?._id) return;
    
    try {
      const updatedAnnouncement = await updateAnnouncement(editingItem._id, announcementData);
      setAnnouncements(announcements.map(a => a._id === editingItem._id ? updatedAnnouncement : a));
      setShowAnnouncementModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Failed to update announcement:', err);
      alert('Failed to update announcement. Please try again.');
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await deleteAnnouncement(id);
        setAnnouncements(announcements.filter(a => a._id !== id));
      } catch (err) {
        console.error('Failed to delete announcement:', err);
        alert('Failed to delete announcement. Please try again.');
      }
    }
  };
  const handleAnnouncementSubmit = async (announcementData: Partial<Announcement>) => {
    if (editingItem) {
      await handleUpdateAnnouncement(announcementData);
    } else {
      await handleAddAnnouncement(announcementData);
    }
  };

  // Student Government CRUD handlers
  const handleAddStudentGov = async (memberData: Partial<StudentGovPosition>) => {
    try {
      const newPosition = await createStudentGovPosition(memberData);
      setStudentGov([...studentGov, newPosition]);
      setShowStudentGovModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Failed to add student government position:', err);
      alert('Failed to add student government position. Please try again.');
    }
  };

  const handleUpdateStudentGov = async (memberData: Partial<StudentGovPosition>) => {
    if (!editingItem?._id) return;
    
    try {
      const updatedPosition = await updateStudentGovPosition(editingItem._id, memberData);
      setStudentGov(studentGov.map(s => s._id === editingItem._id ? updatedPosition : s));
      setShowStudentGovModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Failed to update student government position:', err);
      alert('Failed to update student government position. Please try again.');
    }
  };

  const handleDeleteStudentGov = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student government position?')) {
      try {
        await deleteStudentGovPosition(id);
        setStudentGov(studentGov.filter(s => s._id !== id));
      } catch (err) {
        console.error('Failed to delete student government position:', err);
        alert('Failed to delete student government position. Please try again.');
      }
    }
  };

  const handleStudentGovSubmit = async (memberData: Partial<StudentGovPosition>) => {
    if (editingItem) {
      await handleUpdateStudentGov(memberData);
    } else {
      await handleAddStudentGov(memberData);
    }
  };

  // Club CRUD handlers
  const handleAddClub = async (clubData: Partial<Club>) => {
    try {
      const newClub = await createClub(clubData);
      setClubs([...clubs, newClub]);
      setShowClubModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Failed to add club:', err);
      alert('Failed to add club. Please try again.');
    }
  };

  const handleUpdateClub = async (clubData: Partial<Club>) => {
    if (!editingItem?._id) return;
    
    try {
      const updatedClub = await updateClub(editingItem._id, clubData);
      setClubs(clubs.map(c => c._id === editingItem._id ? updatedClub : c));
      setShowClubModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Failed to update club:', err);
      alert('Failed to update club. Please try again.');
    }
  };

  const handleDeleteClub = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this club?')) {
      try {
        await deleteClub(id);
        setClubs(clubs.filter(c => c._id !== id));
      } catch (err) {
        console.error('Failed to delete club:', err);
        alert('Failed to delete club. Please try again.');
      }
    }
  };

  const handleClubSubmit = async (clubData: Partial<Club>) => {
    if (editingItem) {
      await handleUpdateClub(clubData);
    } else {
      await handleAddClub(clubData);
    }
  };


  // Filter form submissions based on search and filter criteria
  const filteredFormSubmissions = formSubmissions.filter(submission => {
    // Filter by event
    const eventMatch = submissionEventFilter === 'all' || submission.eventId === submissionEventFilter;
    
    // Filter by status
    const statusMatch = submissionStatusFilter === 'all' || submission.status === submissionStatusFilter;
    
    // Filter by search term (student name)
    const searchMatch = submissionSearch === '' || 
      submission.studentName.toLowerCase().includes(submissionSearch.toLowerCase());
    
    return eventMatch && statusMatch && searchMatch;
  });

  // Send email notification (This would typically be done server-side)
  const sendEmailNotification = async (to: string, subject: string, message: string) => {
    console.log(`Sending email to ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    
    // In a real implementation, this would call an API endpoint to send the email
    // For now, we'll just simulate it with a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { success: true };
  };

  const handleApproveSubmission = async (id: string) => {
    try {
      const submission = formSubmissions.find(s => s._id === id);
      if (!submission) {
        throw new Error('Submission not found');
      }
      
      // Get the event details for the email
      const event = events.find(e => e._id === submission.eventId);
      
      // Update the submission status
      await updateFormSubmission(id, { 
        status: 'approved', 
        reviewedAt: new Date(), 
        reviewedBy: 'Admin' 
      });
      
      // Update local state
      setFormSubmissions(formSubmissions.map(s => 
        s._id === id ? { ...s, status: 'approved', reviewedAt: new Date(), reviewedBy: 'Admin' } : s
      ));
      
      // Send email notification
      if (event) {
        const emailSubject = `Your Request for ${event.title} has been Approved`;
        const emailMessage = `
Dear ${submission.studentName},

Great news! Your request to attend ${event.title} has been approved.

Event Details:
- Date: ${new Date(event.date).toLocaleDateString()}
- Time: ${event.time}
- Location: ${event.location}

You can now proceed to make your payment for ${submission.quantity} ticket(s) at $${event.price.toFixed(2)} each.
Total Amount: $${(submission.quantity * event.price).toFixed(2)}

Please proceed to the payment section on our website to complete your purchase.

Thank you,
ESHS ASB Team
        `;
        
        await sendEmailNotification(submission.email, emailSubject, emailMessage);
      }
    } catch (err) {
      console.error('Failed to approve submission:', err);
      alert('Failed to approve submission. Please try again.');
    }
  };
  const handleRejectSubmission = async (id: string) => {
    try {
      const submission = formSubmissions.find(s => s._id === id);
      if (!submission) {
        throw new Error('Submission not found');
      }
      
      // Get the event details for the email
      const event = events.find(e => e._id === submission.eventId);
      
      // Update the submission status
      await updateFormSubmission(id, { 
        status: 'rejected', 
        reviewedAt: new Date(), 
        reviewedBy: 'Admin' 
      });
      
      // Update local state
      setFormSubmissions(formSubmissions.map(s => 
        s._id === id ? { ...s, status: 'rejected', reviewedAt: new Date(), reviewedBy: 'Admin' } : s
      ));
      
      // Send email notification
      if (event) {
        const emailSubject = `Your Request for ${event.title} has been Declined`;
        const emailMessage = `
Dear ${submission.studentName},

We regret to inform you that your request to attend ${event.title} has been declined.

If you would like more information about this decision, please contact the ASB office.

Thank you,
ESHS ASB Team
        `;
        
        await sendEmailNotification(submission.email, emailSubject, emailMessage);
      }
    } catch (err) {
      console.error('Failed to reject submission:', err);
      alert('Failed to reject submission. Please try again.');
    }
  };

  const handleRejectWithReason = (submissionId: string) => {
    setRejectionSubmissionId(submissionId);
    setRejectionReason('');
    setShowRejectionModal(true);
  };

  const confirmRejection = async () => {
    if (!rejectionReason.trim()) return;
    
    try {
      const submission = formSubmissions.find(s => s._id === rejectionSubmissionId);
      if (!submission) {
        throw new Error('Submission not found');
      }
      
      // Get the event details for the email
      const event = events.find(e => e._id === submission.eventId);
      
      // Update the submission status with rejection reason
      await updateFormSubmission(rejectionSubmissionId, { 
        status: 'rejected', 
        reviewedAt: new Date(), 
        reviewedBy: 'Admin',
        notes: rejectionReason
      });
      
      // Update local state
      setFormSubmissions(formSubmissions.map(s => 
        s._id === rejectionSubmissionId ? { 
          ...s, 
          status: 'rejected', 
          reviewedAt: new Date(), 
          reviewedBy: 'Admin',
          notes: rejectionReason
        } : s
      ));
      
      // Send email notification with reason
      if (event) {
        const emailSubject = `Your Request for ${event.title} has been Declined`;
        const emailMessage = `
Dear ${submission.studentName},

We regret to inform you that your request to attend ${event.title} has been declined.

Reason: ${rejectionReason}

If you would like more information about this decision, please contact the ASB office.

Thank you,
ESHS ASB Team
        `;
        
        await sendEmailNotification(submission.email, emailSubject, emailMessage);
      }

      // Close modal and reset states
      setShowRejectionModal(false);
      setRejectionSubmissionId('');
      setRejectionReason('');
    } catch (err) {
      console.error('Failed to reject submission:', err);
      alert('Failed to reject submission. Please try again.');
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
      case 'video':
        // Add logic for showing video edit modal
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
  // Product form submission handler
  const handleProductSubmit = async (productData: Partial<Product>) => {
    try {
      if (editingItem) {
        // Update existing product
        await handleUpdateProduct(productData);
      } else {
        // Create new product
        await handleAddProduct(productData);
      }
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Failed to save product. Please try again.');
    }
  };
  
  // Event form submission handler
  const handleEventSubmit = async (eventData: Partial<Event>) => {
    try {
      if (editingItem) {
        // Update existing event
        await handleUpdateEvent(eventData);
      } else {
        // Create new event
        await handleAddEvent(eventData);
      }
    } catch (err) {
      console.error('Failed to save event:', err);
      alert('Failed to save event. Please try again.');
    }
  };
  
  // Video form submission handler
  const handleVideoSubmit = async (videoData: Partial<VideoPost>) => {
    try {
      if (editingItem) {
        // Update existing video
        await handleUpdateVideo(videoData);
      } else {
        // Create new video
        await handleAddVideo(videoData);
      }
    } catch (err) {
      console.error('Failed to save video:', err);
      alert('Failed to save video. Please try again.');
    }
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
        <div className="fixed inset-0 bg-black bg-opacity-60 -z-10"></div>
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
        <div className="fixed inset-0 bg-black bg-opacity-60 -z-10"></div>
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

  // Show loading state while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-white">Checking authentication...</div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />;
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
      <div className="fixed inset-0 bg-black bg-opacity-60 -z-10"></div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen">
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={handleBackClick}
                className="text-white/90 hover:text-white p-2 mr-4 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
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
                <span>Back</span>
              </Button>
              <h1 className="font-bold text-2xl md:text-3xl text-white tracking-tight">
                Admin Dashboard
              </h1>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-white/90 hover:text-white p-2 bg-red-500/20 backdrop-blur-xl border border-red-500/30 shadow-2xl rounded-lg hover:bg-red-500/30 transition-all duration-300 flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
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
              <div className="text-2xl font-bold text-white">{clubs.length}</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-gray-300">Submissions</h3>
                <FileText className="h-4 w-4 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white">{formSubmissions.length}</div>
            </div>
          </div>          {/* Main Tabs */}
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-white/5 backdrop-blur-xl border border-white/10">
              <TabsTrigger value="products" className="text-white">Merch</TabsTrigger>
              <TabsTrigger value="events" className="text-white">Activities</TabsTrigger>
              <TabsTrigger value="submissions" className="text-white">Form Submissions</TabsTrigger>
              <TabsTrigger value="information" className="text-white">Information</TabsTrigger>
              <TabsTrigger value="birds-eye-view" className="text-white">Birds Eye View</TabsTrigger>
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
                  <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-white">{editingItem ? 'Edit Product' : 'Add Product'}</DialogTitle>
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
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteProduct(product._id)}
                          className="bg-red-600/20 hover:bg-red-600/40 text-red-200 border-red-600/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p><strong>Price:</strong> ${product.price}</p>
                      <p><strong>Category:</strong> {product.category}</p>
                      <p><strong>Organization:</strong> {product.organization}</p>
                      
                      {/* Display stock based on category */}
                      {product.category === 'Apparel' ? (
                        <div>
                          <p><strong>Size & Stock:</strong></p>
                          {product.sizeStock && product.sizeStock.length > 0 ? (
                            <div className="ml-4 text-sm">
                              {product.sizeStock.map((item, idx) => (
                                <span key={idx} className="inline-block mr-3">
                                  {item.size}: {item.stock}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 ml-4">No sizes configured</span>
                          )}
                        </div>
                      ) : (
                        <p><strong>Stock:</strong> {product.stock}</p>
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
                  <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-white">{editingItem ? 'Edit Event' : 'Add Event'}</DialogTitle>
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
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteEvent(event._id)}
                          className="bg-red-600/20 hover:bg-red-600/40 text-red-200 border-red-600/30"
                        >
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
            </TabsContent>            {/* Form Submissions Tab */}
            <TabsContent value="submissions" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Form Submissions</h2>                <div className="flex gap-3">
                  <Badge variant="outline" className="bg-yellow-600/20 border-yellow-600/30 text-yellow-200 text-xs px-2 py-1">
                    Pending: {filteredFormSubmissions.filter(sub => sub.status === 'pending').length}
                  </Badge>
                  <Badge variant="outline" className="bg-green-600/20 border-green-600/30 text-green-200 text-xs px-2 py-1">
                    Approved: {filteredFormSubmissions.filter(sub => sub.status === 'approved').length}
                  </Badge>
                  <Badge variant="outline" className="bg-red-600/20 border-red-600/30 text-red-200 text-xs px-2 py-1">
                    Rejected: {filteredFormSubmissions.filter(sub => sub.status === 'rejected').length}
                  </Badge>
                </div>
              </div>

              {/* Filter and Search Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Event</label>
                  <Select value={submissionEventFilter} onValueChange={setSubmissionEventFilter}>
                    <SelectTrigger className="bg-white/5 backdrop-blur-xl border border-white/10 text-white shadow-lg">
                      <SelectValue placeholder="All Events" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      {events.map((event) => (
                        <SelectItem key={event._id} value={event._id}>
                          {event.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Status</label>
                  <Select value={submissionStatusFilter} onValueChange={(value: 'all' | 'pending' | 'approved' | 'rejected') => setSubmissionStatusFilter(value)}>
                    <SelectTrigger className="bg-white/5 backdrop-blur-xl border border-white/10 text-white shadow-lg">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Search by Name</label>
                  <Input
                    type="text"
                    placeholder="Search by student name..."
                    value={submissionSearch}
                    onChange={(e) => setSubmissionSearch(e.target.value)}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder-gray-400 shadow-lg"
                  />
                </div>
              </div>
              
              {/* Pending Approvals */}
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-yellow-400" /> 
                    Pending Approvals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">                    {filteredFormSubmissions.filter(submission => submission.status === 'pending').map((submission) => {
                      // Handle both populated and non-populated eventId
                      const eventIdStr = typeof submission.eventId === 'object' && submission.eventId ? 
                        (submission.eventId as any)._id : submission.eventId;
                      const relatedEvent = events.find(e => e._id === eventIdStr) || 
                        (typeof submission.eventId === 'object' ? submission.eventId as any : null);
                      
                      return (
                        <div key={submission._id} className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-white font-semibold text-lg">{submission.studentName}</h4>
                              <p className="text-sm text-gray-400">{submission.email}</p>
                            </div>
                            <Badge className="bg-yellow-600/20 border-yellow-600 text-yellow-200">
                              {submission.status}
                            </Badge>
                          </div>
                          
                          {relatedEvent && (
                            <div className="bg-white/10 rounded-lg p-2 mb-3">
                              <p className="text-white font-medium">{relatedEvent.title}</p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-gray-300">
                                <span>{new Date(relatedEvent.date).toLocaleDateString()}</span>
                                <span>{relatedEvent.time}</span>
                                <span>{relatedEvent.location}</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-200">
                              Quantity: {submission.quantity}
                            </Badge>
                            <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-200">
                              Total: ${submission.totalAmount.toFixed(2)}
                            </Badge>
                            <Badge variant="outline" className="bg-gray-500/20 border-gray-500/30 text-gray-200">
                              Submitted: {new Date(submission.submissionDate).toLocaleDateString()}
                            </Badge>
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-sm font-medium text-white mb-1">Uploaded Forms:</p>
                            <div className="flex flex-wrap gap-2">
                              {submission.forms.map((form, index) => (
                                <div key={index} className="flex items-center bg-white/10 px-3 py-1 rounded-full text-xs text-white">
                                  <FileText className="w-3 h-3 mr-1" />
                                  {form.fileName}
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-5 w-5 p-0 ml-1 text-blue-300 hover:text-blue-100"
                                    onClick={() => window.open(form.fileUrl, '_blank')}
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {submission.notes && (
                            <div className="bg-white/5 rounded p-2 mb-3">
                              <p className="text-xs text-gray-400">Notes:</p>
                              <p className="text-sm text-white">{submission.notes}</p>
                            </div>
                          )}
                          
                          <div className="mt-3 flex justify-end space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-green-600/20 hover:bg-green-600 text-green-200 hover:text-white border-green-600/30"
                              onClick={() => handleApproveSubmission(submission._id)}
                            >
                              <Check className="w-4 h-4 mr-1" /> Approve
                            </Button>                            <Button 
                              size="sm" 
                              variant="outline"
                              className="bg-red-600/20 hover:bg-red-600 text-red-200 hover:text-white border-red-600/30"
                              onClick={() => handleRejectWithReason(submission._id)}
                            >
                              <X className="w-4 h-4 mr-1" /> Reject
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    
                    {formSubmissions.filter(submission => submission.status === 'pending').length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-30" />
                        <p className="text-lg">No pending submissions</p>
                        <p className="text-sm mt-2">All form submissions have been reviewed</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Processed Submissions */}
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-400" /> 
                    Processed Submissions
                  </CardTitle>
                </CardHeader>
                <CardContent>                  <div className="space-y-4">                    {filteredFormSubmissions.filter(submission => submission.status !== 'pending')
                      .slice(0, 5) // Show only the most recent 5 processed submissions
                      .map((submission) => {
                        // Handle both populated and non-populated eventId
                        const eventIdStr = typeof submission.eventId === 'object' && submission.eventId ? 
                          (submission.eventId as any)._id : submission.eventId;
                        const relatedEvent = events.find(e => e._id === eventIdStr) || 
                          (typeof submission.eventId === 'object' ? submission.eventId as any : null);
                        const statusColor = submission.status === 'approved'
                          ? "bg-green-600/20 border-green-600 text-green-200" 
                          : "bg-red-600/20 border-red-600 text-red-200";
                        
                        return (
                          <div key={submission._id} className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-white font-semibold">{submission.studentName}</h4>
                                <p className="text-sm text-gray-400">
                                  {relatedEvent?.title || 'Unknown Event'}
                                </p>
                                <div className="flex gap-2 mt-1">
                                  <p className="text-xs text-gray-400">
                                    Submitted: {new Date(submission.submissionDate).toLocaleDateString()}
                                  </p>
                                  {submission.reviewedAt && (
                                    <p className="text-xs text-gray-400">
                                      Reviewed: {new Date(submission.reviewedAt).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <Badge className={statusColor}>
                                {submission.status}
                              </Badge>
                            </div>
                            
                            {/* Display uploaded forms for processed submissions */}
                            {submission.forms && submission.forms.length > 0 && (
                              <div className="mt-3">
                                <p className="text-xs font-medium text-white mb-1">Uploaded Forms:</p>
                                <div className="flex flex-wrap gap-2">
                                  {submission.forms.map((form, index) => (
                                    <div key={index} className="flex items-center bg-white/10 px-2 py-1 rounded-full text-xs text-white">
                                      <FileText className="w-3 h-3 mr-1" />
                                      <span className="truncate max-w-[100px]">{form.fileName}</span>
                                      <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        className="h-4 w-4 p-0 ml-1 text-blue-300 hover:text-blue-100"
                                        onClick={() => window.open(form.fileUrl, '_blank')}
                                      >
                                        <Eye className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="mt-2 flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="text-xs text-blue-300 hover:text-blue-100 p-1 h-auto"
                                onClick={() => handleViewSubmissionDetails(submission)}
                              >
                                <Eye className="w-3 h-3 mr-1" /> 
                                View Details
                              </Button>
                              
                              {submission.status === 'approved' && (
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="text-xs text-blue-300 hover:text-blue-100 p-1 h-auto"
                                  onClick={() => {
                                    // In a real app, this would send a reminder email
                                    sendEmailNotification(
                                      submission.email,
                                      `Reminder: Your approved registration for ${relatedEvent?.title || 'event'}`,
                                      `Dear ${submission.studentName}, this is a reminder that your registration for ${relatedEvent?.title || 'the event'} has been approved. Please complete your payment if you haven't already.`
                                    );
                                    alert('Reminder email sent!');
                                  }}
                                >
                                  <Send className="w-3 h-3 mr-1" /> 
                                  Send Reminder
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                    })}
                      {filteredFormSubmissions.filter(submission => submission.status !== 'pending').length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-30" />
                        <p>No processed submissions yet</p>
                      </div>
                    )}
                    
                    {filteredFormSubmissions.filter(submission => submission.status !== 'pending').length > 5 && (
                      <div className="flex justify-center mt-4">
                        <Button 
                          variant="ghost"
                          className="text-blue-300 hover:text-blue-100"
                          onClick={() => {
                            // In a real app, this would show all processed submissions in a modal or new page
                            alert('View all processed submissions');
                          }}
                        >
                          View All ({filteredFormSubmissions.filter(submission => submission.status !== 'pending').length})
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Information Tab */}
            <TabsContent value="information" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">                {/* Student Government */}
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white">Student Government</CardTitle>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingItem(null);
                          setShowStudentGovModal(true);
                        }}
                      >
                        <PlusCircle className="w-4 h-4 mr-1" /> Add
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {studentGov.slice(0, 4).map((position) => (
                        <div key={position._id} className="flex justify-between items-center">
                          <div>
                            <h4 className="text-white font-semibold">{position.position}</h4>
                            <p className="text-sm text-gray-400">{position.gradeLevel}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setEditingItem(position);
                                setShowStudentGovModal(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleDeleteStudentGov(position._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                  {/* Clubs */}
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white">Clubs</CardTitle>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingItem(null);
                          setShowClubModal(true);
                        }}
                      >
                        <PlusCircle className="w-4 h-4 mr-1" /> Add
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {clubs.slice(0, 4).map((club) => (
                        <div key={club._id} className="flex justify-between items-center">
                          <div>
                            <h4 className="text-white font-semibold">{club.name}</h4>
                            <p className="text-sm text-gray-400">{club.category}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setEditingItem(club);
                                setShowClubModal(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleDeleteClub(club._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Announcements Management */}
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">Announcements</CardTitle>
                    <Dialog open={showAnnouncementModal} onOpenChange={setShowAnnouncementModal}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setEditingItem(null)}>
                          <PlusCircle className="w-4 h-4 mr-1" /> Add Announcement
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-white">{editingItem ? 'Edit Announcement' : 'Add Announcement'}</DialogTitle>
                        </DialogHeader>
                        <AnnouncementForm 
                          announcement={editingItem}
                          onSubmit={handleAnnouncementSubmit}
                          onCancel={() => {
                            setEditingItem(null);
                            setShowAnnouncementModal(false);
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {announcements.map((announcement) => (
                      <div key={announcement._id} className="flex justify-between items-start p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-sm">{announcement.title}</h4>
                          <p className="text-gray-400 text-xs mt-1">
                            {announcement.content.length > 80 
                              ? `${announcement.content.substring(0, 80)}...` 
                              : announcement.content}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className={`text-xs px-2 py-1 ${
                              announcement.priority === 'high' ? 'bg-red-600/20 border-red-600/30 text-red-200' :
                              announcement.priority === 'medium' ? 'bg-yellow-600/20 border-yellow-600/30 text-yellow-200' :
                              'bg-green-600/20 border-green-600/30 text-green-200'
                            }`}>
                              {announcement.priority}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {new Date(announcement.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setEditingItem(announcement);
                              setShowAnnouncementModal(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleDeleteAnnouncement(announcement._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {announcements.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <Info className="w-12 h-12 mx-auto mb-2 text-gray-500 opacity-30" />
                        <p className="text-sm">No announcements yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
              {/* Birds Eye View Tab */}
            <TabsContent value="birds-eye-view" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Birds Eye View Videos</h2>
                <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
                  <DialogTrigger asChild>
                    <PrimaryButton onClick={() => setEditingItem(null)}>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Video
                    </PrimaryButton>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-white">{editingItem ? 'Edit Video' : 'Add New Video'}</DialogTitle>
                    </DialogHeader>
                    <VideoForm
                      video={editingItem}
                      onSubmit={handleVideoSubmit}
                      onCancel={() => {
                        setEditingItem(null);
                        setShowVideoModal(false);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <div key={video._id} className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl overflow-hidden">
                    <div className="aspect-video relative">
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Button 
                          variant="outline" 
                          className="rounded-full"
                          onClick={() => {
                            // Create a modal with embedded YouTube video
                            const modal = document.createElement('div');
                            modal.className = 'fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4';
                            modal.onclick = (e) => {
                              if (e.target === modal) {
                                document.body.removeChild(modal);
                              }
                            };
                            
                            // Convert YouTube watch URL to embed URL if needed
                            let embedUrl = video.videoUrl;
                            if (embedUrl.includes('youtube.com/watch')) {
                              const videoId = embedUrl.split('v=')[1]?.split('&')[0];
                              embedUrl = `https://www.youtube.com/embed/${videoId}`;
                            } else if (embedUrl.includes('youtu.be/')) {
                              const videoId = embedUrl.split('youtu.be/')[1]?.split('?')[0];
                              embedUrl = `https://www.youtube.com/embed/${videoId}`;
                            }
                            
                            modal.innerHTML = `
                              <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden max-w-4xl w-full">
                                <div class="flex justify-between items-center p-4 border-b border-white/20">
                                  <h3 class="text-white text-lg font-semibold">${video.title}</h3>
                                  <button onclick="document.body.removeChild(this.closest('.fixed'))" class="text-white/60 hover:text-white text-2xl">&times;</button>
                                </div>
                                <div class="aspect-video">
                                  <iframe 
                                    src="${embedUrl}" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen
                                    class="w-full h-full"
                                  ></iframe>
                                </div>
                              </div>
                            `;
                            
                            document.body.appendChild(modal);
                          }}
                        >
                          <Eye className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white text-lg font-semibold">{video.title}</h3>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              setEditingItem(video);
                              setShowVideoModal(true);
                            }} 
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteVideo(video._id)} className="h-8 w-8 p-0">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400 mb-2">
                        {video.description.length > 60 
                          ? `${video.description.substring(0, 60)}...` 
                          : video.description}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge>{video.category}</Badge>
                          {video.featured && <Badge variant="secondary">Featured</Badge>}
                        </div>
                        <span className="text-sm text-gray-400">{video.views} views</span>
                      </div>
                    </div>
                  </div>
                ))}
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
              </div>            </TabsContent>
          </Tabs>
        </main>
      </div>
        {/* Form Rejection Modal */}
      <Dialog open={showRejectionModal} onOpenChange={setShowRejectionModal}>
        <DialogContent className="max-w-md bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Reject Form Submission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Please provide a reason for rejecting this form submission:
            </p>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
            />
            <div className="flex gap-3 justify-end">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                  setRejectionSubmissionId('');
                }}
              >
                Cancel
              </Button>
              <Button 
                type="button"
                variant="destructive"
                onClick={confirmRejection}
                disabled={!rejectionReason.trim()}
                className="bg-red-600/20 hover:bg-red-600/40 text-red-200 border-red-600/30"
              >
                <X className="h-4 w-4 mr-1" />
                Reject Submission
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Submission Detail Modal */}
      <Dialog open={showSubmissionDetailModal} onOpenChange={setShowSubmissionDetailModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Submission Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-6 text-white">
              {/* Student Information */}
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Student Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-300">Name:</label>
                    <p className="text-white font-medium">{selectedSubmission.studentName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-300">Email:</label>
                    <p className="text-white">{selectedSubmission.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-300">Status:</label>
                    <Badge className={
                      selectedSubmission.status === 'approved' 
                        ? "bg-green-600/20 border-green-600 text-green-200"
                        : selectedSubmission.status === 'rejected'
                        ? "bg-red-600/20 border-red-600 text-red-200"
                        : "bg-yellow-600/20 border-yellow-600 text-yellow-200"
                    }>
                      {selectedSubmission.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm text-gray-300">Submission Date:</label>
                    <p className="text-white">{new Date(selectedSubmission.submissionDate).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Event Information */}
              {(() => {
                const eventIdStr = typeof selectedSubmission.eventId === 'object' && selectedSubmission.eventId ? 
                  (selectedSubmission.eventId as any)._id : selectedSubmission.eventId;
                const relatedEvent = events.find(e => e._id === eventIdStr) || 
                  (typeof selectedSubmission.eventId === 'object' ? selectedSubmission.eventId as any : null);
                
                return relatedEvent && (
                  <div className="bg-white/10 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3">Event Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-300">Event:</label>
                        <p className="text-white font-medium">{relatedEvent.title}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-300">Date:</label>
                        <p className="text-white">{new Date(relatedEvent.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-300">Time:</label>
                        <p className="text-white">{relatedEvent.time}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-300">Location:</label>
                        <p className="text-white">{relatedEvent.location}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Registration Details */}
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Registration Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-300">Quantity:</label>
                    <p className="text-white font-medium">{selectedSubmission.quantity}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-300">Total Amount:</label>
                    <p className="text-white font-medium">${selectedSubmission.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-300">Payment Status:</label>
                    <p className="text-white">Pending</p>
                  </div>
                </div>
              </div>

              {/* Uploaded Forms */}
              {selectedSubmission.forms && selectedSubmission.forms.length > 0 && (
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Uploaded Forms</h3>
                  <div className="space-y-2">
                    {selectedSubmission.forms.map((form, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-blue-400" />
                          <span className="text-white">{form.fileName}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(form.fileUrl, '_blank')}
                          className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-200 border-blue-600/30"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedSubmission.notes && (
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Additional Notes</h3>
                  <p className="text-white">{selectedSubmission.notes}</p>
                </div>
              )}

              {/* Rejection Reason */}
              {selectedSubmission.status === 'rejected' && selectedSubmission.rejectionReason && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-red-200">Rejection Reason</h3>
                  <p className="text-red-100">{selectedSubmission.rejectionReason}</p>
                </div>
              )}

              {/* Review Information */}
              {selectedSubmission.reviewedAt && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Review Information</h3>
                  <p className="text-gray-300">
                    Reviewed on: {new Date(selectedSubmission.reviewedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Student Government Modal */}
      <Dialog open={showStudentGovModal} onOpenChange={setShowStudentGovModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">{editingItem ? 'Edit Position' : 'Add Position'}</DialogTitle>
          </DialogHeader>
          <StudentGovForm 
            member={editingItem}
            onSubmit={handleStudentGovSubmit}
            onCancel={() => {
              setEditingItem(null);
              setShowStudentGovModal(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Club Modal */}
      <Dialog open={showClubModal} onOpenChange={setShowClubModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">{editingItem ? 'Edit Club' : 'Add Club'}</DialogTitle>
          </DialogHeader>
          <ClubForm 
            club={editingItem}
            onSubmit={handleClubSubmit}
            onCancel={() => {
              setEditingItem(null);
              setShowClubModal(false);
            }}
          />
        </DialogContent>
      </Dialog>

    </div>
  );
}
