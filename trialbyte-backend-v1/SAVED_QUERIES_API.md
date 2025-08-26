# Saved Queries API Documentation

## Overview

The Saved Queries API allows users to save their trial searches and queries for future reference. Each saved query includes a title, description, and references a specific trial ID.

## Database Schema

### Table: `saved_queries`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `title` | TEXT | Required. User-defined title for the saved query |
| `description` | TEXT | Optional description of the saved query |
| `trial_id` | UUID | Required. Foreign key to `therapeutic_trial_overview.id` |
| `user_id` | UUID | Required. Foreign key to `users.id` |
| `query_type` | TEXT | Type of query: 'trial', 'drug', or 'custom' (default: 'trial') |
| `query_data` | JSONB | JSON data containing the query details |
| `filters` | JSONB | JSON data containing filter criteria used in the query |
| `created_at` | TIMESTAMP | When the query was saved |
| `updated_at` | TIMESTAMP | When the query was last updated |

## API Endpoints

### Base URL: `/api/query/saved`

### 1. Create Saved Query
- **POST** `/api/query/saved`
- **Description**: Save a new query for a user
- **Request Body**:
```json
{
  "title": "My Cancer Trial Search",
  "description": "Oncology trials for breast cancer patients",
  "trial_id": "uuid-here",
  "user_id": "uuid-here",
  "query_type": "trial",
  "query_data": {
    "search_term": "breast cancer",
    "phase": "Phase II"
  },
  "filters": {
    "status": "Active",
    "location": "USA"
  }
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Query saved successfully",
  "data": {
    "id": "uuid-here",
    "title": "My Cancer Trial Search",
    "description": "Oncology trials for breast cancer patients",
    "trial_id": "uuid-here",
    "user_id": "uuid-here",
    "query_type": "trial",
    "query_data": { ... },
    "filters": { ... },
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### 2. Get User's Saved Queries
- **GET** `/api/query/saved/user/:user_id`
- **Description**: Retrieve all saved queries for a specific user
- **Query Parameters**:
  - `include_trial_info=true` - Include trial information in response
  - `search=text` - Search queries by title or description
  - `page=1&limit=10` - Pagination support
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "title": "My Cancer Trial Search",
      "description": "Oncology trials for breast cancer patients",
      "trial_id": "uuid-here",
      "user_id": "uuid-here",
      "query_type": "trial",
      "query_data": { ... },
      "filters": { ... },
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 3. Get Specific Saved Query
- **GET** `/api/query/saved/:id`
- **Description**: Retrieve a specific saved query by ID
- **Response**: Same as individual query object above

### 4. Update Saved Query
- **PUT** `/api/query/saved/:id`
- **Description**: Update an existing saved query
- **Request Body**:
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "query_data": { ... },
  "filters": { ... }
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Saved query updated successfully",
  "data": { ... }
}
```

### 5. Delete Saved Query
- **DELETE** `/api/query/saved/:id`
- **Description**: Delete a saved query
- **Response**:
```json
{
  "success": true,
  "message": "Saved query deleted successfully"
}
```

### 6. Get Saved Queries by Trial
- **GET** `/api/query/saved/trial/:trial_id`
- **Description**: Get all saved queries for a specific trial
- **Response**: Array of saved query objects

## Usage Examples

### JavaScript/Node.js Example

```javascript
// Save a new query
const saveQuery = async (queryData) => {
  const response = await fetch('/api/query/saved', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(queryData)
  });
  return response.json();
};

// Get user's saved queries with trial info
const getUserQueries = async (userId) => {
  const response = await fetch(`/api/query/saved/user/${userId}?include_trial_info=true`);
  return response.json();
};

// Search saved queries
const searchQueries = async (userId, searchText) => {
  const response = await fetch(`/api/query/saved/user/${userId}?search=${encodeURIComponent(searchText)}`);
  return response.json();
};

// Update a saved query
const updateQuery = async (queryId, updateData) => {
  const response = await fetch(`/api/query/saved/${queryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData)
  });
  return response.json();
};

// Delete a saved query
const deleteQuery = async (queryId) => {
  const response = await fetch(`/api/query/saved/${queryId}`, {
    method: 'DELETE',
  });
  return response.json();
};
```

### React Component Example

```jsx
import React, { useState, useEffect } from 'react';

const SavedQueries = ({ userId }) => {
  const [savedQueries, setSavedQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedQueries();
  }, [userId]);

  const fetchSavedQueries = async () => {
    try {
      const response = await fetch(`/api/query/saved/user/${userId}?include_trial_info=true`);
      const data = await response.json();
      setSavedQueries(data.data);
    } catch (error) {
      console.error('Error fetching saved queries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuery = async (queryData) => {
    try {
      const response = await fetch('/api/query/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...queryData, user_id: userId })
      });
      
      if (response.ok) {
        fetchSavedQueries(); // Refresh list
      }
    } catch (error) {
      console.error('Error saving query:', error);
    }
  };

  const handleDeleteQuery = async (queryId) => {
    try {
      const response = await fetch(`/api/query/saved/${queryId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setSavedQueries(prev => prev.filter(q => q.id !== queryId));
      }
    } catch (error) {
      console.error('Error deleting query:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Saved Queries</h2>
      {savedQueries.map(query => (
        <div key={query.id} className="saved-query-card">
          <h3>{query.title}</h3>
          <p>{query.description}</p>
          <p>Trial: {query.trial_title}</p>
          <button onClick={() => handleDeleteQuery(query.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default SavedQueries;
```

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

- **400 Bad Request**: Missing required fields
- **404 Not Found**: Query not found
- **500 Internal Server Error**: Server error

Error response format:
```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Database Setup

1. Run the SQL from `saved_queries_schema.sql` to create the table:
```sql
-- See saved_queries_schema.sql for complete setup
```

2. The table will also be created automatically when running tests due to the updated `setupTestDb.js`.

## Activity Logging

All saved query operations (create, update, delete) are automatically logged to the `user_activity` table for audit purposes.

## Features

- ✅ Full CRUD operations
- ✅ User-specific queries
- ✅ Trial-specific queries
- ✅ Search functionality
- ✅ Pagination support
- ✅ Trial information joining
- ✅ JSON data storage for flexible query data
- ✅ Activity logging
- ✅ Foreign key constraints for data integrity
- ✅ Automatic timestamps

## Testing

The saved queries functionality is ready for testing. You can:

1. Create test data using the API endpoints
2. Run the existing test suite which will include the new table schema
3. Test all CRUD operations through the API

## Next Steps

To integrate this into your frontend:

1. Add UI components for saving/managing queries
2. Integrate with your existing search functionality
3. Add user permissions if needed
4. Consider adding query sharing features
5. Add export/import functionality for saved queries
