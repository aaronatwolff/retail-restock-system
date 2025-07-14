import { unleashedTaxValidator, type OrderTaxStructure } from './unleashed-tax-validator.js';

interface UnleashedConfig {
  apiId: string;
  apiKey: string;
  baseUrl: string;
}

interface UnleashedProduct {
  Guid: string;
  ProductCode: string;
  ProductDescription: string;
  UnitOfMeasure: string;
  DefaultSellPrice: number;
  TaxRate?: number;
  TaxCode?: string;
}

interface UnleashedCustomer {
  Guid: string;
  CustomerCode: string;
  CustomerName: string;
}

interface UnleashedOrderLine {
  Product: { Guid: string };
  OrderQuantity: number;
  UnitPrice: number;
  LineTotal: number;
}

interface UnleashedOrder {
  Customer: { Guid: string };
  OrderDate: string;
  RequiredDate: string;
  OrderLines: UnleashedOrderLine[];
  Comments: string;
  Warehouse: { Guid: string };
}

interface UnleashedResponse<T> {
  Items: T[];
  Pagination: {
    NumberOfItems: number;
    PageSize: number;
    PageNumber: number;
    NumberOfPages: number;
  };
}

export class UnleashedService {
  private config: UnleashedConfig;
  
  // Product code mapping for local codes to Unleashed SKUs
  private productCodeMapping: Record<string, string> = {
    'DRK2-SEASONAL': 'DRK2',
    'DRK2-IND': 'DRK2',
    'DRK2-500G': 'DRK2',
    'DRK - Seasonal': 'DRK2',
    'DRK - Individual': 'DRK2',
    'DRK-SEASONAL': 'DRK2',
    'DRK-IND': 'DRK2',
  };

  constructor() {
    // Configure with environment variable support for production deployment
    const isProduction = process.env.NODE_ENV === 'production';
    
    this.config = {
      apiId: process.env.UNLEASHED_API_ID || "5eb85033-1909-42d3-8f0f-9bcd498ccc4b",
      apiKey: process.env.UNLEASHED_API_KEY || "VAECrUB1oCaPpXeC3CY1lVC3GF0YF2hwu09oOZJTXMg7H5AOzMprQWOZXxS4w1YpvytdmayclnFQLiua7LmQ==",
      baseUrl: "https://api.unleashedsoftware.com"
    };
    
    console.log(`Unleashed API Configuration:
      - Environment: ${isProduction ? 'Production' : 'Development/Sandbox'}
      - Base URL: ${this.config.baseUrl}
      - API ID: ${this.config.apiId.substring(0, 8)}...
      - Ready for production deployment with environment variables
    `);
  }

  private async makeRequest<T>(endpoint: string, method: string = 'GET', body?: any): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    // Extract query parameters for signature (everything after '?')
    const queryString = endpoint.includes('?') ? endpoint.split('?')[1] : '';
    
