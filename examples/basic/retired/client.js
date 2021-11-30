/*
/**  Create particpant info
 */
let genders = ['men', 'women'];
let randomGender = genders[Math.floor(Math.random() * genders.length)];
let randomNumber = Math.floor(Math.random() * 99);
let particpantName = "Looking-Glass-" + randomNumber;
let avatarURL = `https://randomuser.me/api/portraits/${randomGender}/${randomNumber}.jpg`

console.log(avatarURL)
//'https://ga-core.s3.amazonaws.com/production/uploads/instructor/image/15022/thumb_unnamed.jpg';

// URL to our Token Server
const tokenServerURL = 'https://dolby-io-tokenserver-lookingglass.netlify.app/api/token-generator';
let mediaDevices;

/**   initializeToken authorization flow on script load  **/
(function () {

  try {
    getTokenAndInitalize()
  } catch (e) {
    alert('Something went wrong initalizaton : ' + e);
  }
  
})();

  // enumerateMediaDeviceSources().then((mediaDevices) => {
  //   mediaDevices = this.mediaDevices;
  //   console.log(mediaDevices);
   
  // });

/** Fetch our token and start initialization of SDK, update UI sources */
async function getTokenAndInitalize() {
  try {
    let token = await refreshToken()
    VoxeetSDK.initializeToken(token, refreshToken);
    console.info('token received', token);
    initializeConferenceSession();
  } catch (error) {
    console.error(error);
  }
}


/**  Refresh Token is called when token expiration is 50% completed, this keeps the app initialized */
async function refreshToken() {
  return fetch(tokenServerURL)
    .then((res) => {
      return res.json();
    })
    .then((json) => json.access_token)
    .catch((error) => {
      console.error(error);
    });
}

/**  Create the participantInfo object and open the session with the object  */
async function initializeConferenceSession() {
  let participantInfo = { name: particpantName, avatarUrl: avatarURL, externalId: particpantName }
  try {
    // Open a session for the user
    await VoxeetSDK.session.open(participantInfo);
    // Initialize the UI
    initUI();
    console.log('session initialized!');
  } catch (e) {
    alert('Something went wrong: ' + e);
  }
}


/* Dolby.io Event handlers */

// When a stream is added to the conference
VoxeetSDK.conference.on('streamAdded', (participant, stream) => {
  if (stream.type === 'ScreenShare') {
     participant.id = 'screenshare';
    return  addVideoNode(participant, stream);
  }
  if (stream.getVideoTracks().length) {
    // Only add the video node if there is a video track
    addVideoNode(participant, stream);
  }
  // addParticipantNode(participant);
});

// When a stream is updated
VoxeetSDK.conference.on('streamUpdated', (participant, stream) => {
  if (stream.type === 'ScreenShare') return;
  if (stream.getVideoTracks().length) {
    // Only add the video node if there is a video track
    addVideoNode(participant, stream);
  } else {
    removeVideoNode(participant);
  }
});

// When a stream is removed from the conference
VoxeetSDK.conference.on('streamRemoved', (participant, stream) => {
  if (stream.type === 'ScreenShare') {
    participant.id = 'screenshare';
    // return removeScreenShareNode();
   return  removeVideoNode(participant);
  }
  removeVideoNode(participant);
  // removeParticipantNode(participant);
});

 