// y1Access.js - Y1 Access verification helpers
import wixData from 'wix-data';
import wixUsers from 'wix-users';

/**
 * Check if the current logged-in user has Y1 Access
 * @returns {Promise<boolean>}
 */
export async function hasY1Access() {
  const user = wixUsers.currentUser;
  if (!user.loggedIn) return false;

  const result = await wixData.query('Y1Members')
    .eq('memberId', user.id)
    .eq('canUpload', true)
    .find();

  return result.totalCount > 0;
}

/**
 * Check if the current user can comment (Y1 Access required)
 * @returns {Promise<boolean>}
 */
export async function canComment() {
  const user = wixUsers.currentUser;
  if (!user.loggedIn) return false;

  const result = await wixData.query('Y1Members')
    .eq('memberId', user.id)
    .eq('canComment', true)
    .find();

  return result.totalCount > 0;
}

/**
 * Grant Y1 Access to a member (admin only)
 * @param {string} memberId
 * @param {string} memberName
 * @param {string} email
 */
export async function grantY1Access(memberId, memberName, email) {
  return wixData.insert('Y1Members', {
    memberId,
    memberName,
    email,
    accessLevel: 'Y1',
    canUpload: true,
    canComment: true
  });
}
