# OTR Cable Construction - Backend Access Guide

## Overview
Your website includes a full Flask backend API that handles contact forms, service data, and project information. This guide explains how to access and use the backend services.

## Deployed Backend API

### Base URL
The backend API is deployed and accessible at:
```
https://lnh8imcnoq61.manus.space/api/
```

### Available Endpoints

#### 1. Services API
- **GET** `/api/services` - Retrieve all available services
- **Response**: JSON array of service objects

Example:
```bash
curl -X GET https://lnh8imcnoq61.manus.space/api/services
```

#### 2. Contact Form API
- **POST** `/api/contact` - Submit contact form
- **Content-Type**: `application/json`
- **Required fields**: name, email, message
- **Optional fields**: phone, company, service

Example:
```bash
curl -X POST https://lnh8imcnoq61.manus.space/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "(555) 123-4567",
    "company": "ABC Corp",
    "service": "structured-cabling",
    "message": "Interested in network cabling for our office."
  }'
```

#### 3. Projects API
- **GET** `/api/projects` - Retrieve all projects
- **Response**: JSON array of project objects

Example:
```bash
curl -X GET https://lnh8imcnoq61.manus.space/api/projects
```

#### 4. Quote Request API
- **POST** `/api/quote` - Submit quote request
- **Content-Type**: `application/json`

Example:
```bash
curl -X POST https://lnh8imcnoq61.manus.space/api/quote \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@company.com",
    "service": "security-systems",
    "project_details": "Need CCTV system for 5000 sq ft warehouse"
  }'
```

## Local Development Setup

If you want to run the backend locally for development:

### Prerequisites
- Python 3.11+
- pip package manager

### Setup Instructions

1. **Navigate to backend directory:**
   ```bash
   cd /home/ubuntu/volttech_backend
   ```

2. **Activate virtual environment:**
   ```bash
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask application:**
   ```bash
   python src/main.py
   ```

5. **Access locally:**
   - API Base URL: `http://localhost:5000/api/`
   - Website: `http://localhost:5000/`

### Environment Variables
The backend uses the following configuration:
- **Database**: SQLite (automatically created)
- **CORS**: Enabled for all origins
- **Debug Mode**: Enabled in development
- **Port**: 5000 (default)

## Database Access

The backend uses SQLite database located at:
```
/home/ubuntu/volttech_backend/src/database/app.db
```

### Database Models

#### Contact Model
- `id` (Primary Key)
- `name` (String, required)
- `email` (String, required)
- `phone` (String, optional)
- `company` (String, optional)
- `service` (String, optional)
- `message` (Text, required)
- `created_at` (DateTime)

#### Quote Model
- `id` (Primary Key)
- `name` (String, required)
- `email` (String, required)
- `service` (String, required)
- `project_details` (Text, required)
- `created_at` (DateTime)

#### Project Model
- `id` (Primary Key)
- `title` (String, required)
- `description` (Text)
- `category` (String)
- `image_url` (String)
- `created_at` (DateTime)

## API Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Security Features

- **CORS Protection**: Configured to allow cross-origin requests
- **Input Validation**: All form inputs are validated
- **SQL Injection Protection**: Using SQLAlchemy ORM
- **Rate Limiting**: Can be implemented if needed

## Monitoring and Logs

### Access Logs
The deployed backend automatically logs all requests and responses.

### Error Handling
All API endpoints include proper error handling and return appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Integration Examples

### JavaScript/Frontend Integration
```javascript
// Submit contact form
async function submitContact(formData) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    if (result.success) {
      console.log('Contact form submitted successfully');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
  }
}

// Get services
async function getServices() {
  try {
    const response = await fetch('/api/services');
    const services = await response.json();
    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
  }
}
```

### Python Integration
```python
import requests

# Submit contact form
def submit_contact(data):
    url = "https://lnh8imcnoq61.manus.space/api/contact"
    response = requests.post(url, json=data)
    return response.json()

# Get services
def get_services():
    url = "https://lnh8imcnoq61.manus.space/api/services"
    response = requests.get(url)
    return response.json()
```

## Support and Maintenance

### Backup
The SQLite database should be backed up regularly. The database file is located at:
```
/home/ubuntu/volttech_backend/src/database/app.db
```

### Updates
To update the backend:
1. Make changes to the code
2. Test locally
3. Redeploy using the deployment tools

### Troubleshooting
Common issues and solutions:
- **CORS errors**: Ensure CORS is properly configured
- **Database errors**: Check database file permissions
- **API not responding**: Verify the service is running and accessible

## Contact for Technical Support
For technical issues with the backend:
- Email: info@otrcable.com
- Phone: (555) 123-4567
- Emergency: (555) 911-TECH

