const initUI = () => {
  joinConference = () => {
    // Default conference parameters
    // See: https://docs.dolby.io/interactivity/docs/js-client-sdk-model-conferenceparameters
    let conferenceParams = {
      liveRecording: true,
      rtcpMode: "average", // worst, average, max
      ttl: 0,
      videoCodec: "H264", // H264, VP8
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
          },
          simulcast: false,
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
  };

  leaveButton.onclick = () => {
    // Leave the conference
    VoxeetSDK.conference
      .leave()
      .then(() => {
        console.log("leaveing");
      })
      .catch((e) => console.log(e));
  };

  joinConference();

  startVideoBtn.onclick = () => {
    // Start sharing the video with the other participants
    VoxeetSDK.conference
      .startVideo(VoxeetSDK.session.participant)
      .then(() => {
        console.log("starting video");
      })
      .catch((e) => console.log(e));
  };

  stopVideoBtn.onclick = () => {
    // Stop sharing the video with the other participants
    VoxeetSDK.conference
      .stopVideo(VoxeetSDK.session.participant)
      .then(() => {
        console.log("stopping video");
      })
      .catch((e) => console.log(e));
  };

  startAudioBtn.onclick = () => {
    // Start sharing the Audio with the other participants
    VoxeetSDK.conference
      .startAudio(VoxeetSDK.session.participant)
      .then(() => {
        console.log("starting audio");
      })
      .catch((e) => console.log(e));
  };

  stopAudioBtn.onclick = () => {
    // Stop sharing the Audio with the other participants
    VoxeetSDK.conference
      .stopAudio(VoxeetSDK.session.participant)
      .then(() => {
        console.log("stopping audio");
      })
      .catch((e) => console.log(e));
  };

  startScreenShareBtn.onclick = () => {
    // Start the Screen Sharing with the other participants
    VoxeetSDK.conference
      .startScreenShare()
      .then(() => {
        console.log("start Screenshare");
      })
      .catch((e) => console.log(e));
  };

  stopScreenShareBtn.onclick = () => {
    // Stop the Screen Sharing
    VoxeetSDK.conference
      .stopScreenShare()
      .then(() => {
        console.log("stop Screenshare");
      })
      .catch((e) => console.log(e));
  };

  startRecordingBtn.onclick = () => {
    let recordStatus = document.getElementById("record-status");
    // Start recording the conference
    VoxeetSDK.recording
      .start()
      .then(() => {
        console.log("start recording");
      })
      .catch((e) => console.log(e));
  };

  stopRecordingBtn.onclick = () => {
  
    // Stop recording the conference
    VoxeetSDK.recording
      .stop()
      .then(() => {
        console.log("stop recording");
      })
      .catch((e) => console.log(e));
  };
}; // init

// Add a video stream to the web page
const addVideoNode = (participant, stream) => {

    // const mesh = scene.getObjectByName(`video${i}`);

  let videoNode = document.getElementById("video-" + participant.id);

  if (!videoNode) {

    let videoNode = document.createElement("video");
        // videoNode.setAttribute('class','video-item')
        // videoNode.setAttribute("id", "video" + i);
        videoNode.setAttribute("id", "video-" + participant.id);
        videoNode.setAttribute("style", "display: none");
        videoNode.setAttribute("playsinline", true);
        videoNode.setAttribute("playsinline", true);
        videoNode.muted = true;
        videoNode.setAttribute("autoplay", "autoplay");

  const videoContainer = document.getElementById("video-container");
    videoContainer.appendChild(videoNode);
        document.body.appendChild(videoNode);
 
        let videoMaterial = `videoMaterial${participant.id}`;
        videoMaterial = new THREE.MeshBasicMaterial({
          map: new THREE.VideoTexture(videoNode),
          emmisiveintensity: 2,
          side: THREE.DoubleSide,
        });
        videoMaterial.roughness = 0.2;
        videoMaterial.metalness = 0.2;

        const box = new THREE.Mesh(
          new THREE.BoxBufferGeometry(0.05, 0.05, 0.05),
          videoMaterial
        );
        box.name = `video-${participant.id}`; // `video${i}`;
        box.position.setScalar(i - 0.5).multiplyScalar(0.06);
        scene.add(box);
        loadVideo(eval(`video-${participant.id}`));


    // videoNode = document.createElement("video");
    // videoNode.setAttribute("class", "video-item");
    // videoNode.setAttribute("id", "video-" + participant.id);
    // // videoNode.setAttribute('height', 120);
    // // videoNode.setAttribute('width', 160);
    // videoNode.setAttribute("playsinline", true);
    // videoNode.muted = true;
    // videoNode.setAttribute("autoplay", "autoplay");
    // // videoNode.style = 'background: gray;';

    // const videoContainer = document.getElementById("video-container");
    // videoContainer.appendChild(videoNode);
  }
  navigator.attachMediaStream(videoNode, stream);
};

// Remove the video streem from the web page
const removeVideoNode = (participant) => {
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
