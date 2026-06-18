# 🎬 YuvaTube

> A YouTube-like video platform built on Wix with **Y1 Access** membership system.

## 🌟 Features

- 📺 Video feed with thumbnails and titles
- 🔍 Search bar for videos
- 👍 Like system
- 💬 Comments (Y1 Access only)
- 📤 Video upload (Y1 Access only)
- 🏅 Y1 badge for premium members

## 🔐 Y1 Access

Y1 Access is the super-premium membership tier on YuvaTube. Y1 members can:
- ✅ Upload videos
- ✅ Comment on videos
- ✅ Get the Y1 badge on their profile

## 🗂️ Wix CMS Collections

| Collection | Purpose |
|---|---|
| `Videos` | Stores all video metadata (title, URL, thumbnail, uploader) |
| `Comments` | Stores comments linked to videos |
| `Y1Members` | Tracks all Y1 Access members and their permissions |

## 🛠️ Tech Stack

- **Platform:** Wix (Velo by Wix)
- **CMS:** Wix Data Collections
- **Membership:** Wix Members + Y1 Access custom logic

## 📁 File Structure

```
wix-velo/
  ├── home.js          # Homepage video feed logic
  ├── videoPage.js     # Video player + comments
  ├── upload.js        # Y1 Access upload logic
  └── y1Access.js      # Y1 Access verification helpers
```

## 🚀 Getting Started

1. Connect your Wix site to this repo via Wix Git Integration
2. Set up the CMS collections (Videos, Comments, Y1Members)
3. Add Y1 Access members manually or via a signup form

---
Built with ⚡ by Yuvansh

## 💬 Members-Only Chat

Exclusive chat feature — only available to **Y1 Access**, **Pro**, and **Premium** members.

| Feature | Y1 | Pro | Premium |
|---|---|---|---|
| Watch Videos | ✅ | ✅ | ✅ |
| Comment | ✅ | ✅ | ✅ |
| Upload Videos | ✅ | ✅ | ✅ |
| Chat with Yuvansh | ✅ | ✅ | ✅ |

### Setting Up the Chat CMS Collection

In your Wix Editor, enable **Wix CMS** and create a `ChatMessages` collection with these fields:

| Field Key | Display Name | Type |
|---|---|---|
| `senderId` | Sender ID | Text |
| `senderName` | Sender Name | Text |
| `message` | Message | Text |
| `accessTier` | Access Tier | Text |
| `isFromYuvansh` | Is From Yuvansh | Text (`"true"` / `"false"`) |
| `isRead` | Is Read | Text |
| `replyTo` | Reply To | Text |

> **Admin tip:** To reply to a member, insert a record with `isFromYuvansh = "true"` and `replyTo = <their memberId>`.
