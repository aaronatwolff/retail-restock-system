# Retail Restock - Features Guide

## Application Features Overview

### Mobile-First Design
- **Responsive interface** adapts to phones, tablets, and computers
- **Touch-friendly controls** with large buttons and clear text
- **Optimised performance** for mobile data connections
- **Portrait orientation** ideal for one-handed use

### Progressive Web App (PWA) Capabilities
- **Home screen installation** like a native app
- **Offline functionality** for basic operations
- **Background sync** when connection returns
- **Native app experience** without app store downloads

### Real-Time Data Integration

**Shopify Pricing:**
- Live retail price updates from Shopify system
- Accurate sales value calculations
- Current pricing for customer-facing decisions
- Automatic price tier selection

**WOLFF32 Wholesale Pricing:**
- Live wholesale cost updates for ordering
- Accurate margin calculations
- Real-time cost analysis
- Supplier pricing transparency

**Unleashed ERP Integration:**
- Direct order submission to warehouse
- Automatic customer account linking
- Real-time inventory updates
- Professional order numbering

### Smart Inventory Logic

**Product Type Recognition:**
- **Coffee beans** - Returned items logic
- **Consumables** - Consumed items logic
- **Merchandise** - Appropriate handling per type
- **Special products** - Custom ordering rules

**Cold Brew Intelligence:**
- Individual unit tracking (SKU 7081)
- Automatic multi-pack ordering (SKU 7084)
- Threshold-based reorder triggers
- Optimal inventory ratios

**Par Level Management:**
- Venue-specific target levels
- Automatic reorder calculations
- Intelligent quantity suggestions
- Stock optimisation algorithms

### Financial Accuracy

**Tax Handling:**
- Automatic 10% GST calculations
- Production-validated tax codes
- Compliant invoice generation
- Accurate financial reporting

**Pricing Transparency:**
- Clear retail vs wholesale pricing
- Margin visibility for decision making
- Authentic pricing source indicators
- Real-time cost updates

**Order Totals:**
- Line-by-line cost breakdown
- Tax-inclusive total calculations
- Venue-specific pricing
- Accurate financial tracking

### User Experience Features

**Intuitive Navigation:**
- Progressive form design
- Clear step-by-step process
- Visual progress indicators
- Easy back/forward navigation

**Error Prevention:**
- Input validation and limits
- Clear error messages
- Guided correction process
- Automatic retry logic

**Visual Feedback:**
- Real-time calculation updates
- Pricing source indicators
- Order status confirmation
- Success/error notifications

### Security and Compliance

**Data Protection:**
- Secure API connections
- Encrypted data transmission
- No sensitive data storage
- Regular security updates

**Audit Trail:**
- User action logging
- Order history tracking
- Change documentation
- Compliance reporting

**Access Control:**
- User identification system
- Venue-specific access
- Role-based permissions
- Activity monitoring

### Performance Optimisation

**Fast Loading:**
- Efficient data caching
- Optimised image delivery
- Minimal resource usage
- Quick startup times

**Reliable Operation:**
- Robust error handling
- Automatic retry mechanisms
- Graceful degradation
- Consistent performance

**Scalable Architecture:**
- Multi-venue support
- Concurrent user handling
- High availability design
- Future expansion ready

## Technical Specifications

### Supported Devices
- **Smartphones** - iPhone 12+ / Android 8+
- **Tablets** - iPad Air+ / Android tablets
- **Computers** - Chrome, Safari, Edge browsers
- **Screen sizes** - 320px to 4K displays

### Network Requirements
- **3G minimum** for basic functionality
- **4G/WiFi recommended** for optimal performance
- **Offline mode** for viewing cached data
- **Auto-sync** when connection restored

### Browser Compatibility
- **Chrome** - Fully supported (recommended)
- **Safari** - Fully supported
- **Edge** - Fully supported
- **Firefox** - Basic functionality

### Data Usage
- **Initial load** - ~2MB download
- **Regular use** - ~50KB per session
- **Offline mode** - Minimal data usage
- **Image assets** - Optimised for mobile

## Integration Details

### Unleashed ERP System
- **Real-time product lookup** from master catalogue
- **Customer account verification** and linking
- **Warehouse integration** for delivery coordination
- **Invoice generation** with proper tax handling
- **Order tracking** throughout fulfillment process

### Shopify E-commerce Platform
- **Live retail pricing** from active store
- **Product availability** checking
- **Sales performance** data integration
- **Customer pricing tiers** appropriate selection
- **Inventory synchronisation** where applicable

### Financial Systems
- **GST compliance** with automatic calculations
- **Multi-venue accounting** with proper allocation
- **Cost centre tracking** per location
- **Profit margin analysis** capabilities
- **Financial reporting** integration ready

## Customisation Options

### Venue Configuration
- **Product range** customisation per location
- **Par level** adjustment based on sales patterns
- **Pricing tier** selection per venue type
- **Delivery schedule** coordination
- **Special requirements** handling

### User Preferences
- **Display options** for different screen sizes
- **Notification settings** for order confirmations
- **Default venues** for regular users
- **Quick actions** for frequent tasks
- **Accessibility features** as required

### Business Rules
- **Reorder thresholds** adjustable per product
- **Minimum order quantities** configurable
- **Special product handling** customisable
- **Approval workflows** if required
- **Escalation procedures** for unusual orders

## Future Enhancements

### Planned Features
- **Barcode scanning** for faster inventory counting
- **Voice input** for hands-free operation
- **Photo documentation** for quality issues
- **Predictive ordering** based on historical data
- **Multi-language support** for diverse teams

### Integration Expansions
- **Delivery tracking** integration
- **Supplier direct ordering** for special items
- **Customer feedback** collection
- **Quality management** system integration
- **Performance analytics** dashboard

### Advanced Capabilities
- **Machine learning** for demand forecasting
- **Automated reordering** for routine items
- **Supply chain optimisation** recommendations
- **Seasonal adjustment** algorithms
- **Cross-venue** inventory sharing

---

*This features guide provides technical details for users interested in the application's capabilities and architecture. For basic usage instructions, refer to the Training Guide.*