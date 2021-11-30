
const initUI = () => {

  function joinConference() {
    // Default conference parameters
    // See: https://docs.dolby.io/interactivity/docs/js-client-sdk-model-conferenceparameters
    let conferenceParams = {
      liveRecording: true,
      rtcpMode: "average",
      ttl: 0,
      videoCodec: "H264",
      dolbyVoice: true,
    };

    // See: https://docs.dolby.io/interactivity/docs/js-client-sdk-model-conferenceoptions
    let conferenceOptions = {
      alias: "looking-glass",
      params: conferenceParams,
    };

    // 1. Create a conference room with an alias
    VoxeetSDK.conference
      .create(conferenceOptions)
      .then((conference) => {
        // See: https://docs.dolby.io/interactivity/docs/js-client-sdk-model-joinoptions
        const joinOptions = {
          constraints: {
            audio: true,
            video: true,
          }
        };

        // 2. Join the conference
        VoxeetSDK.conference
          .join(conference, joinOptions)
          .then((conf) => {
            console.log("Joining");
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
  }

  function leaveButton() {
    // Leave the conference
    VoxeetSDK.conference
      .leave()
      .then(() => {
        console.log("leaving");
      })
      .catch((e) => console.log(e));
  }

  joinConference();

  function startVideoBtn() {
    // Start sharing the video with the other participants
    VoxeetSDK.conference
      .startVideo(VoxeetSDK.session.participant)
      .then(() => {
        console.log("starting video");
      })
      .catch((e) => console.log(e));
  }

  function stopVideoBtn() {
    // Stop sharing the video with the other participants
    VoxeetSDK.conference
      .stopVideo(VoxeetSDK.session.participant)
      .then(() => {
        console.log("stopping video");
      })
      .catch((e) => console.log(e));
  }

  function startAudioBtn() {
    // Start sharing the Audio with the other participants
    VoxeetSDK.conference
      .startAudio(VoxeetSDK.session.participant)
      .then(() => {
        console.log("starting audio");
      })
      .catch((e) => console.log(e));
  }

  function stopAudioBtn() {
    // Stop sharing the Audio with the other participants
    VoxeetSDK.conference
      .stopAudio(VoxeetSDK.session.participant)
      .then(() => {
        console.log("stopping audio");
      })
      .catch((e) => console.log(e));
  }

  function startScreenShareBtn() {
    // Start the Screen Sharing with the other participants
    VoxeetSDK.conference
      .startScreenShare()
      .then(() => {
        console.log("start Screenshare");
      })
      .catch((e) => console.log(e));
  }

  function stopScreenShareBtn() {
    // Stop the Screen Sharing
    VoxeetSDK.conference
      .stopScreenShare()
      .then(() => {
        console.log("stop Screenshare");
      })
      .catch((e) => console.log(e));
  }

  function startRecordingBtn() {
    let recordStatus = document.getElementById("record-status");
    // Start recording the conference
    VoxeetSDK.recording
      .start()
      .then(() => {
        console.log("start recording");
      })
      .catch((e) => console.log(e));
  }

  function stopRecordingBtn() {

    // Stop recording the conference
    VoxeetSDK.recording
      .stop()
      .then(() => {
        console.log("stop recording");
      })
      .catch((e) => console.log(e));
  }
}; // init

let participants = null;
// Add a video stream to the web page
const addVideoNode = (participant, stream) => {

  if (!participant) { return }
  console.log(VoxeetSDK.conference);

  console.log('count of particpants ', participants);

  // const mesh = scene.getObjectByName(`video${i}`);

  let videoNode = document.getElementById("video-" + participant.id);

  let participantCount = VoxeetSDK.conference.participants.size - 1;

  if (!videoNode) {


    videoNode = document.createElement("video");
    videoNode.setAttribute('class','video-item');
    videoNode.setAttribute("id", "video-" + participant.id);
    // videoNode.setAttribute("style", "display:none");
    videoNode.setAttribute("playsinline", true);
    videoNode.setAttribute("autoplay", "autoplay");
    videoNode.muted = true;
    

    let videoTexture = new THREE.VideoTexture(videoNode);
    let videoScreenGeo = new THREE.BoxGeometry( 160, 90, 160); //new THREE.PlaneGeometry(160, 90);
    videoScreenGeo.scale(1.1, 1.1, 1.1);
    let videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture }); // side: THREE.DoubleSide
    videoMaterial.roughness = 0.2;
    videoMaterial.metalness = 0.2;

    let videoScreen = new THREE.Mesh(videoScreenGeo, videoMaterial);
    let verticalOffsets = [ -130,20,170]; //max 3 participant
    let horizontalOffsets = [ -75,5,80]; //max 3 participant
    let rotationOffsets = [ -5,-2,5]; //max 3 participant
    let tiltOffsets = [ 0.1, 0.4,-0.1]; //max 3 participant
   
    videoScreen.name = 'videoScreen-' + participant.id;
    videoScreen.position.set(  horizontalOffsets[participantCount],  verticalOffsets[participantCount], 0)
    videoScreen.rotation.set( 0, rotationOffsets[participantCount], tiltOffsets[participantCount])
    scene.add(videoScreen);


    // participantCount++
  }

  let videoContainer = document.getElementById("video-container");
  videoContainer.appendChild(videoNode);
  navigator.attachMediaStream(videoNode, stream);
  videoNode.play();
  videoNode.muted = false;
  
  // animate();

};

// Remove the video streem from the web page
const removeVideoNode = (participant) => {
  let mesh = scene.getObjectByName(`videoScreen-${participant.id}`);
  if (mesh) {
    mesh.geometry.dispose();
    mesh.material.dispose();
    scene.remove(mesh);
  }
  let videoNode = document.getElementById("video-" + participant.id);
  if (videoNode) {
    videoNode.parentNode.removeChild(videoNode);
  }
};

const createParticpantCard = (participant) => {
  let newCard = `<li class="list-group-item-primary d-flex justify-content-between align-items-center my-list">
    ${participant.info.name}
     <img src="${participant.info.avatarUrl}" class="img-fluid rounded-start my-list" alt="${participant.info.name}"> 
  </li>`;

  return newCard;
};

// Add a new participant to the list
const addParticipantNode = (participant) => {
  // If the participant is the current session user, don't add himself to the list
  // if (participant.id === VoxeetSDK.session.participant.id) return;
  /*
  let participantNode = document.createElement("p");
  participantNode.setAttribute("id", "participant-" + participant.id);
  participantNode.innerHTML = createParticpantCard(participant);
  const participantsList = document.getElementById("participants-list");
  participantsList.appendChild(participantNode);
  */
};

// Remove a participant from the list
const removeParticipantNode = (participant) => {
  /*
let participantNode = document.getElementById(
  "participant-" + participant.id
);
if (participantNode) {
  participantNode.parentNode.removeChild(participantNode);
}
*/
};

// Add a screen share stream to the web page
const addScreenShareNode = (stream) => {

  
  /*
let screenShareNode = document.getElementById("screenshare");
if (screenShareNode) {
  return alert("There is already a participant sharing a screen!");
}
screenShareNode = document.createElement("video");
screenShareNode.setAttribute("class", "screenshare");
screenShareNode.setAttribute("id", "screenshare");
screenShareNode.autoplay = "autoplay";
navigator.attachMediaStream(screenShareNode, stream);
const screenShareContainer = document.getElementById("screenshare-container");
screenShareContainer.appendChild(screenShareNode);
*/
};

// Remove the screen share stream from the web page
const removeScreenShareNode = () => {
  /*
let screenShareNode = document.getElementById("screenshare");
if (screenShareNode) {
  screenShareNode.parentNode.removeChild(screenShareNode);
}
const startScreenShareBtn = document.getElementById("start-screenshare-btn");
startScreenShareBtn.disabled = false;
const stopScreenShareBtn = document.getElementById("stop-screenshare-btn");
stopScreenShareBtn.disabled = true;
*/
};
