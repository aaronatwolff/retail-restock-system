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

export default function RestockApp() {
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
            Session Complete!
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '18px',
            margin: '0 0 40px 0',
            lineHeight: '1.6'
          }}>
            Restock session has been saved and submitted to Unleashed for processing
          </p>
          <button
            onClick={resetSession}
            style={{
              padding: '16px 32px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            Start New Session
          </button>
        </div>
      </div>
    );
  }

  if (step === 'inventory') {
    const selectedVenueData = venues.find(v => v.id.toString() === selectedVenue);
    const selectedUserData = users.find(u => u.id.toString() === selectedUser);

    return (
      <div style={{
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#f8fafc',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: 'white',
            padding: '30px',
            textAlign: 'center'
          }}>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '28px', fontWeight: '700' }}>
              Inventory Check
            </h1>
            <p style={{ margin: 0, fontSize: '16px', opacity: '0.9' }}>
              {selectedVenueData?.name} - {selectedUserData?.name}
            </p>
          </div>
          
          <div style={{ padding: '40px' }}>
            <h3 style={{
              margin: '0 0 30px 0',
              fontSize: '20px',
              color: '#374151',
              textAlign: 'center'
            }}>
              Enter remaining quantities for each product
            </h3>
            
            <div style={{ display: 'grid', gap: '15px', marginBottom: '40px' }}>
              {products.map(p => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    backgroundColor: '#f9fafb'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '16px',
                      marginBottom: '4px'
                    }}>
                      {p.product.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      Par Level: {p.parLevel} | Code: {p.product.code}
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={p.parLevel}
                    value={quantities[p.productId] || ''}
                    onChange={(e) => setQuantities(prev => ({
                      ...prev,
                      [p.productId]: parseInt(e.target.value) || 0
                    }))}
                    placeholder="0"
                    style={{
                      width: '100px',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      textAlign: 'center',
                      fontSize: '16px'
                    }}
                  />
                </div>
              ))}
            </div>
            
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setStep('setup')}
                style={{
                  padding: '16px 32px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Back
              </button>
              <button
                onClick={completeSession}
                style={{
                  padding: '16px 32px',
                  backgroundColor: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Complete Session
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Setup step - main screen
  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#f8fafc',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '50px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            color: '#2563eb',
            fontSize: '36px',
            margin: '0 0 15px 0',
            fontWeight: '700'
          }}>
            Retail Restock System
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '16px',
            margin: 0,
            lineHeight: '1.5'
          }}>
            Select your details to start a restock session
          </p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontWeight: '600',
            fontSize: '16px',
            color: '#374151'
          }}>
            Select User
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            style={{
              width: '100%',
              padding: '15px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              backgroundColor: 'white',
              color: '#374151'
            }}
          >
            <option value="">Choose user...</option>
            {users.map(user => (
              <option key={user.id} value={user.id.toString()}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontWeight: '600',
            fontSize: '16px',
            color: '#374151'
          }}>
            Select Venue
          </label>
          <select
            value={selectedVenue}
            onChange={(e) => setSelectedVenue(e.target.value)}
            style={{
              width: '100%',
              padding: '15px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              backgroundColor: 'white',
              color: '#374151'
            }}
          >
            <option value="">Choose venue...</option>
            {venues.map(venue => (
              <option key={venue.id} value={venue.id.toString()}>
                {venue.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={startRestock}
            disabled={!selectedUser || !selectedVenue}
            style={{
              padding: '18px 36px',
              backgroundColor: (!selectedUser || !selectedVenue) ? '#d1d5db' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              cursor: (!selectedUser || !selectedVenue) ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              boxShadow: (!selectedUser || !selectedVenue) ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            Start Restock Session
          </button>
        </div>
      </div>
    </div>
  );
}