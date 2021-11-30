async function enumerateMediaDeviceSources() {
    if (navigator
        && navigator.mediaDevices
        && typeof navigator.mediaDevices.enumerateDevices === 'function') {
        try {
            /* open a generic stream to get permission to see devices; 
             * Mobile Safari insists */
            const mediaStream = await navigator.mediaDevices.getUserMedia(
                { video: true, audio: true })
            let devices = await navigator.mediaDevices.enumerateDevices()
            
            const cameras = devices.filter(device => {
                return device.kind === 'videoinput'
            })
            if (cameras.length >= 1) console.log('cameras avail')

            const mics = devices.filter(device => {
                return device.kind === 'audioinput'
            })
            if (mics.length >= 1) console.log('mics avail')

            const outputs = devices.filter(device => {
                return device.kind === 'audiooutput'
            })
            if (outputs.length >= 1) console.log('outputs avail')
            
            /* release stream */
            const tracks = mediaStream.getTracks()
            if (tracks) {
                for (let t = 0; t < tracks.length; t++) tracks[t].stop()
            }
            return ({ cameras, mics, outputs })
        } catch (error) {
            /* user refused permission, or media busy, or some other problem */
            console.error(error.name, error.message)
            return ({ cameras: [], mics: [], outputs:[] })
        }
    }
    else throw ('media device stuff not available in this browser')
}