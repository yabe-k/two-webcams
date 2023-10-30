function captureImage(video, w, h){
    const canvas = document.getElementById("picture")
    const soundFile = "./sound/sound2.mp3";
    const audio = new Audio(soundFile);
    audio.play();
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, w, h);

    var device_name = document.getElementById("camera-name").value;
    if (device_name == ""){
        device_name = document.getElementById("select-camera").value.slice(-16);
    }

    var filename = device_name + "_" + getTime() + ".png";

    canvas.toBlob( blob =>{
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        console.log(filename);
        a.download = filename;
        a.click();

        URL.revokeObjectURL(a.href);
        
    },"image/png",1.0);

}

function getTime(){
    now = new Date();
    return now.getFullYear() + "-" + ("00" + String(Number(now.getMonth()) + 1)).slice(-2) + "-" + ("00" + now.getDate()).slice(-2) + "_" + ("00" + now.getHours()).slice(-2) + "-" + ("00" + now.getMinutes()).slice(-2)+ "-" + ("00" + now.getSeconds()).slice(-2)
}

async function playVideo(){
    const video = document.getElementById("video");
    const tracks = video.srcObject.getTracks();
    tracks.forEach(track => {
        track.stop();
    });
    video.srcObject = null;

    var selectedId = document.getElementById("select-camera").value;
    //console.log(selectedId);
    video_stream = await navigator.mediaDevices.getUserMedia({
        video: {
            deviceId: selectedId,
            width: video_width,
            height: video_height,
        },
        audio: false,
    }).catch(e => {
        console.log(e);
    })
    video.srcObject = video_stream;
    video.play();
    canvas = document.getElementById("picture");
    canvas.width = video_width;
    canvas.height = video_height;
}

async function playVideo_and_getCamera(){
    const video = document.getElementById("video");
    video_stream = await navigator.mediaDevices.getUserMedia({
        video: {
            width: video_width,
            height: video_height,
        },
        audio: false,
    }).catch(e => {
      console.log(e)
    })
    video.srcObject = video_stream;
    video.play();
    navigator.mediaDevices.enumerateDevices()
        .then(
            function(devices){
                var select = document.getElementById("select-camera");
                devices.forEach(function(device) {
                    //console.log(device.kind, device.label);
                    var option = document.createElement("option");
                    option.text = device.label;
                    option.value = device.deviceId;
                    select.appendChild(option);
                });
            }
        ).catch(
            console.log("Failed to load the device list")
        ).finally(()=>{
            canvas = document.getElementById("picture");
            canvas.width = video_width;
            canvas.height = video_height;
        });
}