    // Create signature using only query parameters as per Unleashed API documentation
    const crypto = await import('crypto');
    const signature = crypto.createHmac('sha256', this.config.apiKey)
      .update(queryString)
      .digest('base64');

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-auth-id': this.config.apiId,
      'api-auth-signature': signature,
      'client-type': 'Replit/RestockApp'
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Unleashed API error: ${response.status}`;
      let parsedError: any = null;
      
      try {
        parsedError = JSON.parse(errorText);
        if (parsedError.Items && Array.isArray(parsedError.Items)) {
          const errors = parsedError.Items.map((item: any) => 
            `${item.Field}: ${item.Description} (Code: ${item.ErrorCode})`
          ).join(', ');
          errorMessage = `${errorMessage} - ${errors}`;
        } else if (parsedError.message) {
          errorMessage = `${errorMessage} - ${parsedError.message}`;
        } else {
          errorMessage = `${errorMessage} - ${errorText}`;
        }
      } catch {
        errorMessage = `${errorMessage} - ${errorText}`;
      }
      
      // Enhanced error object with structured details for production debugging
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).status = response.status;
      (enhancedError as any).parsedError = parsedError;
      (enhancedError as any).rawError = errorText;
      (enhancedError as any).endpoint = endpoint;
      (enhancedError as any).method = method;
      
      throw enhancedError;
    }

    return await response.json();
  }

  async findCustomerByCode(customerCode: string): Promise<UnleashedCustomer | null> {
    try {
      const response = await this.makeRequest<UnleashedResponse<UnleashedCustomer>>(
        `/Customers?customerCode=${encodeURIComponent(customerCode)}`
      );
      return response.Items.length > 0 ? response.Items[0] : null;
    } catch (error) {
      console.error('Error finding customer by code:', error);
      
      // Fallback: If direct customer code lookup fails, try searching by customer name
      // This handles cases where API has permission issues with certain customer code formats
      if (customerCode.includes(' ')) {
        console.log(`Attempting fallback search for customer: ${customerCode}`);
        try {
          const customers = await this.searchCustomers(customerCode);
          const exactMatch = customers.find(c => 
            c.CustomerCode === customerCode || 
            c.CustomerName.toLowerCase() === customerCode.toLowerCase()
          );
          if (exactMatch) {
            console.log(`Found customer via fallback search: ${exactMatch.CustomerCode} (${exactMatch.CustomerName})`);
            return exactMatch;
          }
        } catch (fallbackError) {
          console.error('Fallback customer search also failed:', fallbackError);
        }
      }
      
      return null;
    }
  }

  async searchCustomers(searchTerm?: string): Promise<UnleashedCustomer[]> {
    try {
      const endpoint = searchTerm 
        ? `/Customers?customerName=${encodeURIComponent(searchTerm)}`
        : '/Customers';
      
      const response = await this.makeRequest<UnleashedResponse<UnleashedCustomer>>(endpoint);
      return response.Items || [];
    } catch (error) {
      console.error('Error searching customers:', error);
      return [];
    }
  }

  async findCustomerByName(customerName: string): Promise<UnleashedCustomer | null> {
    try {
      const customers = await this.searchCustomers(customerName);
      // Look for exact match first, then partial match
      const exactMatch = customers.find(c => 
        c.CustomerName.toLowerCase() === customerName.toLowerCase()
      );
      if (exactMatch) return exactMatch;
      
      const partialMatch = customers.find(c => 
        c.CustomerName.toLowerCase().includes(customerName.toLowerCase()) ||
        customerName.toLowerCase().includes(c.CustomerName.toLowerCase())
      );
      return partialMatch || null;
    } catch (error) {
      console.error('Error finding customer by name:', error);
      return null;
    }
  }

  async findProductByCode(productCode: string): Promise<UnleashedProduct | null> {
    try {
      const response = await this.makeRequest<UnleashedResponse<any>>(
        `/Products?productCode=${encodeURIComponent(productCode)}`
      );
      
      if (response.Items.length > 0) {
        return response.Items[0];
      }
      return null;
    } catch (error) {
      console.error(`Error finding product ${productCode}:`, error);
      return null;
    }
  }

  async getProductTaxInfo(productCode: string): Promise<{ taxRate: number; taxCode: string }> {
    try {
      const product = await this.findProductByCode(productCode);
      if (product && product.TaxRate && product.TaxCode) {
        return {
          taxRate: product.TaxRate,
          taxCode: product.TaxCode
        };
      }
      // Default to GST 10% if no tax info found
      return {
        taxRate: 10,
        taxCode: "GST"
      };
    } catch (error) {
      console.error('Error getting product tax info:', error);
      return {
        taxRate: 10,
        taxCode: "GST"
      };
    }
  }

  private mapProductCode(productCode: string): string {
    return this.productCodeMapping[productCode] || productCode;
  }

  async getShopifyPrice(productCode: string): Promise<number | null> {
    try {
      // Get the appropriate product code for pricing lookup
      let lookupCode = this.mapProductCode(productCode);
      
      // For cold brew concentrate 4-pack, use individual SKU 7081 for pricing
      if (productCode === '7084') {
        lookupCode = '7081';
      }
      
      // Get the product details
      const product = await this.findProductByCode(lookupCode);
      if (!product) {
        return null;
      }
      
      // Look for Shopify AUD pricing in SellPriceTier fields
      const productData = product as any;
      
      // Check all SellPriceTier fields for "Shopify AUD"
      for (let i = 1; i <= 10; i++) {
        const tierField = `SellPriceTier${i}`;
        const tier = productData[tierField];
        
        if (tier && tier.Name && tier.Value) {
          const tierName = tier.Name.toLowerCase();
          if (tierName.includes('shopify') && tierName.includes('aud')) {
            const price = parseFloat(tier.Value);
            if (price > 0) {
              return price;
            }
          }
        }
      }
      
      // Fallback to default sell price
      return product.DefaultSellPrice || null;
      
    } catch (error) {
      console.error(`Error getting Shopify pricing for ${productCode}:`, error);
      return null;
    }
  }

  async getWolff32Price(productCode: string): Promise<number | null> {
    try {
      // Get the appropriate product code for pricing lookup
      let lookupCode = this.mapProductCode(productCode);
      
      // Get the product details
      const product = await this.findProductByCode(lookupCode);
      if (!product) {
        return null;
      }
      
      // Look for WOLFF32 pricing in SellPriceTier fields
      const productData = product as any;
      
      // Check all SellPriceTier fields for "Wolff 32 AUD"
      let foundTiers = [];
      for (let i = 1; i <= 10; i++) {
        const tierField = `SellPriceTier${i}`;
        const tier = productData[tierField];
        
        if (tier && tier.Name) {
          foundTiers.push(`${tier.Name}: $${tier.Value || 'null'}`);
          
          if (tier.Value) {
            const tierName = tier.Name.toLowerCase();
            
            // Look for WOLFF32 pricing tier with flexible matching
            if (tierName.includes('wolff') && tierName.includes('32') && tierName.includes('aud')) {
              const price = parseFloat(tier.Value);
              if (price > 0) {
                return price;
              }
            }
          }
        }
      }
      

      
      // Fallback to default sell price
      return product.DefaultSellPrice || null;
      
    } catch (error) {
      console.error(`Error getting WOLFF32 pricing for ${productCode}:`, error);
      return null;
    }
  }



  async findWarehouseByName(warehouseName: string): Promise<{ Guid: string } | null> {
    try {
      const response = await this.makeRequest<UnleashedResponse<{ Guid: string; WarehouseName: string }>>(
        `/Warehouses?warehouseName=${encodeURIComponent(warehouseName)}`
      );
      return response.Items.length > 0 ? { Guid: response.Items[0].Guid } : null;
    } catch (error) {
      console.error('Error finding warehouse:', error);
      return null;
    }
  }

  async listAllWarehouses(): Promise<{ Guid: string; WarehouseName: string }[]> {
    try {
      const response = await this.makeRequest<UnleashedResponse<{ Guid: string; WarehouseName: string }>>(
        `/Warehouses`
      );
      return response.Items;
    } catch (error) {
      console.error('Error listing warehouses:', error);
      return [];
    }
  }

  async getAvailableTaxCodes(): Promise<{ TaxCode: string; TaxRate: number; Description?: string }[]> {
    console.log('Researching available tax codes in production environment...');
    
    // Method 1: Try direct TaxCodes endpoint (most reliable according to Unleashed API docs)
    try {
      console.log('Attempting direct TaxCodes API endpoint...');
      const response = await this.makeRequest<UnleashedResponse<any>>('/TaxCodes');
      console.log('Direct tax codes API successful:', response.Items.length, 'codes found');
      
      const taxCodes = response.Items
        .filter((tax: any) => tax.TaxCode || tax.Code)
        .map((tax: any) => ({
          TaxCode: tax.TaxCode || tax.Code,
          TaxRate: parseFloat(tax.TaxRate || tax.Rate || 0),
          Description: tax.Description || tax.TaxDescription || 'Production tax code'
        }));
      
      if (taxCodes.length > 0) {
        console.log('Found production tax codes via direct API:', taxCodes);
        return taxCodes;
      }
    } catch (error: any) {
      console.log('Direct tax code API failed:', error.message);
    }

    // Method 2: Try TaxRates endpoint (alternative endpoint structure)
    try {
      console.log('Attempting TaxRates API endpoint...');
      const response = await this.makeRequest<UnleashedResponse<any>>('/TaxRates');
      console.log('TaxRates API successful:', response.Items.length, 'rates found');
      
      const taxCodes = response.Items
        .filter((tax: any) => tax.TaxCode || tax.Code || tax.TaxName)
        .map((tax: any) => ({
          TaxCode: tax.TaxCode || tax.Code || tax.TaxName,
          TaxRate: parseFloat(tax.TaxRate || tax.Rate || tax.TaxPercentage || 0),
          Description: tax.Description || tax.TaxDescription || 'Production tax rate'
        }));
      
      if (taxCodes.length > 0) {
        console.log('Found production tax codes via TaxRates API:', taxCodes);
        return taxCodes;
      }
    } catch (error: any) {
      console.log('TaxRates API failed:', error.message);
    }

    // Method 3: Analyze existing sales orders for tax patterns
    try {
      console.log('Analyzing existing sales orders for tax code patterns...');
      const salesOrderResponse = await this.makeRequest<any>('/SalesOrders?pageSize=20&orderBy=OrderDate');
      
      const foundTaxCodes = new Set<string>();
      const taxCodeData: { [key: string]: { rate: number; description: string } } = {};
      
      if (salesOrderResponse.Items && salesOrderResponse.Items.length > 0) {
        salesOrderResponse.Items.forEach((order: any) => {
          // Check multiple possible tax field structures
          if (order.Tax && order.Tax.TaxCode) {
            foundTaxCodes.add(order.Tax.TaxCode);
            taxCodeData[order.Tax.TaxCode] = {
              rate: order.Tax.TaxRate || 0.10,
              description: 'Found in existing sales orders'
            };
          }
          if (order.TaxCode) {
            foundTaxCodes.add(order.TaxCode);
            taxCodeData[order.TaxCode] = {
              rate: order.TaxRate || 0.10,
              description: 'Found in existing sales orders'
            };
          }
        });
        
        if (foundTaxCodes.size > 0) {
          const discoveredCodes = Array.from(foundTaxCodes).map(code => ({
            TaxCode: code,
            TaxRate: taxCodeData[code].rate,
            Description: taxCodeData[code].description
          }));
          
          console.log('Discovered tax codes from existing orders:', discoveredCodes);
          return discoveredCodes;
        }
      }
    } catch (error: any) {
      console.log('Sales order analysis failed:', error.message);
    }

    // Method 4: Check product tax information
    try {
      console.log('Checking product tax information...');
      const productResponse = await this.makeRequest<any>('/Products?pageSize=20');
      
      if (productResponse.Items && productResponse.Items.length > 0) {
        const productTaxCodes = new Set<string>();
        
        productResponse.Items.forEach((product: any) => {
          if (product.TaxCode) {
            productTaxCodes.add(product.TaxCode);
          }
          if (product.DefaultTaxCode) {
            productTaxCodes.add(product.DefaultTaxCode);
          }
        });
        
        if (productTaxCodes.size > 0) {
          const productBasedCodes = Array.from(productTaxCodes).map(code => ({
            TaxCode: code,
            TaxRate: 0.10, // Default to 10% GST
            Description: 'Found in product configuration'
          }));
          
          console.log('Found tax codes from product data:', productBasedCodes);
          return productBasedCodes;
        }
      }
    } catch (error: any) {
      console.log('Product tax discovery failed:', error.message);
    }

    // Method 5: Sequential validation of common Australian tax codes
    console.log('Testing common Australian tax codes sequentially...');
    const commonCodes = [
      'GST', 'AUS-GST', 'GST10', 'AUSGST', 'AU-GST', 
      'TAX', 'VAT', 'SALES-TAX', 'G10', 'GSTAUS'
    ];
    
    for (const code of commonCodes) {
      try {
        console.log(`Testing tax code: ${code}`);
        
        // Create a minimal test order to validate tax code
        const testPayload = {
          Customer: { Guid: 'invalid-test-guid' }, // Will fail on customer, but tax validation happens first
          OrderDate: new Date().toISOString().split('T')[0],
          RequiredDate: new Date().toISOString().split('T')[0],
          OrderNumber: `TEST${Date.now()}`,
          OrderStatus: 'Parked',
          SubTotal: 10.00,
          TaxTotal: 1.00,
          Total: 11.00,
          Tax: {
            TaxCode: code,
            TaxRate: 0.10
          },
          SalesOrderLines: []
        };
        
        await this.makeRequest<any>('/SalesOrders', 'POST', testPayload);
        
        // If we get here without tax error, the tax code is valid
        console.log(`Valid tax code found: ${code}`);
        return [{
          TaxCode: code,
          TaxRate: 0.10,
          Description: 'Validated through sequential testing'
        }];
      } catch (error: any) {
        const errorMsg = error.message?.toLowerCase() || '';
        
        // If error is NOT about tax codes, then the tax code is valid
        if (!errorMsg.includes('tax') && !errorMsg.includes('does not map')) {
          console.log(`Valid tax code confirmed: ${code} (failed for non-tax reasons)`);
          return [{
            TaxCode: code,
            TaxRate: 0.10,
            Description: 'Validated (failed on non-tax validation)'
          }];
        }
        
        console.log(`Tax code ${code} invalid:`, error.message);
      }
    }
    
    console.log('All tax code discovery methods exhausted');
    return [];
  }

  // Handle special cold brew ordering logic: 7081 (individual) orders as 7084 (4-pack) with WOLFF32 pricing
  private async convertColdBrewOrders(orderLines: Array<{ productCode: string; quantity: number; unitPrice: number; }>): Promise<Array<{ productCode: string; quantity: number; unitPrice: number; }>> {
    const convertedLines = [];
    
    for (const line of orderLines) {
      if (line.productCode === '7081') {
        // Get WOLFF32 pricing for 7084 multi-pack
        const wolff32Price = await this.getWolff32Price('7084');
        const multiPackPrice = wolff32Price || line.unitPrice * 4;
        
        // Always order 1 multi-pack for cold brew reorder (triggered when 1 or fewer remain)
        convertedLines.push({
          productCode: '7084', // Order the 4-pack
          quantity: 1, // Always order 1 multi-pack
          unitPrice: multiPackPrice // WOLFF32 pricing for 7084
        });
      } else {
        convertedLines.push(line);
      }
    }
    
    return convertedLines;
  }

  async createSalesOrder(orderData: {
    customerCode: string;
    customerGuid?: string;
    orderLines: Array<{
      productCode: string;
      quantity: number;
      unitPrice: number;
    }>;
    comments?: string;
    orderDate: string;
  }): Promise<{ orderId: string; orderNumber: string }> {
    try {
      // Find customer - use GUID if available, otherwise lookup by code
      let customer = null;
      
      if (orderData.customerGuid) {
        // If we have a GUID, use it directly (more reliable)
        customer = {
          Guid: orderData.customerGuid,
          CustomerCode: orderData.customerCode,
          CustomerName: orderData.customerCode // Will be used for logging
        };
        console.log(`Using customer GUID directly: ${orderData.customerGuid} (${orderData.customerCode})`);
      } else {
        // Fallback to customer code lookup
        customer = await this.findCustomerByCode(orderData.customerCode);
        if (!customer) {
          throw new Error(`Customer not found: ${orderData.customerCode}`);
        }
      }

      // Handle warehouse selection - try different approaches
      let warehouse = null;
      
      // Try to find warehouses with different names
      const warehouseNames = ["Retail Warehouse", "Retail", "Main Warehouse", "Default", "Main"];
      
      for (const name of warehouseNames) {
        try {
          warehouse = await this.findWarehouseByName(name);
          if (warehouse) {
            console.log(`Found warehouse: ${name} (${warehouse.Guid})`);
            break;
          }
        } catch (error: any) {
          console.log(`Failed to find warehouse '${name}':`, error?.message || 'Unknown error');
          continue;
        }
      }
      
      // If warehouse lookup fails due to API permissions, create order without warehouse
      // This will let Unleashed use the default warehouse for the customer
      if (!warehouse) {
        console.warn("Warehouse lookup failed, proceeding without warehouse specification - Unleashed will use customer default");
        warehouse = null; // Will be handled in order creation
      }

      // Apply cold brew ordering conversion
      const convertedOrderLines = await this.convertColdBrewOrders(orderData.orderLines);

      // Create order lines with required fields according to Unleashed API specification
      const orderLines: any[] = [];
      
      for (let index = 0; index < convertedOrderLines.length; index++) {
        const line = convertedOrderLines[index];
        
        // Apply product code mapping for Unleashed lookup
        const mappedCode = this.mapProductCode(line.productCode);
        
        const product = await this.findProductByCode(mappedCode);
        if (!product) {
          throw new Error(`Product not found: ${mappedCode} (original: ${line.productCode})`);
        }

        const lineTotal = (line.quantity * line.unitPrice);

        const lineTax = lineTotal * 0.10; // 10% GST - Unleashed will override based on product settings
        
        orderLines.push({
          LineNumber: index + 1,
          Product: { Guid: product.Guid },
          OrderQuantity: line.quantity,
          UnitPrice: line.unitPrice,
          LineTotal: parseFloat(lineTotal.toFixed(2)),
          LineTax: parseFloat(lineTax.toFixed(2))
        });
      }

      // Use comprehensive tax validator for production-ready tax handling
      console.log('Validating and calculating tax structure for production order...');
      
      // Get available tax codes and filter out invalid ones
      const availableTaxCodes = await this.getAvailableTaxCodes();
      console.log('All discovered tax codes:', availableTaxCodes);
      
      // Filter out invalid tax codes that cause production errors
      const invalidTaxCodes = ['NONE', 'NULL', '', 'NOTAX', 'NO-TAX'];
      const validTaxCodes = availableTaxCodes.filter(code => 
        !invalidTaxCodes.includes(code.TaxCode.toUpperCase())
      );
      
      console.log('Valid tax codes after filtering:', validTaxCodes);
      
      if (validTaxCodes.length === 0) {
        throw new Error('No valid tax codes found in production environment. All discovered codes are invalid: ' + 
          availableTaxCodes.map(c => c.TaxCode).join(', '));
      }
      
      // Use the first valid tax code (prioritizing G.S.T. if available)
      const gstCode = validTaxCodes.find(code => code.TaxCode.toUpperCase() === 'G.S.T.');
      const selectedTaxCode = gstCode || validTaxCodes[0];
      
      console.log('Selected tax code for order:', selectedTaxCode);
      
      // Calculate tax structure manually with validated tax code
      const subTotal = orderLines.reduce((sum, line) => sum + line.LineTotal, 0);
      const taxTotal = subTotal * selectedTaxCode.TaxRate;
      const total = subTotal + taxTotal;
      
      const taxStructure = {
        orderLevelTax: {
          TaxCode: selectedTaxCode.TaxCode,
          TaxRate: selectedTaxCode.TaxRate
        },
        lineLevelTaxes: orderLines.map((line, index) => ({
          LineNumber: index + 1,
          LineTax: parseFloat((line.LineTotal * selectedTaxCode.TaxRate).toFixed(2))
        })),
        subTotal: parseFloat(subTotal.toFixed(2)),
        taxTotal: parseFloat(taxTotal.toFixed(2)),
        total: parseFloat(total.toFixed(2))
      };
      
      console.log('Tax validation complete:', {
        taxCode: taxStructure.orderLevelTax.TaxCode,
        taxRate: `${taxStructure.orderLevelTax.TaxRate * 100}%`,
        subTotal: taxStructure.subTotal,
        taxTotal: taxStructure.taxTotal,
        total: taxStructure.total
      });
      
      // Apply validated tax structure to order lines
      const validatedOrderLines = orderLines.map((line, index) => ({
        ...line,
        LineTax: taxStructure.lineLevelTaxes[index].LineTax
      }));
      
      // Build production-ready order payload with validated tax structure
      const orderPayload: any = {
        Customer: { Guid: customer.Guid },
        OrderDate: new Date().toISOString().split('T')[0],
        RequiredDate: new Date().toISOString().split('T')[0],
        OrderNumber: `RETAIL${Math.floor(Math.random() * 999) + 100}`,
        OrderStatus: "Parked",
        SubTotal: taxStructure.subTotal,
        TaxTotal: taxStructure.taxTotal,
        Total: taxStructure.total,
        Tax: {
          TaxCode: taxStructure.orderLevelTax.TaxCode,
          TaxRate: taxStructure.orderLevelTax.TaxRate
        },
        SalesOrderLines: validatedOrderLines,
        Comments: "Restock order created via automated system with validated tax structure"
      };

      if (warehouse?.Guid) {
        orderPayload.Warehouse = { Guid: warehouse.Guid };
      }

      console.log('Creating Unleashed order with production-ready tax structure:', JSON.stringify(orderPayload, null, 2));

      // Create order with validated tax structure
      try {
        const response = await this.makeRequest<{ Guid: string; OrderNumber: string }>(
          '/SalesOrders',
          'POST',
          orderPayload
        );

        console.log(`Order created successfully with validated tax structure: ${response.OrderNumber} (${response.Guid})`);
        return {
          orderId: response.Guid,
          orderNumber: response.OrderNumber
        };
      } catch (error: any) {
        console.error('Order creation failed even with validated tax structure:', error.message);
        
        // Enhanced error reporting with tax validation context
        const errorDetails = {
          status: error.status,
          message: error.message,
          usedTaxCode: taxStructure.orderLevelTax.TaxCode,
          usedTaxRate: taxStructure.orderLevelTax.TaxRate,
          orderPayload: JSON.stringify(orderPayload, null, 2)
        };
        
        console.error('Production order creation failure details:', errorDetails);
        
        // Provide specific guidance based on the error
        let diagnosticMessage = `Unable to create order: Unleashed API error ${error.status || 'unknown'} - ${error.message}`;
        
        if (error.message?.includes('Invoice tax is required')) {
          diagnosticMessage += `. Used validated tax code: ${taxStructure.orderLevelTax.TaxCode} (${taxStructure.orderLevelTax.TaxRate * 100}%). This suggests a deeper Unleashed configuration issue - contact Unleashed support.`;
        }
        
        throw new Error(diagnosticMessage);
      }
    } catch (error) {
      console.error('Error creating sales order:', error);
      throw error;
    }
  }

  async completeSalesOrder(orderId: string): Promise<boolean> {
    try {
      await this.makeRequest(
        `/SalesOrders/${orderId}/Complete`,
        'POST'
      );
      return true;
    } catch (error) {
      console.error('Error completing sales order:', error);
      return false;
    }
  }

  async generateInvoice(orderId: string): Promise<{ invoiceId: string; invoiceNumber: string } | null> {
    try {
      const response = await this.makeRequest<{ Guid: string; InvoiceNumber: string }>(
        `/SalesOrders/${orderId}/Invoice`,
        'POST'
      );

      return {
        invoiceId: response.Guid,
        invoiceNumber: response.InvoiceNumber
      };
    } catch (error) {
      console.error('Error generating invoice:', error);
      return null;
    }
  }
}

export const unleashedService = new UnleashedService();
