// home.js - YuvaTube Homepage video feed
import wixData from 'wix-data';
import { hasY1Access } from './y1Access';

$w.onReady(async function () {
  loadVideos();
  const isY1 = await hasY1Access();
  
  // Show/hide upload button based on Y1 Access
  if (isY1) {
    $w('#uploadBtn').show();
    $w('#y1Badge').show();
  } else {
    $w('#uploadBtn').hide();
    $w('#y1Badge').hide();
  }
});

async function loadVideos(searchQuery = '') {
  let query = wixData.query('Videos').descending('_createdDate');
  
  if (searchQuery) {
    query = query.contains('title', searchQuery);
  }

  const results = await query.find();
  $w('#videoRepeater').data = results.items;
}

// Search bar handler
export function searchBar_keyPress(event) {
  if (event.key === 'Enter') {
    loadVideos($w('#searchBar').value);
  }
}

// Repeater item setup
export function videoRepeater_itemReady($item, itemData) {
  $item('#videoThumb').src = itemData.thumbnail;
  $item('#videoTitle').text = itemData.title;
  $item('#uploaderName').text = `⚡ ${itemData.uploaderName}`;
  $item('#viewCount').text = `${itemData.views || 0} views`;

  $item('#videoThumb').onClick(() => {
    wixLocation.to(`/video/${itemData._id}`);
  });
}
