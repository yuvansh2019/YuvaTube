// chat.js - Members-only chat with Yuvansh
// Access restricted to: Y1 Access, YuvaTube Pro, YuvaTube Premium members

import wixData from 'wix-data';
import wixUsers from 'wix-users';

const ALLOWED_TIERS = ['Y1', 'Pro', 'Premium'];

$w.onReady(async function () {
  const user = wixUsers.currentUser;

  if (!user.loggedIn) {
    showAccessDenied('Please log in to access the chat.');
    return;
  }

  const tier = await getMemberTier(user.id);

  if (!ALLOWED_TIERS.includes(tier)) {
    showAccessDenied('🔒 This chat is exclusive to Y1, Pro, and Premium members.\nUpgrade your plan to chat with Yuvansh!');
    return;
  }

  // Member is allowed — show chat
  $w('#chatSection').show();
  $w('#accessDeniedBox').hide();
  $w('#memberTierBadge').text = `⚡ ${tier} Member`;
  
  loadMessages(user.id);

  // Auto-refresh messages every 5 seconds
  setInterval(() => loadMessages(user.id), 5000);
});

/**
 * Get member tier from Y1Members collection
 */
async function getMemberTier(userId) {
  const result = await wixData.query('Y1Members')
    .eq('memberId', userId)
    .find();

  if (result.totalCount > 0) {
    return result.items[0].accessLevel || 'Y1';
  }
  return null;
}

/**
 * Load chat messages for the current user
 */
async function loadMessages(userId) {
  const results = await wixData.query('ChatMessages')
    .eq('senderId', userId)
    .descending('_createdDate')
    .limit(50)
    .find();

  // Also get Yuvansh's replies
  const replies = await wixData.query('ChatMessages')
    .eq('isFromYuvansh', 'true')
    .eq('replyTo', userId)
    .descending('_createdDate')
    .limit(50)
    .find();

  // Merge and sort by date
  const allMessages = [...results.items, ...replies.items]
    .sort((a, b) => new Date(a._createdDate) - new Date(b._createdDate));

  $w('#chatRepeater').data = allMessages;
}

/**
 * Repeater item setup — render each chat bubble
 */
export function chatRepeater_itemReady($item, itemData) {
  $item('#messageText').text = itemData.message;
  $item('#messageSender').text = itemData.isFromYuvansh === 'true' ? '⚡ Yuvansh' : itemData.senderName;
  $item('#messageTime').text = new Date(itemData._createdDate).toLocaleTimeString();

  // Style: Yuvansh's replies on left, user's on right
  if (itemData.isFromYuvansh === 'true') {
    $item('#messageBubble').style.backgroundColor = '#1a1a2e';
    $item('#messageSender').style.color = '#00d4ff';
  } else {
    $item('#messageBubble').style.backgroundColor = '#0d6efd';
    $item('#messageSender').style.color = '#ffffff';
  }
}

/**
 * Send a message
 */
export async function sendBtn_click() {
  const user = wixUsers.currentUser;
  const text = $w('#chatInput').value.trim();
  if (!text) return;

  const tier = await getMemberTier(user.id);
  const email = await user.getEmail();

  await wixData.insert('ChatMessages', {
    senderId: user.id,
    senderName: email,
    message: text,
    accessTier: tier,
    isFromYuvansh: 'false',
    isRead: 'false',
    replyTo: ''
  });

  $w('#chatInput').value = '';
  loadMessages(user.id);
}

/**
 * Show access denied message
 */
function showAccessDenied(msg) {
  $w('#chatSection').hide();
  $w('#accessDeniedBox').show();
  $w('#accessDeniedText').text = msg;
}
