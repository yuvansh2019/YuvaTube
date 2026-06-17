// videoPage.js - Video player + likes + comments
import wixData from 'wix-data';
import wixUsers from 'wix-users';
import wixLocation from 'wix-location';
import { canComment } from './y1Access';

$w.onReady(async function () {
  const videoId = wixLocation.query.id;
  if (!videoId) return;

  // Load video
  const video = await wixData.get('Videos', videoId);
  $w('#videoPlayer').src = video.videoUrl;
  $w('#videoTitle').text = video.title;
  $w('#videoDescription').text = video.description;
  $w('#uploaderName').text = video.uploaderName;
  $w('#likeCount').text = `👍 ${video.likes || 0}`;

  // Increment view count
  await wixData.update('Videos', { _id: videoId, views: (video.views || 0) + 1 });

  // Load comments
  loadComments(videoId);

  // Comment box - Y1 Access only
  const isY1 = await canComment();
  if (isY1) {
    $w('#commentBox').show();
    $w('#submitComment').show();
    $w('#y1OnlyMsg').hide();
  } else {
    $w('#commentBox').hide();
    $w('#submitComment').hide();
    $w('#y1OnlyMsg').show();
    $w('#y1OnlyMsg').text = '🔒 Y1 Access required to comment';
  }
});

async function loadComments(videoId) {
  const results = await wixData.query('Comments')
    .eq('videoId', videoId)
    .descending('_createdDate')
    .find();

  $w('#commentsRepeater').data = results.items;
}

export function submitComment_click() {
  const user = wixUsers.currentUser;
  const text = $w('#commentBox').value;
  if (!text) return;

  wixData.insert('Comments', {
    videoId: wixLocation.query.id,
    commentText: text,
    commenterId: user.id,
    commenterName: user.getEmail(),
    y1AccessRequired: true
  }).then(() => {
    $w('#commentBox').value = '';
    loadComments(wixLocation.query.id);
  });
}

export function likeBtn_click() {
  const videoId = wixLocation.query.id;
  wixData.get('Videos', videoId).then(video => {
    wixData.update('Videos', { _id: videoId, likes: (video.likes || 0) + 1 });
    $w('#likeCount').text = `👍 ${(video.likes || 0) + 1}`;
  });
}
