# Retail Restock Application Training Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Installing the App](#installing-the-app)
3. [User Selection](#user-selection)
4. [Venue Selection](#venue-selection)
5. [Product Inventory Management](#product-inventory-management)
6. [Weekly Sales Data](#weekly-sales-data)
7. [Items to Order](#items-to-order)
8. [Submitting Orders](#submitting-orders)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

---

## Getting Started

### What is the Retail Restock Application?

The Retail Restock application is a mobile-optimised inventory management system designed specifically for our Australian retail venues. It helps team members efficiently track stock levels, record weekly sales, and submit restock orders directly to our Unleashed ERP system.

### Key Features
- **Mobile-friendly design** - Works perfectly on phones and tablets
- **Real-time pricing** - Displays current Shopify retail prices and wholesale ordering costs
- **Automatic calculations** - Smart reorder suggestions based on par levels and current stock
- **Direct integration** - Orders go straight to Unleashed for processing
- **Offline capability** - Basic functions work even without internet

---

## Installing the App

### For Mobile Devices (Recommended)

**Android Devices:**
1. Open Chrome and navigate to the application URL
2. Look for the "Install Retail Restock" banner at the bottom of the screen
3. Tap "Install" to add the app to your home screen
4. The app icon will appear on your home screen like any other app

**iPhone/iPad:**
1. Open Safari and navigate to the application URL
2. Tap the Share button (square with up arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" to confirm
5. The app will appear on your home screen

**Desktop/Laptop:**
1. Open Chrome or Edge browser
2. Navigate to the application URL
3. Look for the install icon in the address bar
4. Click to install as a desktop app

### Benefits of Installing
- **Faster access** - Launch directly from your home screen
- **Full-screen experience** - No browser bars taking up space
- **Offline functionality** - Continue working without internet
- **Native app feel** - Smooth performance and gestures

---

## User Selection

### How to Log In
1. **Select your name** from the dropdown menu on the initial screen
2. **Current team members** include:
   - Keenan Curran
   - Abbie Moore
   - Aaron Leck
   - James Thai
   - Hayden Bryant
   - Hannah Butkus

### Why User Selection Matters
- **Accountability** - Tracks who completed each restock session
- **Audit trail** - Maintains records for inventory management
- **Personalisation** - Future updates may include user-specific features

---

## Venue Selection

### Available Venues
The system supports five retail locations across Queensland:

1. **Bru Cru** - Kenmore (2069 Moggill Rd, Kenmore QLD 4069)
2. **All Sew** - Carseldine (7/41 Graham Rd, Carseldine QLD 4034)
3. **Golly Gosh** - Yeronga (92 Hyde Rd, Yeronga QLD 4104)
4. **Kenrose Bakery** - Carina (4/18 Kenrose St, Carina QLD 4152)
5. **Boiler Room** - Brendale (3/193 South Pine Rd, Brendale QLD 4500)

### Selecting Your Venue
1. **Choose the correct venue** from the dropdown menu
2. **Verify the address** appears correctly
3. **Click "Continue"** to proceed to inventory

### Important Notes
- Each venue has different product ranges and par levels
- Pricing may vary between venues
- Customer billing is automatically handled per venue

---

## Product Inventory Management

### Understanding Product Types

**Coffee Products (Returned Items):**
- Seasonal blends, individual roasts, and specialty coffee
- These items are **returned** if unsold (not consumed)
- Enter the quantity **remaining on shelf**

**Merchandise & Consumables (Consumed Items):**
- Pods, instant coffee, matcha, drip coffee
- These items are **consumed** and not returned
- Enter the quantity **sold during the week**

### Product Information Display

Each product shows:
- **Product name** and SKU code
- **Product type** (Coffee Bean, Merchandise, etc.)
- **Par level** - Target stock amount for this venue
- **Current quantity input field**

### How to Enter Quantities

**For Coffee Beans (Returned Items):**
1. Count physical stock remaining on shelf
2. Enter this number in the quantity field
3. System calculates how many were sold automatically

**For Consumables (Consumed Items):**
1. Count how many units were sold this week
2. Enter the sold quantity in the field
3. System calculates reorder requirements

### Quantity Input Features
- **Plus/minus buttons** for easy adjustment
- **Direct number entry** for quick input
- **Maximum validation** prevents impossible quantities
- **Real-time calculations** update as you type

---

## Weekly Sales Data

### Understanding the Sales Section

The "Weekly Items Sold" section displays:
- **Product name** and SKU code
- **Quantity sold** (calculated automatically)
- **Shopify retail price** per unit
- **Total sales value** for the week

### Pricing Information
- **Shopify pricing** reflects current retail prices
- **Green "Shopify retail price applied" badge** confirms authentic pricing
- **Prices update automatically** from our Unleashed system

### What This Data Is Used For
- **Sales performance tracking** across venues
- **Product popularity analysis** for inventory planning
- **Revenue reporting** for management
- **Trend identification** for seasonal adjustments

---

## Items to Order

### Understanding Reorder Logic

**Automatic Calculations:**
- System compares current stock to par levels
- Suggests reorder quantities to reach optimal stock
- Uses wholesale pricing for accurate costings

**Reorder Triggers:**
- **Below par level** - Standard reorder suggestion
- **At reorder threshold** - Urgent restock needed
- **Zero stock** - Critical reorder required

### Special Ordering Rules

**Cold Brew Concentrate:**
- Individual units (SKU 7081) trigger multi-pack orders
- When 1 or fewer individual units remain, system orders 4-pack (SKU 7084)
- Maintains proper inventory ratios automatically

### Pricing Display
- **WOLFF32 wholesale pricing** for order calculations
- **Individual item costs** and total order value
- **Green pricing badges** confirm authentic wholesale rates

### Review Before Ordering
1. **Check reorder quantities** make sense for your venue
2. **Verify products** actually need restocking
3. **Confirm pricing** looks reasonable
4. **Add comments** if needed for special instructions

---

## Submitting Orders

### Order Submission Process

1. **Review all sections** - inventory, sales, and reorders
2. **Add comments** if needed (special instructions, urgent items, etc.)
3. **Click "Complete & Submit Order"**
4. **Wait for confirmation** - system processes with Unleashed

### What Happens When You Submit
- **Order created** in Unleashed ERP system
- **Customer billing** applied to correct venue account
- **Tax calculations** handled automatically (10% GST)
- **Order number** generated for tracking
- **Email notifications** sent to relevant staff

### Order Details Include
- **RETAIL prefix** order numbers for easy identification
- **Complete product list** with SKUs and quantities
- **Pricing breakdown** with tax calculations
- **Venue information** for accurate delivery
- **Comments** for any special requirements

### Confirmation Information
- **Order ID** for reference
- **Order number** for Unleashed tracking
- **Total value** including GST
- **Invoice details** if automatically generated

---

## Troubleshooting

### Common Issues and Solutions

**"Venue not linked" Error:**
- Contact system administrator
- Venue may need customer code setup in Unleashed
- Temporary system issue - try again in a few minutes

**"Customer not found" Error:**
- Usually resolves automatically with system retry
- Check your internet connection
- Contact support if persistent

**Pricing Not Loading:**
- Ensure internet connection is stable
- Refresh the page and try again
- Some products may not have current pricing in Unleashed

**App Won't Install:**
- Try different browser (Chrome recommended)
- Check device storage space
- Clear browser cache and try again

**Order Submission Failed:**
- Check all required fields are completed
- Verify internet connection
- Try submitting again after a few minutes
- Contact support with error message details

### When to Contact Support
- **System errors** that prevent order completion
- **Pricing discrepancies** that seem incorrect
- **Missing venues** or products
- **Login issues** with user accounts
- **Persistent technical problems**

---

## Best Practices

### Before Starting a Restock Session
- **Ensure good internet connection** for real-time pricing
- **Have physical stock counts ready** before entering data
- **Check for any urgent restock needs** first
- **Note any damaged or expired products** separately

### During Inventory Counting
- **Count carefully** - accuracy is crucial for proper ordering
- **Double-check high-value items** like specialty coffee
- **Note any product quality issues** in comments
- **Take photos** of damaged stock if needed

### Data Entry Tips
- **Work systematically** through each product
- **Use plus/minus buttons** for precise quantities
- **Double-check entries** before moving to next product
- **Save progress** by staying on the same page

### Order Review
- **Verify reorder quantities** make sense for your venue
- **Check for duplicate orders** from earlier in the week
- **Add useful comments** for warehouse staff
- **Confirm urgent items** are marked appropriately

### After Submission
- **Save order confirmation** details
- **Communicate urgent needs** to relevant staff
- **Monitor delivery** for any missing items
- **Report any discrepancies** promptly

### Weekly Routine Suggestions
- **Monday morning** - Check weekend sales and urgent needs
- **Mid-week** - Complete full inventory and submit orders
- **Friday** - Review incoming deliveries and weekend prep
- **Monthly** - Review par levels and ordering patterns

---

## Security and Data Management

### Data Protection
- **No personal information** stored beyond user names
- **Secure connections** to Unleashed system
- **Automatic logout** after periods of inactivity
- **Regular system backups** maintained

### Privacy Considerations
- **Sales data** remains confidential within the organisation
- **Inventory levels** not shared with external parties
- **User activity** logged for accountability only
- **No tracking** of personal device information

### System Updates
- **Automatic updates** delivered through web interface
- **No app store updates** required
- **New features** available immediately upon release
- **Training notifications** for significant changes

---

## Additional Resources

### Quick Reference Card
Print and keep handy:
- **User selection** - Choose your name from dropdown
- **Venue selection** - Pick your location
- **Inventory counting** - Remaining stock for coffee, sold quantities for consumables
- **Order submission** - Review, comment, and submit

### Training Support
- **Initial training sessions** available upon request
- **One-on-one support** for complex venues
- **Group workshops** for team updates
- **Video tutorials** for visual learners

### Contact Information
For technical support or training questions:
- **System Administrator** - [Contact details to be provided]
- **Inventory Manager** - [Contact details to be provided]
- **IT Support** - [Contact details to be provided]

---

*This guide was last updated: June 2025*
*Application version: Current production release*
*For the latest updates and features, always refer to the live application*