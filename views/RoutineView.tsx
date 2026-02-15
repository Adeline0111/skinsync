
import React, { useState, useMemo } from 'react';
import { UserProfile, Product, RoutineLog } from '../types';
import { db } from '../services/storageService';
import { Button, Input, Card, Badge } from '../components/UI';

const RoutineView: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'morning' | 'night'>('morning');
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', brand: '', type: 'cleanser' as any });

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const products = useMemo(() => db.getUserProducts(user.id), [user.id, refreshTrigger]);
  const logs = useMemo(() => db.getRoutineLogs(user.id), [user.id, refreshTrigger]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = useMemo(() => logs.find(l => l.date === todayStr) || {
    date: todayStr,
    morningCompleted: false,
    nightCompleted: false,
    completedProducts: []
  }, [logs, todayStr]);

  const filteredProducts = products.filter(p => activeTab === 'morning' ? p.isMorning : p.isNight);

  const handleAddProduct = () => {
    if (!newProduct.name) return;
    const p: Product = {
      id: Math.random().toString(36).substring(7),
      ...newProduct,
      isMorning: activeTab === 'morning',
      isNight: activeTab === 'night'
    };
    db.saveProduct(user.id, p);
    setNewProduct({ name: '', brand: '', type: 'cleanser' });
    setShowAdd(false);
    setRefreshTrigger(v => v + 1);
  };

  const toggleProductUsage = (productId: string) => {
    const isCompleted = todayLog.completedProducts.includes(productId);
    const updatedLog: RoutineLog = {
      ...todayLog,
      completedProducts: isCompleted 
        ? todayLog.completedProducts.filter(id => id !== productId)
        : [...todayLog.completedProducts, productId]
    };
    
    // Check if whole routine is complete
    const currentRoutineProducts = products.filter(p => activeTab === 'morning' ? p.isMorning : p.isNight);
    const routineFullyDone = currentRoutineProducts.every(p => updatedLog.completedProducts.includes(p.id));
    
    if (activeTab === 'morning') updatedLog.morningCompleted = routineFullyDone;
    else updatedLog.nightCompleted = routineFullyDone;

    db.saveRoutineLog(user.id, updatedLog);
    setRefreshTrigger(v => v + 1);
  };

  const deleteProduct = (id: string) => {
    db.deleteProduct(user.id, id);
    setRefreshTrigger(v => v + 1);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <header>
        <h1 className="text-3xl font-serif text-white">Your Routine</h1>
        <p className="text-gray-400 text-sm mt-1">Consistency is key to visible results.</p>
      </header>

      <div className="flex bg-[#1a1c23] p-1 rounded-2xl">
        <button 
          onClick={() => setActiveTab('morning')} 
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'morning' ? 'bg-[#c5a059] text-black' : 'text-gray-400'}`}
        >
          <span>☀️</span> Morning
        </button>
        <button 
          onClick={() => setActiveTab('night')} 
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'night' ? 'bg-[#c5a059] text-black' : 'text-gray-400'}`}
        >
          <span>🌙</span> Night
        </button>
      </div>

      <div className="space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 border-2 border-dashed border-white/5 rounded-3xl">
            <div className="text-4xl opacity-20">🧴</div>
            <p className="text-gray-500 italic">No products in your {activeTab} routine yet.</p>
            <Button variant="outline" onClick={() => setShowAdd(true)}>Add Product</Button>
          </div>
        ) : (
          filteredProducts.map((p, i) => (
            <Card key={p.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleProductUsage(p.id)}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                    todayLog.completedProducts.includes(p.id) ? 'bg-[#c5a059] border-[#c5a059] text-black' : 'border-white/10 text-transparent'
                  }`}
                >
                  ✓
                </button>
                <div>
                  <p className="font-bold">{p.name}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">{p.brand || 'No Brand'} • {p.type}</p>
                </div>
              </div>
              <button 
                onClick={() => deleteProduct(p.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-600 hover:text-red-500 transition-opacity"
              >
                ✕
              </button>
            </Card>
          ))
        )}
      </div>

      {filteredProducts.length > 0 && !showAdd && (
        <Button variant="secondary" onClick={() => setShowAdd(true)} className="w-full">
          + Add another product
        </Button>
      )}

      {showAdd && (
        <Card className="border border-[#c5a059]/30 bg-[#c5a059]/5 animate-slideUp">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-serif text-lg">New Product</h3>
            <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-white">✕</button>
          </div>
          <div className="space-y-4">
            <Input label="Product Name" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} placeholder="e.g. Gentle Cleanser" />
            <Input label="Brand (Optional)" value={newProduct.brand} onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})} placeholder="e.g. CeraVe" />
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider">Type</label>
              <select 
                value={newProduct.type} 
                onChange={(e) => setNewProduct({...newProduct, type: e.target.value as any})}
                className="w-full bg-[#1a1c23] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none"
              >
                <option value="cleanser">Cleanser</option>
                <option value="toner">Toner</option>
                <option value="serum">Serum</option>
                <option value="moisturizer">Moisturizer</option>
                <option value="sunscreen">Sunscreen</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Button onClick={handleAddProduct} className="w-full">Save to Routine</Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RoutineView;
