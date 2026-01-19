import { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createRaffleItem, getAllRaffleItems, updateRaffleItem, deleteRaffleItem } from '@/services/api';

interface ItemForm {
  id: string; // This is a frontend ID (UUID)
  _id?: string; // This is the backend database ID (if exists)
  name: string;
  quantity: number;
  itemPic: string;
  file: File | null;
  isDeleted?: boolean;
}

export default function ItemsPage() {
  const [items, setItems] = useState<ItemForm[]>([
     { id: crypto.randomUUID(), name: '', quantity: 1, itemPic: '', file: null }
  ]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch existing items on load
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setInitialLoading(true);
      const res = await getAllRaffleItems();
      if (res.success && res.data && res.data.length > 0) {
        const mappedItems: ItemForm[] = res.data.map(item => ({
          id: crypto.randomUUID(),
          _id: item._id,
          name: item.name,
          quantity: item.quantity,
          itemPic: item.itemPic || '',
          file: null
        }));
        setItems(mappedItems);
      } else {
        // If no items, keep the empty default one
         setItems([{ id: crypto.randomUUID(), name: '', quantity: 1, itemPic: '', file: null }]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load items.');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: crypto.randomUUID(), name: '', quantity: 1, itemPic: '', file: null }
    ]);
  };

  const handleRemoveItem = async (id: string, _id?: string) => {
    if (_id) {
       // If it has a real ID, we shouldn't just remove it from state immediately if we want to batch save,
       // BUT usually users expect 'delete' button to work immediately or upon save. 
       // For better UX in a "Manage" page, let's delete immediately with confirmation.
       if (!confirm('Are you sure you want to delete this item?')) return;
       
       try {
         await deleteRaffleItem(_id);
         setItems(items.filter(item => item.id !== id));
         setSuccess('Item deleted.');
       } catch (err) {
         setError('Failed to delete item.');
       }
    } else {
      // Just a local unsaved item
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleUpdateItem = (id: string, field: keyof ItemForm, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleFileChange = async (id: string, file: File) => {
    if (!file) return;

    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, file, itemPic: reader.result as string } : item
      ));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Validate
    const invalid = items.some(item => !item.name || item.quantity <= 0);
    if (invalid) {
      setError('Please fill in all names and ensure quantities are greater than 0.');
      setLoading(false);
      return;
    }

    try {
      let successCount = 0;
      let updateCount = 0;

      for (const item of items) {
        if (item._id) {
          // Update existing
           const res = await updateRaffleItem(item._id, {
            name: item.name,
            quantity: item.quantity,
            itemPic: item.itemPic
          });
          if (res.success) updateCount++;
        } else {
          // Create new
          const res = await createRaffleItem({
            name: item.name,
            quantity: item.quantity,
            itemPic: item.itemPic
          });
          if (res.success) {
            successCount++;
            // Update local state to include the new _id (optional, but good practice to prevent duplicate creates if clicked again)
             // Ideally we should re-fetch or update the specific item state
          }
        }
      }
      
      setSuccess(`Saved! Updated: ${updateCount}, Created: ${successCount}`);
      // Refresh to get fresh IDs
      await fetchItems();
    } catch (err) {
      setError('Failed to save some items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Manage Items</h1>
          <p className="text-slate-500">Add, edit, or remove raffle items.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
            <div className="text-2xl font-bold text-indigo-600">{items.length}</div>
            <div className="text-xs text-slate-500 font-semibold uppercase">Total Types</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {items.reduce((acc, curr) => acc + (curr.quantity || 0), 0)}
            </div>
            <div className="text-xs text-slate-500 font-semibold uppercase">Total Quantity</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-50 text-green-600 rounded-lg text-sm font-medium">
              {success}
            </div>
          )}

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start p-4 bg-slate-50 rounded-lg border border-slate-100 animate-in fade-in slide-in-from-bottom-2">
                <div className="md:col-span-1 flex items-center justify-center pt-3 text-slate-400 font-bold">
                  {index + 1}
                </div>
                
                <div className="md:col-span-5 space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Item Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Mechanical Keyboard"
                    className="w-full px-3 py-2 bg-white border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={item.name}
                    onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Qty</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 bg-white border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={item.quantity}
                    onChange={(e) => handleUpdateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="md:col-span-3 space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                   Image <span className="text-[10px] lowercase font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id={`file-${item.id}`}
                      onChange={(e) => e.target.files?.[0] && handleFileChange(item.id, e.target.files[0])}
                    />
                    <label 
                      htmlFor={`file-${item.id}`}
                      className="flex items-center gap-2 w-full px-3 py-2 bg-white border border-dashed rounded-md text-sm text-slate-500 cursor-pointer hover:bg-slate-50 transition-colors truncate"
                    >
                      <Upload className="w-4 h-4" />
                      {item.file ? <span className="truncate">{item.file.name}</span> : 'Upload'}
                    </label>
                  </div>
                  {item.itemPic && (
                    <div className="mt-2">
                      <img src={item.itemPic} alt="Preview" className="w-16 h-16 object-cover rounded-md border" />
                    </div>
                  )}
                </div>

                <div className="md:col-span-1 pt-6 flex justify-end">
                  <Button
                    variant="ghost" 
                    size="icon"
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                    onClick={() => handleRemoveItem(item.id, item._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleAddItem}
              className="border-dashed border-2 hover:bg-slate-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Item
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[150px]"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save All Items
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
