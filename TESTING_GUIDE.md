# Quick Start Testing Guide

## 🚀 Start Here: 5-Minute Quick Test

Open your browser to http://localhost:5173/ and follow these steps:

### Step 1: Register & Login
1. Click "Register" or "Sign Up"
2. Enter email: `test@example.com`, password: `Test123!`
3. Click "Register" then "Login" with same credentials
4. ✅ **Expected:** Redirects to Dashboard

### Step 2: View Real-Time Dashboard
1. Observe the dashboard charts
2. Watch for 10 seconds
3. ✅ **Expected:** Charts show live data updating every second

### Step 3: Create a Stream
1. Click "Stream Configuration" in sidebar
2. Click "Add Stream" button
3. Fill in:
   - Stream Key: `test_stream`
   - Name: `Test Stream`
   - Unit: `%`
   - Color: Any color
   - Min: `0`, Max: `100`
4. Click "Save"
5. ✅ **Expected:** New stream appears in list

### Step 4: Edit the Stream
1. Find your `test_stream`
2. Click "Edit" button
3. Change Name to: `Updated Test Stream`
4. Click "Save"
5. ✅ **Expected:** Name updates in list

### Step 5: Delete the Stream
1. Find your stream
2. Click "Delete" button
3. Confirm deletion
4. ✅ **Expected:** Stream removed from list

### Step 6: Logout
1. Click "Logout" in sidebar or menu
2. ✅ **Expected:** Redirects to login page

---

## 📋 Full Testing Checklist

For comprehensive testing, see: `functional_test_plan.md`

**10 Test Scenarios:**
1. Registration & Login (3 tests)
2. Dashboard & Real-Time (3 tests)
3. Stream Configuration (6 tests)
4. Historical Playback (3 tests)
5. Data Export (1 test)
6. Settings (3 tests)
7. Session Management (3 tests)
8. Error Handling (2 tests)
9. Responsive Design (2 tests)
10. Performance (2 tests)

**Total: 28 Tests**

---

## 🐛 Common Issues to Check

### ❌ Charts Not Updating
- Check browser console (F12) for errors
- Check Network tab for WebSocket connection
- Verify server is running and data simulation started

### ❌ Cannot Create Stream
- Check if already logged in
- Check console for API errors
- Verify MongoDB is running

### ❌ Login Fails
- Check server is running on port 4000
- Verify credentials are correct
- Check network tab for API response

---

## 🎯 Critical Features to Test

Must work for app to be functional:
- [ ] User can login
- [ ] Dashboard shows real-time data
- [ ] Can create/edit/delete streams
- [ ] Data persists to database
- [ ] Can logout

---

**Testing Order:**
1. Start with Quick Test (above) ⬆️
2. Then do Full Test Plan
3. Report any failures

Good luck! 🚀
