import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  username: string;
}

interface Venue {
  id: number;
  name: string;
  address: string;
}

interface Product {
  id: number;
  name: string;
  code: string;
  type: string;
  returnType: string;
  price: string;
}

interface VenueProduct {
  id: number;
  productId: number;
  parLevel: number;
  reorderThreshold: number;
  product: Product;
}

export default function SimpleApp() {
  const [users, setUsers] = useState<User[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [products, setProducts] = useState<VenueProduct[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');
  const [step, setStep] = useState<'setup' | 'inventory' | 'complete'>('setup');
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/users').then(r => r.json()),
      fetch('/api/venues').then(r => r.json())
    ])
    .then(([usersData, venuesData]) => {
      setUsers(usersData);
      setVenues(venuesData);
      setLoading(false);
    })
    .catch(() => {
      setError('Failed to load data');
      setLoading(false);
    });
  }, []);

  const startRestock = async () => {
    if (!selectedUser || !selectedVenue) return;
    
    try {
      const response = await fetch(`/api/venues/${selectedVenue}/products`);
      const productsData = await response.json();
      setProducts(productsData);
      setStep('inventory');
    } catch (e) {
      setError('Failed to load products');
    }
  };

  const completeSession = async () => {
    const sessionData = {
      userId: parseInt(selectedUser),
      venueId: parseInt(selectedVenue),
      items: products.map(p => ({
        productId: p.productId,
        productCode: p.product.code,
        productName: p.product.name,
        productType: p.product.type,
        productReturnType: p.product.returnType,
        productPrice: p.product.price,
        parLevel: p.parLevel,
        quantity: quantities[p.productId] || 0,
        soldQuantity: Math.max(0, p.parLevel - (quantities[p.productId] || 0)),
        reorderThreshold: p.reorderThreshold
      }))
    };

    try {
      await fetch('/api/restock-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });
      setStep('complete');
    } catch (e) {
      setError('Failed to save session');
    }
  };

  const resetSession = () => {
    setStep('setup');
    setProducts([]);
    setQuantities({});
    setSelectedUser('');
    setSelectedVenue('');
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
        color: '#2563eb'
      }}>
        Loading Retail Restock System...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h1 style={{ color: '#dc2626', margin: '0 0 20px 0', fontSize: '32px' }}>
          System Error
        </h1>
        <p style={{ margin: '0 0 30px 0', color: '#6b7280', fontSize: '16px' }}>
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '12px 24px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div style={{
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '600px',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '50px',
          textAlign: 'center',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 30px auto',
            fontSize: '40px',
            color: 'white'
          }}>
            ✓
          </div>
          <h1 style={{
            color: '#10b981',
            fontSize: '36px',
            margin: '0 0 20px 0',
            fontWeight: '700'
          }}>
            Restock Complete!
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '18px',
            margin: '0 0 40px 0',
            lineHeight: '1.6'
          }}>
            Your restock session has been saved successfully. The data is now available for reporting and order processing.
          </p>
          <button
            onClick={resetSession}
            style={{
              padding: '15px 30px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Start New Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#f8fafc',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          color: '#1f2937',
          fontSize: '32px',
          margin: '0 0 30px 0',
          textAlign: 'center',
          fontWeight: '700'
        }}>
          Retail Restock System
        </h1>

        {step === 'setup' && (
          <div>
            <h2 style={{ color: '#374151', fontSize: '24px', margin: '0 0 20px 0' }}>
              Setup New Session
            </h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                Select Team Member:
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              >
                <option value="">Choose team member...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                Select Venue:
              </label>
              <select
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              >
                <option value="">Choose venue...</option>
                {venues.map(venue => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={startRestock}
              disabled={!selectedUser || !selectedVenue}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: selectedUser && selectedVenue ? '#2563eb' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: selectedUser && selectedVenue ? 'pointer' : 'not-allowed',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Start Restock Session
            </button>
          </div>
        )}

        {step === 'inventory' && (
          <div>
            <h2 style={{ color: '#374151', fontSize: '24px', margin: '0 0 20px 0' }}>
              Inventory Count
            </h2>
            
            <div style={{ marginBottom: '30px' }}>
              {products.map(product => (
                <div key={product.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  marginBottom: '10px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#374151' }}>
                      {product.product.name}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      Par Level: {product.parLevel} | Code: {product.product.code}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ fontSize: '14px', color: '#374151' }}>Remaining:</label>
                    <input
                      type="number"
                      min="0"
                      max="999"
                      value={quantities[product.productId] || ''}
                      onChange={(e) => setQuantities({
                        ...quantities,
                        [product.productId]: parseInt(e.target.value) || 0
                      })}
                      style={{
                        width: '80px',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        textAlign: 'center'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => setStep('setup')}
                style={{
                  flex: 1,
                  padding: '15px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Back
              </button>
              <button
                onClick={completeSession}
                style={{
                  flex: 1,
                  padding: '15px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                Complete Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}