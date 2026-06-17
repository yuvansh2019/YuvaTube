// upload.js - Y1 Access video upload page
import wixData from 'wix-data';
import wixUsers from 'wix-users';
import wixLocation from 'wix-location';
import { hasY1Access } from './y1Access';

$w.onReady(async function () {
  const isY1 = await hasY1Access();

  if (!isY1) {
    // Redirect non-Y1 users
    $w('#uploadForm').hide();
    $w('#accessDenied').show();
    $w('#accessDenied').text = '🔒 Y1 Access required to upload videos. Contact Yuvansh to get Y1 Access!';
    return;
  }

  $w('#uploadForm').show();
  $w('#accessDenied').hide();
});

export async function submitUpload_click() {
  const user = wixUsers.currentUser;
  const title = $w('#videoTitle').value;
  const description = $w('#videoDescription').value;
  const videoUrl = $w('#videoUrlInput').value;

  if (!title || !videoUrl) {
    $w('#errorMsg').text = 'Please fill in title and video URL.';
    return;
  }

  await wixData.insert('Videos', {
    title,
    description,
    videoUrl,
    uploaderId: user.id,
    uploaderName: await user.getEmail(),
    y1AccessOnly: false,
    likes: 0,
    views: 0
  });

  wixLocation.to('/');
}
