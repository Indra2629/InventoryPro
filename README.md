# InventoryPro - Inventory & Sales Management System

A modern, responsive web application for managing inventory, tracking sales, and monitoring business performance.

## Features

### 🏪 Inventory Management
- **Add Products**: Easily add new products with detailed information
- **Edit Products**: Modify existing product details
- **Delete Products**: Remove products from inventory
- **Bulk Operations**: Select multiple products for bulk deletion
- **Search & Filter**: Find products quickly with search and category filters
- **Stock Tracking**: Monitor stock levels with low stock alerts
- **SKU Generation**: Automatic SKU generation for products

### 📊 Dashboard
- **Real-time Metrics**: View total products, revenue, sales, and low stock items
- **Interactive Charts**: Sales overview and top products visualization
- **Recent Activity**: Track all system activities
- **Quick Actions**: Fast access to common tasks

### 💰 Sales Management
- **Record Sales**: Track customer purchases
- **Inventory Updates**: Automatic stock reduction on sales
- **Sales History**: View complete sales records
- **Revenue Tracking**: Monitor business performance

### 👥 Customer Management
- **Add Customers**: Store customer information
- **Customer Profiles**: Track customer history and preferences
- **Order History**: View customer purchase history

### 📈 Reports & Analytics
- **Export Data**: Download inventory and sales data
- **Performance Metrics**: Track business KPIs
- **Trend Analysis**: Monitor sales and inventory trends

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation
1. Download or clone the project files
2. Open `index.html` in your web browser
3. The system will automatically initialize with sample data

### First Time Setup
- The system automatically loads sample inventory data
- You can start using it immediately or clear the sample data
- All data is stored locally in your browser

## Usage Guide

### Adding Products
1. Navigate to the **Inventory** page
2. Click **"Add Product"** button
3. Fill in the product details:
   - Product Name (required)
   - Price (required)
   - Stock Quantity (required)
   - Category
   - Supplier
   - Description
4. Click **"Add Product"** to save

### Managing Inventory
- **View Products**: All products are displayed in a table format
- **Edit Products**: Click the edit button (✏️) on any product row
- **Delete Products**: Click the delete button (🗑️) on any product row
- **Bulk Delete**: Select multiple products and use bulk delete option

### Searching & Filtering
- **Search**: Use the search bar to find products by name, SKU, or description
- **Category Filter**: Filter products by category using the dropdown
- **Real-time Results**: Search results update as you type

### Exporting Data
- **Export Inventory**: Download complete inventory data as JSON
- **Export Sales**: Download sales records and analytics
- **Data Format**: All exports are in JSON format for easy integration

## Data Storage

- **Local Storage**: All data is stored in your browser's local storage
- **Data Persistence**: Data persists between browser sessions
- **Backup**: Export data regularly to prevent data loss
- **Privacy**: No data is sent to external servers

## Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## Keyboard Shortcuts

- **Ctrl/Cmd + K**: Focus search bar
- **Ctrl/Cmd + N**: Add new product (on inventory page)
- **Ctrl/Cmd + S**: Record new sale (on sales page)
- **Escape**: Close modals and forms

## Sample Data

The system comes with sample inventory data including:
- Electronics (Laptops, Headphones)
- Clothing (T-Shirts)
- Books (Programming guides)
- Home & Garden (Tool sets)

## Troubleshooting

### Common Issues

**Products not displaying:**
- Check browser console for errors
- Refresh the page
- Clear browser cache and reload

**Form not submitting:**
- Ensure all required fields are filled
- Check for JavaScript errors in console
- Verify form validation messages

**Data not saving:**
- Check browser storage permissions
- Ensure sufficient storage space
- Try refreshing the page

### Performance Tips

- Close unused browser tabs to free memory
- Export large datasets in smaller chunks
- Use search and filters to navigate large inventories
- Regularly clear old activity logs

## Customization

### Adding Categories
Edit the category options in the HTML files:
```html
<option value="Your Category">Your Category</option>
```

### Modifying Fields
Add or remove form fields by editing the HTML and JavaScript files.

### Styling
Customize the appearance by modifying the `style.css` file.

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify all files are present and accessible
3. Test in a different browser
4. Clear browser data and try again

## License

This project is open source and available under the MIT License.

## Version History

- **v1.0.0**: Initial release with core inventory and sales functionality
- **v1.1.0**: Added bulk operations and enhanced search
- **v1.2.0**: Improved UI/UX and added sample data

---

**Note**: This is a client-side application that runs entirely in your browser. No server or internet connection is required for basic functionality.

