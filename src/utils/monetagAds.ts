import createAdHandler from 'monetag-tg-sdk';

/**
 * Rewarded Popup
 */
export async function showRewardedPopup(zoneId: string | number, ymid?: string) {
  try {
    const showAd = createAdHandler(Number(zoneId));
    await showAd({
      type: 'end',
      ymid,
    });
    return true;
  } catch (err) {
    console.error('Rewarded Popup Error:', err+" zoneid"+zoneId+" ymid "+ymid);
    return false;
  }
}

export async function showRewardedPopup2(zoneId: string) {
  try {
    const showAd = createAdHandler(Number(zoneId));
    await showAd({
      type: 'end',
    });
    return true;
  } catch (err) {
    console.error('Rewarded Popup Error:', err+" zoneid"+zoneId);
    return false;
  }
}

/**
 * App Start Ad
 */
export async function showStartAd(zoneId: string | number, ymid?: string) {
  try {
    const showAd = createAdHandler(Number(zoneId));

    await showAd({
      type: 'start',
      ymid,
    });

    return true;
  } catch (err) {
    console.error('Start Ad Error:', err);
    return false;
  }
}

/**
 * App End Ad
 */
export async function showEndAd(zoneId: string | number, ymid?: string) {
  try {
    const showAd = createAdHandler(Number(zoneId));

    await showAd({
      type: 'end',
      ymid,
    });

    return true;
  } catch (err) {
    console.error('End Ad Error:', err);
    return false;
  }
}
