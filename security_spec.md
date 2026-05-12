# Security Specification: Frisuren AI

## 1. Data Invariants
- A `User` document must only be writeable by the authenticated user matching the `uid`.
- A `HairstyleResult` must belong to a `User` and only be accessible by that user.
- A `Poll` can be created by any authenticated user, but its options (votes) can be updated by anyone (public poll).
- A `Poll` can only be deleted by the creator.
- `createdAt` and `updatedAt` must be server-generated or strictly validated.
- `isPremium` field in `User` is immutable by the user and can only be set by system/admin.

## 2. The "Dirty Dozen" Payloads

### Payload 1: Identity Spoofing (User Profile)
Attempt to create a user profile for a different UID.
```json
// Path: /users/attacker-uid
{
  "uid": "victim-uid",
  "email": "victim@example.com",
  "createdAt": "2026-05-12T00:00:00Z"
}
```
**Expected: PERMISSION_DENIED**

### Payload 2: Privilege Escalation (User Profile)
A user tries to mark themselves as premium.
```json
// Operation: UPDATE, Path: /users/user-uid
{
  "isPremium": true
}
```
**Expected: PERMISSION_DENIED**

### Payload 3: Orphaned Write (Hairstyle Result)
Trying to create a result for a userId that doesn't match the path.
```json
// Path: /users/user-uid/results/result-1
{
  "id": "result-1",
  "userId": "other-user-uid",
  "name": "Cool Cut",
  "imageUrl": "https://example.com/img.jpg",
  "createdAt": "2026-04-12T00:00:00Z"
}
```
**Expected: PERMISSION_DENIED**

### Payload 4: Resource Poisoning (Long Strings)
Injecting a massive string into a field.
```json
// Path: /users/user-uid/results/result-1
{
  "name": "a".repeat(100000)
}
```
**Expected: PERMISSION_DENIED**

### Payload 5: ID Poisoning
Using a massive document ID.
```json
// Path: /users/user-uid/results/{"a": "b"}.repeat(100)
{ ... }
```
**Expected: PERMISSION_DENIED**

### Payload 6: Field Injection (User Profile)
Adding unauthorized fields.
```json
// Path: /users/user-uid
{
  "uid": "user-uid",
  "email": "user@example.com",
  "isAdmin": true,
  "createdAt": "serverTimestamp"
}
```
**Expected: PERMISSION_DENIED**

### Payload 7: Unauthorized Poll Deletion
User A tries to delete User B's poll.
**Expected: PERMISSION_DENIED**

### Payload 8: Poll Hijacking
Updating a poll's `originalImage` or `creatorId`.
**Expected: PERMISSION_DENIED**

### Payload 9: Invalid Vote Increment
Updating votes by +100 instead of +1.
**Expected: PERMISSION_DENIED**

### Payload 10: Timestamp Spoofing
Providing a client-side timestamp in the past.
**Expected: PERMISSION_DENIED**

### Payload 11: Missing Required Keys
Creating a User profile without an email.
**Expected: PERMISSION_DENIED**

### Payload 12: List Scraping
Querying all users without a filter.
**Expected: PERMISSION_DENIED**

## 3. Test Runner (Mock Tests Logic)
The `firestore.rules.test.ts` would verify these scenarios.
