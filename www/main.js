      // reference your own local copy of holoplay.js
      import * as HoloPlay from 'holoplay.module.js';

      
      var scene, camera, renderer;
      var geometry, material, mesh;

   
      // just a basic three.js scene, nothing special
      scene = new THREE.Scene();

      // adding some lights to the scene
      const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
      directionalLight.position.set(0, 1, 2);
      scene.add(directionalLight);
      const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.4);
      scene.add(ambientLight);

     // adding three cubes to the scene in different locations
      for (let i = 0; i < 3; i++) {
        let box = new THREE.Mesh(
            new THREE.BoxBufferGeometry(0.05, 0.05, 0.05),
            new THREE.MeshLambertMaterial({color: new THREE.Color().setHSL(i / 3, 1, 0.5)}));
        box.position.setScalar(i - 1).multiplyScalar(0.05);
        box.name = "box-" + i
        scene.add(box);
      }




      // the holoplay camera should be used like a THREE.PerspectiveCamera
       camera = new HoloPlay.Camera();

      // the holoplay renderer should act as your THREE.WebGLRenderer
       renderer = new HoloPlay.Renderer();

      // add the renderer's canvas to your web page (it will size to fill the page)
      document.body.appendChild(renderer.domElement);

      // the update function gets called every frame, thanks to requestAnimationFrame()
      function update(time) {
        requestAnimationFrame(update);
     
        // render() draws the scene, just like THREE.WebGLRenderer.render()
        renderer.render(scene, camera);
      }

      requestAnimationFrame(update);


      function animate() {
       // requestAnimationFrame( animate );
        for (let i = 0; i < 3; i++) {
            let mesh = scene.getObjectByName(`box-${i}`);
            mesh.position.x += 0.01;
            mesh.position.y += 0.02;
        }
        
        renderer.render( scene, camera );
    }
    // animate();


// ui.js  Dolby.io

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
  
    // todo call this to close conference
    function leaveButton() {
      // Leave the conference
      VoxeetSDK.conference
        .leave()
        .then(() => {
          console.log("leaving");
        })
        .catch((e) => console.log(e));
    }
  // start the conference
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
  
  let participants = 0;
  // Add a video stream to the web page
  const addVideoNode = (participant, stream) => {
  
    if (!participant) { return }
    // console.log(VoxeetSDK.conference);
  
    // console.log('count of particpants ', participants);
  
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
      let videoScreenGeo = new THREE.BoxGeometry( 160, 90, 160); //new THREE.PlaneGeometry(160, 90);//
    //   videoScreenGeo.scale(1.1, 1.1, 1.1);
      let videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture }); // side: THREE.DoubleSide
      videoMaterial.roughness = 0.2;
      videoMaterial.metalness = 0.2;
  
      let mesh = scene.getObjectByName(`box-${participantCount}`);
       mesh.material = videoMaterial;
    

       let videoScreen = new THREE.Mesh(videoScreenGeo, videoMaterial);
      let verticalOffsets = [ -130,20,170]; //max 3 participant
      let horizontalOffsets = [ -75,5,80]; //max 3 participant
      let rotationOffsets = [ -5,-2,5]; //max 3 participant
      let tiltOffsets = [ 0.1, 0.4,-0.1]; //max 3 participant
     
      videoScreen.name = 'videoScreen-' + participant.id;
      videoScreen.position.set(  horizontalOffsets[participantCount],  verticalOffsets[participantCount], 0)
      videoScreen.rotation.set( 0, rotationOffsets[participantCount], tiltOffsets[participantCount])
      scene.add(videoScreen);
    }
  
    let videoContainer = document.getElementById("video-container");
    videoContainer.appendChild(videoNode);
    // connect stream to video ele
    navigator.attachMediaStream(videoNode, stream);
    videoNode.play();
    videoNode.muted = false;
    // startAudioBtn();
    animate();
  
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

// client.js  Dolby.io 

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



// depreicated 
function loadVideo(video) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {
        video: { width: 1280, height: 720, facingMode: "user" },
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
          // apply the stream to the video element used in the texture
          video.srcObject = stream;
          video.play();
        })
        .catch(function (error) {
          console.error("Unable to access the camera/webcam.", error);
        });
    } else {
      console.error("MediaDevices interface not available.");
    }
  }
  