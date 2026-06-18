// chat.js - Members-only chat with Yuvansh
// Access: Y1, Pro, Premium members only

import wixData from 'wix-data';
import wixUsers from 'wix-users';
import { notifyYuvansh } from 'backend/chatNotify';

const ALLOWED_TIERS = ['Y1', 'Pro', 'Premium'];

$w.onReady(async function () {
  const user = wixUsers.currentUser;

  if (!user.loggedIn) {
    showAccessDenied('Please log in to access the chat.');
    return;
  }

  const memberInfo = await getMemberInfo(user.id);

  if (!memberInfo || !ALLOWED_TIERS.includes(memberInfo.accessLevel)) {
    showAccessDenied('🔒 This chat is exclusive to Y1, Pro, and Premium members.\nUpgrade your plan to chat with Yuvansh!');
    return;
  }

  $w('#chatSection').show();
  $w('#accessDeniedBox').hide();
  $w('#memberTierBadge').text = `⚡ ${memberInfo.accessLevel} Member`;

  loadMessages(user.id);
  setInterval(() => loadMessages(user.id), 5000);
});

async function getMemberInfo(userId) {
  const result = await wixData.query('Y1Members')
    .eq('memberId', userId)
    .find();
  return result.totalCount > 0 ? result.items[0] : null;
}

async function loadMessages(userId) {
  const sent = await wixData.query('ChatMessages')
    .eq('senderId', userId)
    .descending('_createdDate')
    .limit(50)
    .find();

  const replies = await wixData.query('ChatMessages')
    .eq('isFromYuvansh', 'true')
    .eq('replyTo', userId)
    .descending('_createdDate')
    .limit(50)
    .find();

  const allMessages = [...sent.items, ...replies.items]
    .sort((a, b) => new Date(a._createdDate) - new Date(b._createdDate));

  $w('#chatRepeater').data = allMessages;
}

export function chatRepeater_itemReady($item, itemData) {
  $item('#messageText').text = itemData.message;
  $item('#messageSender').text = itemData.isFromYuvansh === 'true' ? '⚡ Yuvansh' : itemData.senderName;
  $item('#messageTime').text = new Date(itemData._createdDate).toLocaleTimeString();

  if (itemData.isFromYuvansh === 'true') {
    $item('#messageBubble').style.backgroundColor = '#1a1a2e';
    $item('#messageSender').style.color = '#00d4ff';
  } else {
    $item('#messageBubble').style.backgroundColor = '#0d6efd';
    $item('#messageSender').style.color = '#ffffff';
  }
}

export async function sendBtn_click() {
  const user = wixUsers.currentUser;
  const text = $w('#chatInput').value.trim();
  if (!text) return;

  const memberInfo = await getMemberInfo(user.id);
  const email = await user.getEmail();

  await wixData.insert('ChatMessages', {
    senderId: user.id,
    senderName: memberInfo.memberName || email,
    message: text,
    accessTier: memberInfo.accessLevel,
    isFromYuvansh: 'false',
    isRead: 'false',
    replyTo: ''
  });

  // Notify Yuvansh on WhatsApp
  await notifyYuvansh(user.id, memberInfo.memberName || email, text, memberInfo.accessLevel);

  $w('#chatInput').value = '';
  loadMessages(user.id);
}

function showAccessDenied(msg) {
  $w('#chatSection').hide();
  $w('#accessDeniedBox').show();
  $w('#accessDeniedText').text = msg;
}
