// Script to find Golly Gosh customer in Unleashed and update database
import { unleashedService } from './server/services/unleashed.js';
import { db } from './server/db.js';
import { venues } from './shared/schema.js';
import { eq } from 'drizzle-orm';

async function findAndUpdateGollyGoshCustomer() {
  try {
    console.log('Searching for Golly Gosh customer in Unleashed...');
    
    // Search for customers with various terms related to Golly Gosh
    const searchTerms = ['golly', 'gosh', 'golly gosh', 'GOLLY', 'GOSH'];
    let foundCustomer = null;
    
    for (const term of searchTerms) {
      console.log(`Searching for: ${term}`);
      const customers = await unleashedService.searchCustomers(term);
      
      if (customers.length > 0) {
        console.log(`Found ${customers.length} customers for "${term}":`, customers);
        
        // Look for exact or close matches
        foundCustomer = customers.find(c => 
          c.CustomerName?.toLowerCase().includes('golly') ||
          c.CustomerName?.toLowerCase().includes('gosh') ||
          c.CustomerCode?.toLowerCase().includes('golly') ||
          c.CustomerCode?.toLowerCase().includes('gosh')
        );
        
        if (foundCustomer) {
          console.log('Found matching customer:', foundCustomer);
          break;
        }
      }
    }
    
    if (!foundCustomer) {
      console.log('No Golly Gosh customer found, searching all customers...');
      const allCustomers = await unleashedService.searchCustomers();
      
      // Print first 20 customers for manual identification
      console.log('First 20 customers in Unleashed:');
      allCustomers.slice(0, 20).forEach(customer => {
        console.log(`- ${customer.CustomerCode}: ${customer.CustomerName}`);
      });
      
      // Look for patterns that might match Golly Gosh
      const possibleMatches = allCustomers.filter(c => 
        c.CustomerName?.toLowerCase().includes('coffee') ||
        c.CustomerName?.toLowerCase().includes('cafe') ||
        c.CustomerName?.toLowerCase().includes('yeronga') ||
        c.CustomerName?.toLowerCase().includes('hyde')
      );
      
      if (possibleMatches.length > 0) {
        console.log('Possible matches based on location/type:', possibleMatches);
      }
    } else {
      // Update the venue with the found customer
      console.log('Updating Golly Gosh venue with customer:', foundCustomer);
      
      await db.update(venues)
        .set({
          unleashedCustomerCode: foundCustomer.CustomerCode,
          unleashedCustomerName: foundCustomer.CustomerName,
          unleashedCustomerGuid: foundCustomer.Guid
        })
        .where(eq(venues.code, 'golly-gosh'));
      
      console.log('Successfully updated Golly Gosh venue with customer mapping');
    }
    
  } catch (error) {
    console.error('Error finding Golly Gosh customer:', error);
  }
}

findAndUpdateGollyGoshCustomer();